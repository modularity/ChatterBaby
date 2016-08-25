package org.chatterbaby.chatterbaby;


import android.net.Uri;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;
import java.io.Writer;
import java.net.HttpURLConnection;
import java.net.URL;

import javax.net.ssl.HttpsURLConnection;


public class ServerConnection {


    // Create ProcessData Method to sends JSON structure to create specific record_id
    // db fail returns result=0 and blank record_id
    // success returns result=1 and corresponding record_id
    public String ProcessData() throws UnsupportedEncodingException {

        // Get defined values
 /*       mode = "mode";
        token = "token";
        data = "data";
        result = "data1";
        record_ID = "1";
        */

        String response = "";

        // Send data
        try {
            // Defined URL  where to send data
            URL url = new URL("https://staging5.ctrl.ucla.edu:7423/app/get-data");

            // Send POST data request
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setReadTimeout(15000);
            conn.setConnectTimeout(15000);
            conn.setRequestMethod("POST");
            conn.setDoInput(true);
            conn.setDoOutput(true);

            conn.connect();

            int responseCode = conn.getResponseCode();

            if (responseCode == HttpURLConnection.HTTP_OK) {
                String line;
                BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                while ((line = br.readLine()) != null) {
                    response += line;
                }
            } else {
                response = "";
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return response;
    }

    // Create GetData Method to retrieve JSON structure for specific record_id
    // db fail returns result=0 and blank data
    // success returns result=1 and corresponding data

    public String getData(String record_ID) {
        // "{\"record_id\":\"103\",\"mode\":\"{This is a mode test.}\",\"data\":\"\"}"

        URL url;
        HttpsURLConnection conn = null;
        BufferedReader reader = null;
        String data = null;

        // Send data
        try {
            // Defined URL  where to send data
            url = new URL("https://staging5.ctrl.ucla.edu:7423/app/get-data");
            // after testing, switch to app/process-data-v2

            // Send POST data request
            conn = (HttpsURLConnection) url.openConnection();
            conn.setDoOutput(true);
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setRequestProperty("Accept", "application/json");

            // Append parameters to URL
           // Uri.Builder builder = new Uri.Builder()
          //          .appendQueryParameter("record_id", record_ID);
         //   String query = builder.build().getEncodedQuery();
            JSONObject sendjson = new JSONObject();
            sendjson.put("record_id", record_ID);

            // Open connection for sending data
            Writer writer = new BufferedWriter(new OutputStreamWriter(conn.getOutputStream(), "UTF-8"));
            writer.write(sendjson.toString());
            writer.close();

            int response_code = conn.getResponseCode();

            // Check if successful connection made
            if (response_code == HttpURLConnection.HTTP_OK) {

                // Get the server response
                InputStream input = conn.getInputStream();
                StringBuffer buffer = new StringBuffer();
                String line = null;
                reader = new BufferedReader(new InputStreamReader(input));

                // Read Server Response
                while ((line = reader.readLine()) != null) {
                    // Append server response in string
                    buffer.append(line + "\n");
                }
                data = buffer.toString();
                input.close();
                writer.close();
            }
            // Show response on activity
            return data;
        } catch (JSONException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            conn.disconnect();
        }
        return data;
    }
}
