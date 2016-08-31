package org.chatterbaby.chatterbaby;

import android.app.Activity;
import android.media.MediaRecorder;
import android.os.Bundle;
import android.os.Environment;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import java.io.File;
import java.io.IOException;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.Headers;
import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;



public class WhyCryActivity extends Activity {

    Button play, stop, record, send;
    private MediaRecorder audioRecorder = new MediaRecorder();
    private String outputFile = null;
    private static final String TAG = "WhyCryActivity";
   //static String serverURL = "https://staging5.ctrl.ucla.edu:7423/app-ws/app/get-data";
    static String serverURL = "https://staging5.ctrl.ucla.edu:7423/app-ws/app/process-data";
    static String mode = "whyCry";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_why_cry);

        //play=(Button)findViewById(R.id.play_button);
        stop = (Button) findViewById(R.id.stopbutton);
        record = (Button) findViewById(R.id.recordbutton);
        send = (Button) findViewById(R.id.sendaudio);

        stop.setEnabled(false);
        //play.setEnabled(false);
        send.setEnabled(false);
        outputFile = Environment.getExternalStorageDirectory().getAbsolutePath() + "/recording.wav";

        audioRecorder.reset();
        audioRecorder.setAudioSource(MediaRecorder.AudioSource.MIC);
        audioRecorder.setOutputFormat(MediaRecorder.OutputFormat.DEFAULT);
        audioRecorder.setAudioEncoder(MediaRecorder.OutputFormat.DEFAULT);
        audioRecorder.setOutputFile(outputFile);

        record.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                try {
                    audioRecorder.prepare();
                    audioRecorder.start();
                } catch (IllegalStateException e) {
                    e.printStackTrace();
                } catch (IOException e) {
                    e.printStackTrace();
                }

                record.setEnabled(false);
                stop.setEnabled(true);

                Toast.makeText(getApplicationContext(), "Recording started", Toast.LENGTH_SHORT).show();
            }
        });

        stop.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (audioRecorder != null) {
                    audioRecorder.stop();
                    audioRecorder.release();
                    audioRecorder = null;
                }
                stop.setEnabled(false);
                //play.setEnabled(true);
                send.setEnabled(true);

                Toast.makeText(getApplicationContext(), "Audio recorded successfully", Toast.LENGTH_SHORT).show();
            }
        });
/*
        play.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) throws IllegalArgumentException,SecurityException,IllegalStateException {
                MediaPlayer m = new MediaPlayer();

                try {
                    m.setDataSource(outputFile);
                } catch (IOException e) {
                    e.printStackTrace();
                } try {
                    m.prepare();
                } catch (IOException e) {
                    e.printStackTrace();
                }

                m.start();
                Toast.makeText(getApplicationContext(), "Playing audio", Toast.LENGTH_SHORT).show();
            }
        });
*/
        send.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String recordID = "record_id";
                String recordRequest = "103";

                //new AsyncGetData(WhyCryActivity.this, recordID, recordRequest).execute();
                uploadFile(outputFile);


                //Toast.makeText(getApplicationContext(), "Retrieving result for record id: eventually sending audio", Toast.LENGTH_SHORT).show();
                //Intent visualizationIntent = new Intent(WhyCryActivity.this, WhyCryVisualization.class);
                //startActivity(visualizationIntent);
            }
        });
    }

    ///////////////////////////////////////////////
    ////////////////////////////////////////
    /////////////////////////////////////

    ////////////////////////////////////////////////
    ///////////////////////////////////////////////
    //////////////////////////////////////////////

        // Create GetData Method to retrieve JSON structure for specific record_id
        // db fail returns result=0 and blank data
        // success returns result=1 and corresponding data

        // "{\"record_id\":\"103\",\"mode\":\"{This is a mode test.}\",\"data\":\"\"}"


    public static void uploadFile(String filePath) {
        try {
            File sourceFile = new File(filePath);
            Log.d(TAG, "File...::::" + sourceFile + " : " + sourceFile.exists());

            RequestBody requestBody = new MultipartBody.Builder()
                    .setType(MultipartBody.FORM)
             //       .addFormDataPart("record_id", "103")
                    .addFormDataPart("mode", mode)
                    .addFormDataPart("token", "")
                    .addFormDataPart("data", filePath,
                            RequestBody.create(MediaType.parse("audio/wav"), sourceFile))
                    .build();
            System.out.println("1");

            Request request = new Request.Builder()
                    .url(serverURL)
                    .post(requestBody)
                    .build();
            System.out.println("2");
            OkHttpClient client = new OkHttpClient();
            System.out.println("3");
            Response response;
                    client.newCall(request).enqueue(new Callback() {
                @Override public void onFailure(Call call, IOException e) {
                    e.printStackTrace();
                }

                @Override public void onResponse(Call call, Response response) throws IOException {
                    System.out.println(response.body().string());
                    if (!response.isSuccessful()) throw new IOException("Unexpected code " + response);

                    Headers responseHeaders = response.headers();
                    for (int i = 0, size = responseHeaders.size(); i < size; i++) {
                        System.out.println(responseHeaders.name(i) + ": " + responseHeaders.value(i));
                    }
                    response.body().close();
                }
            });
        } catch (Exception e) {
            Log.e(TAG, "Other Error: " + e.toString());
        }
    }


}