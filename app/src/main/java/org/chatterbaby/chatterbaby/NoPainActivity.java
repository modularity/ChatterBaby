package org.chatterbaby.chatterbaby;


import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.media.MediaRecorder;
import android.os.AsyncTask;
import android.os.Bundle;
import android.os.Environment;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;
import java.io.Writer;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.URL;

import javax.net.ssl.HttpsURLConnection;

public class NoPainActivity extends Activity {

    Button play,stop,record, send;
    private MediaRecorder audioRecorder = new MediaRecorder();
    private String outputFile = null;
    String responseServer;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_why_cry);

        //play=(Button)findViewById(R.id.play_button);
        stop=(Button)findViewById(R.id.stopbutton);
        record=(Button)findViewById(R.id.recordbutton);
        send=(Button)findViewById(R.id.sendaudio);

        stop.setEnabled(false);
        //play.setEnabled(false);
        send.setEnabled(false);
        outputFile = Environment.getExternalStorageDirectory().getAbsolutePath() + "/recording.3gp";

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
                if(audioRecorder != null){
                    audioRecorder.stop();
                    audioRecorder.release();
                    audioRecorder = null;
                }
                stop.setEnabled(false);
                //play.setEnabled(true);
                send.setEnabled(true);

                Toast.makeText(getApplicationContext(), "Audio recorded successfully",Toast.LENGTH_SHORT).show();
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
                JSONObject sendjson = new JSONObject();
                try {
                    sendjson.put("record_id", "103");
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                //new AsyncGetData(WhyCryActivity.this).execute(String.valueOf(sendjson));
                //Toast.makeText(getApplicationContext(), "Retrieving result for record id: eventually sending audio", Toast.LENGTH_SHORT).show();
                Intent visualizationIntent = new Intent(NoPainActivity.this, WhyCryVisualization.class);
                startActivity(visualizationIntent);
            }
        });
    }

    class AsyncGetData extends AsyncTask<String, String, String> {
        private Context acontext;
        public AsyncGetData(Context context) {
            acontext = context;
        }

        @Override
        protected String doInBackground(String... params) {
            // Create GetData Method to retrieve JSON structure for specific record_id
            // db fail returns result=0 and blank data
            // success returns result=1 and corresponding data

            // "{\"record_id\":\"103\",\"mode\":\"{This is a mode test.}\",\"data\":\"\"}"

            String jsonData = params[0];
            URL url;
            HttpsURLConnection conn;
            BufferedReader reader;
            String jsonResponse;

            int bytesRead, bytesAvailable, bufferSize;
            byte[] bytebuffer;
            int maxBufferSize = 1*1004*1024;

            // Send data
            try {
                // Defined URL  where to send data
                url = new URL("https://staging5.ctrl.ucla.edu:7423/app/get-data");
                // after testing, switch to app/process-data-v2

                long contentLength;
                int serverResponseCode;
                String serverResponseMessage;
//                File file = new File(OutputFile);

                // Send POST data request
                conn = (HttpsURLConnection) url.openConnection();
                conn.setDoOutput(true);
                conn.setRequestMethod("POST");
                conn.setRequestProperty("Content-Type", "multipart/form-data");

                // Append parameters to URL
                // Uri.Builder builder = new Uri.Builder()
                //          .appendQueryParameter("record_id", record_ID);
                //   String query = builder.build().getEncodedQuery();

                // Open connection for sending data
                Writer writer = new BufferedWriter(new OutputStreamWriter(conn.getOutputStream(), "UTF-8"));
                writer.write(jsonData);
                writer.close();

                // Get the server response
                InputStream input = conn.getInputStream();
                StringBuilder buffer = new StringBuilder();
                String line;
                reader = new BufferedReader(new InputStreamReader(input));

                // Read Server Response
                while ((line = reader.readLine()) != null) {
                    // Append server response in string
                    buffer.append(line + "\n");
                }

                jsonResponse = buffer.toString();
                //response data
                //send to post execute
                return jsonResponse;
            } catch (UnsupportedEncodingException e1) {
                e1.printStackTrace();
            } catch (ProtocolException e1) {
                e1.printStackTrace();
            } catch (MalformedURLException e1) {
                e1.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }
            return null;
        }
        @Override
        protected void onPostExecute(String result) {
            Toast.makeText(acontext, "Results: " + result, Toast.LENGTH_SHORT).show();
        }
    }
}