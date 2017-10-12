package org.chatterbaby.chatterbaby;

import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.os.Handler;
import android.preference.PreferenceManager;
import android.support.v7.app.AppCompatActivity;
import android.text.TextUtils;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Calendar;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class
RegisterEmail extends AppCompatActivity {
    private String emailValue;
    private EditText inputEmail;

    // Server variables
    static String serverURL = "http://chatterbaby.org/app-ws/app/process-data-v2";
    static String mode = "survey";

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_registeremail);

        inputEmail = (EditText) findViewById(R.id.editEmail);
        Button submitEmailBtn = (Button) findViewById(R.id.submitEmail);

        submitEmailBtn.setOnClickListener(new View.OnClickListener() {
            public void onClick(View view) {
                submitForm();
            }
        });
    }

    private static boolean isValidEmail(String email) {
        return !TextUtils.isEmpty(email) && android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches();
    }

    private boolean validateEmail() {
        emailValue = inputEmail.getText().toString().trim();

        if (emailValue.isEmpty() || !isValidEmail(emailValue)) {
            Toast.makeText(getApplicationContext(), "Please try entering your email again.", Toast.LENGTH_LONG).show();
            return false;
        }
        return true;
    }

    private void submitForm() {
        if (validateEmail()) {
            String json = createEmailjson();
            RequestBody requestBody = new MultipartBody.Builder()
                    .setType(MultipartBody.FORM)
                    .addFormDataPart("mode", mode)
                    .addFormDataPart("token", "")
                    .addFormDataPart("data", json)
                    .build();
            //RequestBody body = RequestBody.create(MediaType.parse("application/json; charset=utf-8"), json);
            Request request = new Request.Builder()
                    .url(serverURL)
                    .addHeader("Content-Type", "application/json")
                    .post(requestBody)
                    .build();
            System.out.println("1");
            OkHttpClient client = new OkHttpClient();
            System.out.println("2");

            client.newCall(request).enqueue(new Callback() {
                @Override
                public void onFailure(Call call, IOException e) {
                    e.printStackTrace();
                }

                @Override
                public void onResponse(Call call, Response response) throws IOException {

                    // Use the response.
                    int responseCode = response.code();
                    System.out.println("Response code: " + response.code());
                    String result = response.body().string();
                    System.out.println(result);
                    if (responseCode == 200) {
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                final SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(getApplicationContext());
                                SharedPreferences.Editor editor = prefs.edit();
                                editor.putString("Email", emailValue);
                                editor.apply();
                                Toast.makeText(getApplicationContext(), "Thank you!", Toast.LENGTH_SHORT).show();
                                finish();
                            }
                        });
                    } else {
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                Toast.makeText(getApplicationContext(), "Server connection error. Please try again!", Toast.LENGTH_LONG).show();
                                //TO DO: generate error logs
                            }
                        });
                    }
                }
            });
        }
    }

    private String getDateTime() {
        Calendar cal = Calendar.getInstance();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-mm-dd HH:mm:ss");
        return sdf.format(cal.getTime());
    }

    private String createEmailjson() {
        String date = getDateTime();
        JSONObject jObj = new JSONObject();
        try {
            jObj.put("email", emailValue);
            jObj.put("timestamp", date);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return jObj.toString();
    }
}