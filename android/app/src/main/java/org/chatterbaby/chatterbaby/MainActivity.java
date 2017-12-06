package org.chatterbaby.chatterbaby;

import android.Manifest;
import android.animation.ObjectAnimator;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.media.MediaRecorder;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.preference.PreferenceManager;
import android.support.design.widget.NavigationView;
import android.support.v4.app.ActivityCompat;
import android.support.v4.view.GravityCompat;
import android.support.v4.widget.DrawerLayout;
import android.support.v7.app.ActionBar;
import android.support.v7.app.ActionBarDrawerToggle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.view.animation.DecelerateInterpolator;
import android.widget.Button;
import android.widget.ProgressBar;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.Toast;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

import static org.chatterbaby.chatterbaby.R.id.radioButton_isCry;
import static org.chatterbaby.chatterbaby.R.id.recordButton;

public class MainActivity extends AppCompatActivity implements NavigationView.OnNavigationItemSelectedListener {
    private static final String TAG = "RecordingActivity";

    // Drawer components
    private DrawerLayout drawerLayout;

    // permission variables
    final int PERMISSIONS_REQUEST = 444;
    String[] PERMISSIONS = new String[]{Manifest.permission.RECORD_AUDIO,
            Manifest.permission.WRITE_EXTERNAL_STORAGE, Manifest.permission.READ_EXTERNAL_STORAGE};

    // server variables
    static String serverURL = "http://chatterbaby.org/app-ws/app/process-data-v2";
    static String mode = "whyCry";

    // record variables
    private String outputFile = null;
    private MediaRecorder audioRecorder = null;
    private static final int SAMPLE_RATE = 44100;
    private static final int ENCODING_BITRATE = 16000;

    // UI variables
    ProgressBar progressBar;
    Button record;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.drawer_layout);

        setUI();
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        record.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // change on press
                record.setAlpha((float) .8);
                // only record if permissions ok
                permissionsWrapper(PERMISSIONS);
            }
        });

