package org.chatterbaby.chatterbaby;

        import android.animation.ObjectAnimator;
        import android.content.Context;
        import android.content.Intent;
        import android.os.AsyncTask;
        import android.support.v7.app.ActionBar;
        import android.support.v7.app.AppCompatActivity;
        import android.support.v7.widget.Toolbar;

        import android.media.MediaPlayer;
        import android.media.MediaRecorder;

        import android.os.Bundle;
        import android.os.Environment;

        import android.util.Log;
        import android.view.Menu;
        import android.view.MenuItem;
        import android.view.View;
        import android.view.animation.Animation;
        import android.view.animation.AnimationUtils;
        import android.view.animation.DecelerateInterpolator;
        import android.widget.Button;

        import android.widget.ImageView;
        import android.widget.ProgressBar;
        import android.widget.Toast;

        import org.json.JSONException;
        import org.json.JSONObject;

        import java.io.BufferedReader;
        import java.io.BufferedWriter;
        import java.io.File;
        import java.io.IOException;
        import java.io.InputStream;
        import java.io.InputStreamReader;
        import java.io.OutputStreamWriter;
        import java.io.UnsupportedEncodingException;
        import java.io.Writer;
        import java.net.MalformedURLException;
        import java.net.ProtocolException;
        import java.net.URL;
        import java.util.Timer;
        import java.util.TimerTask;

        import javax.net.ssl.HttpsURLConnection;

        import okhttp3.Call;
        import okhttp3.Callback;
        import okhttp3.MediaType;
        import okhttp3.MultipartBody;
        import okhttp3.OkHttpClient;
        import okhttp3.Request;
        import okhttp3.RequestBody;
        import okhttp3.Response;


public class NoCryActivity extends AppCompatActivity {

    Button record, stop, send;
    private static final String TAG = "NoActivity";

    // Server variables
    static String serverURL = "http://chatterbaby.org/app-ws/app/process-data-v2";
    static String mode = "cryNoCry";

    // audiorecord variables
    private String outputFile = null;
    private MediaRecorder audioRecorder = new MediaRecorder();
    private static final int SAMPLE_RATE = 44100;
    private static final int ENCODING_BITRATE = 16000;

    // circular progress bar
    ProgressBar progressBar;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_no_cry);

        setToolbar();
        setButtonHandlers();
        prepAudioComponents();

        record.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                record.setVisibility(View.INVISIBLE);
                try {
                    audioRecorder.prepare();
                    audioRecorder.start();
                    startProgressBar();
                } catch (IOException e) {e.printStackTrace();}

                Toast.makeText(getApplicationContext(), "Recording started", Toast.LENGTH_SHORT).show();
            }
        });
    }

    // circular progress bar
    // tracks 5 seconds of audio collection
    private void startProgressBar() {
        progressBar = (ProgressBar) findViewById(R.id.circular_progress_bar);
        progressBar.setVisibility(View.VISIBLE);
        ObjectAnimator anim = ObjectAnimator.ofInt(progressBar, "progress", 0, 100);
        anim.setDuration(15000);
        anim.setInterpolator(new DecelerateInterpolator());

        // handler to send audio and display result
        // execute code after 5000 ms i.e after 5 Seconds.
        new Timer().schedule(new TimerTask() {
            @Override
            public void run() {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        audioRecorder.stop();
                        audioRecorder.reset();
                        audioRecorder.release();
                        Toast.makeText(getApplicationContext(), "Audio recorded successfully", Toast.LENGTH_SHORT).show();
                        uploadFile(outputFile);
                    }
                });
            }
        }, 5000);

        anim.start();
    }

    private void setToolbar() {
        // Attaching the layout to the toolbar object
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        // Setting toolbar as the ActionBar with setSupportActionBar() call
        setSupportActionBar(toolbar);
        ActionBar ab = getSupportActionBar();
        ab.setDisplayHomeAsUpEnabled(true);
    }

    private void setButtonHandlers() {
        record = (Button) findViewById(R.id.recordButton);
        record.setEnabled(true);
    }

    private void prepAudioComponents() {
        outputFile = Environment.getExternalStorageDirectory().getAbsolutePath() + "/recording.ACC";
        audioRecorder.reset();
        audioRecorder.setAudioSource(MediaRecorder.AudioSource.MIC);
        audioRecorder.setOutputFormat(MediaRecorder.OutputFormat.AAC_ADTS);
        audioRecorder.setAudioEncoder(MediaRecorder.AudioEncoder.AMR_NB);
        audioRecorder.setAudioEncodingBitRate(ENCODING_BITRATE);
        audioRecorder.setAudioSamplingRate(SAMPLE_RATE);
        audioRecorder.setAudioChannels(1);
        audioRecorder.setOutputFile(outputFile);
    }

    // submits algorithm mode and audio file to server
    // parses json response for probabilities and passes them to visualization(generate histogram)
    public void uploadFile(final String filePath) {
        try {
            File sourceFile = new File(filePath);
            Log.d(TAG, "File...::::" + sourceFile + " : " + sourceFile.exists());

            RequestBody requestBody = new MultipartBody.Builder()
                    .setType(MultipartBody.FORM)
                    .addFormDataPart("mode", mode)
                    .addFormDataPart("token", "")
                    .addFormDataPart("data", filePath, RequestBody.create(MediaType.parse("audio/ogg"), sourceFile))
                    .build();
            System.out.println("1");

            Request request = new Request.Builder()
                    .url(serverURL)
                    .addHeader("Content-Type", "image/jpeg")
                    .post(requestBody)
                    .build();
            System.out.println("2");
            OkHttpClient client = new OkHttpClient();
            System.out.println("3");
            client.newCall(request).enqueue(new Callback() {
                @Override public void onFailure(Call call, IOException e) {
                    e.printStackTrace();
                }

                @Override public void onResponse(Call call, Response response) throws IOException {

                    // Use the response.
                    int responseCode = response.code();
                    System.out.println("Response code: " + response.code());
                    String jsonStr="";
                    if (responseCode == 200) {
                        jsonStr = response.body().string();
                        System.out.println(jsonStr);
                        try {
                            final JSONObject jsonObj = new JSONObject(jsonStr);
                            if ( jsonObj.getString("errmsg").equals("")) {

                                // pass json to visualization activity
                                System.out.println("Starting visualization...");
                                System.out.println(jsonObj.getString("result"));
                                Intent visualizationIntent = new Intent(NoCryActivity.this, WhyCryVisualization.class);
                                visualizationIntent.putExtra("json", jsonObj.toString());
                                startActivity(visualizationIntent);
                            } else {
                                //System.out.println(jsonObj.getString("errmsg"));
                                runOnUiThread(new Runnable() {
                                    @Override
                                    public void run() {
                                        Toast.makeText(getApplicationContext(), "Sound analysis error. Please try again!", Toast.LENGTH_LONG).show();
                                        //TO DO: generate error logs
                                    }
                                });
                            }
                        } catch (JSONException e) {e.printStackTrace();}
                    }
                    else {
                        Toast.makeText(getApplicationContext(), "Server connection error. Please try again!", Toast.LENGTH_LONG).show();
                        System.out.println("Json: " + jsonStr);
                        //TO DO: generate error logs
                    }
                }
            });
        } catch (Exception e) {Log.e(TAG, "Other Error: " + e.toString());}
    }
}