/*
        RadioGroup radioBtns  = (RadioGroup) findViewById(R.id.record_radioBtns);
        radioBtns.setOnCheckedChangeListener(new RadioGroup.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(RadioGroup group, int checkedId) {
                // update server variable for algorithm type
                int selectedID = group.getCheckedRadioButtonId();
                RadioButton radioButton = (RadioButton) findViewById(selectedID);
                String modeCheck = (String) radioButton.getText();
                System.out.println("modeCheck: " + modeCheck);
                switch (modeCheck) {
                    case "@string/whyCryText":
                        mode = "whyCry";
                        break;
                    case "@string/isPainText":
                        mode = "isPain";
                        break;
                    case "@string/isCryText":
                        mode = "isCry";
                        break;
                    default:
                        mode = "whyCry";
                }
                System.out.println("mode " + mode);
            }
        });
*/
    // Set drawer components
        drawerLayout = (DrawerLayout) findViewById(R.id.drawer_layout);
        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(
                this, drawerLayout, toolbar, R.string.navigation_drawer_open, R.string.navigation_drawer_close);
        drawerLayout.addDrawerListener(toggle);
        toggle.syncState();

        NavigationView navigationView = (NavigationView) findViewById(R.id.nav_view);
        navigationView.setNavigationItemSelectedListener(this);

        // The eulaKey changes every time you increment the version number in the AndroidManifest.xml
        PackageInfo versionInfo = getPackageInfo();
        final String eulaKey = "appeula" + versionInfo.versionCode;
        final SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(this);
        boolean hasAccepted = prefs.getBoolean(eulaKey, false);
        if (!hasAccepted) {
            new AppEula(this, eulaKey, prefs).show();
        }
    }

    private PackageInfo getPackageInfo() {
        PackageInfo info = null;
        try {
            info = this.getPackageManager().getPackageInfo(
                    this.getPackageName(), PackageManager.GET_ACTIVITIES);
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }
        return info;
    }

    @Override
    public void onBackPressed() {
        DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        if (drawer.isDrawerOpen(GravityCompat.START)) {
            drawer.closeDrawer(GravityCompat.START);
        } else {
            super.onBackPressed();
        }
    }

    @SuppressWarnings("StatementWithEmptyBody")
    @Override
    public boolean onNavigationItemSelected(MenuItem item) {
        // Handle navigation view item clicks here.
        int id = item.getItemId();

        if (id == R.id.nav_record) {
            Intent recordingIntent = new Intent(this, MainActivity.class);
            startActivity(recordingIntent);
        } else if (id == R.id.nav_questionnaire) {
            Intent questionIntent = new Intent(this, QuestionnaireActivity.class);
            startActivity(questionIntent);
        } else if (id == R.id.nav_aboutus) {
            Intent aboutUsIntent = new Intent(this, AboutUsActivity.class);
            startActivity(aboutUsIntent);
        } else if (id == R.id.nav_faq) {
            Intent faqIntent = new Intent(this, FAQActivity.class);
            startActivity(faqIntent);
        }

        DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        drawer.closeDrawer(GravityCompat.START);
        return true;
    }


    private void setUI() {
        // Attaching the layout to the toolbar object
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        // Setting toolbar as the ActionBar with setSupportActionBar() call
        setSupportActionBar(toolbar);
        ActionBar ab = getSupportActionBar();
        ab.setDisplayHomeAsUpEnabled(true);

        record = (Button) findViewById(recordButton);
        record.setEnabled(true);
    }

    // handle algorithm selection updates via RadioButton selectors
    public void onAlgClickHandler(View view) {
            switch (view.getId()) {
                case R.id.radioButton_isPain:
                    mode = "PainNoPain";
                    break;
                case R.id.radioButton_isCry:
                    mode = "CryNoCry";
                    break;
                case R.id.radioButton_whyCry:default:
                    mode = "whyCry";
            }
            System.out.println("mode " + mode);
    }

    private boolean permissionsWrapper(String... permissions) {
        final List<String> permissionsList = new ArrayList<>();

        for (String perm : permissions) {
            addPermission(permissionsList, perm);
        }
        if (permissionsList.size() > 0) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M)
                requestPermissions(permissionsList.toArray(new String[permissionsList.size()]),
                        PERMISSIONS_REQUEST);
            else
                ActivityCompat.requestPermissions(this, permissionsList.toArray(new String[permissionsList.size()]),
                        PERMISSIONS_REQUEST);
            return false;
        } else
            beginRecording();
        return true;
    }

    private boolean addPermission(List<String> permissionList, String permission) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (checkSelfPermission(permission) != PackageManager.PERMISSION_GRANTED)
                permissionList.add(permission);
            if (!shouldShowRequestPermissionRationale(permission))
                return false;
        }
        return true;
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String permissions[], int[] grantResults) {
        switch (requestCode) {
            case PERMISSIONS_REQUEST: {
                // If request is cancelled, the result arrays are empty.
                if (grantResults.length > 0
                        && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                    // permission was granted, yay!
                    // logic here
                    beginRecording();
                } else {
                    // permission denied, boo!
                    Toast.makeText(this, "Please enable permissions for this feature", Toast.LENGTH_SHORT).show();
                }
            }
        }
    }

    private void beginRecording() {
        System.out.println("1: prep audio components");
        outputFile = Environment.getExternalStorageDirectory().getAbsolutePath() + "/recording.AAC";
        audioRecorder = new MediaRecorder();
        audioRecorder.setAudioSource(MediaRecorder.AudioSource.MIC);
        audioRecorder.setOutputFormat(MediaRecorder.OutputFormat.AAC_ADTS);
        audioRecorder.setAudioEncoder(MediaRecorder.AudioEncoder.AAC);
        audioRecorder.setAudioEncodingBitRate(ENCODING_BITRATE);
        audioRecorder.setAudioSamplingRate(SAMPLE_RATE);
        audioRecorder.setOutputFile(outputFile);
        System.out.println("2: finish prep audio components");

        try {
            audioRecorder.prepare();
        } catch (IOException e) {
            e.printStackTrace();
        }
        audioRecorder.start();
        System.out.println("3: start");
        startProgressBar();

        Toast.makeText(getApplicationContext(), "Recording started", Toast.LENGTH_SHORT).show();
    }

    // circular progress bar
    // tracks 5 seconds of audio collection
    private void startProgressBar() {
        progressBar = (ProgressBar) findViewById(R.id.circular_progress_bar);
        progressBar.setVisibility(View.VISIBLE);
        ObjectAnimator anim = ObjectAnimator.ofInt(progressBar, "progress", 0, 100);
        anim.setDuration(15000);
        anim.setInterpolator(new DecelerateInterpolator());

        System.out.println("4: start timer");
        // handler to send audio and display result
        // execute code after 5000 ms i.e after 5 Seconds.
        new Timer().schedule(new TimerTask() {
            @Override
            public void run() {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        System.out.println("5: stop recording");
                        audioRecorder.stop();
                        audioRecorder.reset();
                        audioRecorder.release();
                        uploadFile(outputFile);
                        //reset icon settings
                        progressBar.setVisibility(View.INVISIBLE);
                        record.setAlpha((float) 1);
                    }
                });
            }
        }, 5000);

        anim.start();
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
                    .addFormDataPart("data", filePath, RequestBody.create(MediaType.parse("audio/*"), sourceFile))
                    .build();
            System.out.println("1");

            Request request = new Request.Builder()
                    .url(serverURL)
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
                                String result = jsonObj.getString("result");
                                System.out.println(result);


                                Intent visualizationIntent = new Intent(MainActivity.this, VisualizationActivity.class);
                                visualizationIntent.putExtra("json", result);
                                visualizationIntent.putExtra("mode", mode);
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





                        } catch (JSONException e) {
                            e.printStackTrace();
                            response.body().close();
                        }
                    }
                    else {
                        Toast.makeText(getApplicationContext(), "Server connection error. Please try again!", Toast.LENGTH_LONG).show();
                        System.out.println("Json: " + jsonStr);
                        response.body().close();
                        //TO DO: generate error logs
                    }
                }
            });
        } catch (Exception e) {Log.e(TAG, "Other Error: " + e.toString());}
    }
}