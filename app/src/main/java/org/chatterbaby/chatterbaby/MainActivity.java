package org.chatterbaby.chatterbaby;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.graphics.Color;

import com.google.android.gms.appindexing.Action;
import com.google.android.gms.appindexing.AppIndex;
import com.google.android.gms.common.api.GoogleApiClient;

public class MainActivity extends AppCompatActivity implements View.OnClickListener {
    /**
     * ATTENTION: This was auto-generated to implement the App Indexing API.
     * See https://g.co/AppIndexing/AndroidStudio for more information.
     */
    private GoogleApiClient client;


    public final static String EXTRA_MESSAGE = "org.chatterbaby.chatterbaby.MESSAGE";

    private Button[] btn = new Button[3];
    private Button btn_unfocus;
    private int[] btn_id = {R.id.questionBtn, R.id.whyCryBtn, R.id.noCryBtn};

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Attaching the layout to the toolbar object
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        // Setting toolbar as the ActionBar with setSupportActionBar() call
        setSupportActionBar(toolbar);

        // Show EULA
        new AppEula(this).show();

        for (int i = 0; i < btn.length; i++) {
            btn[i] = (Button) findViewById(btn_id[i]);
            btn[i].setBackgroundColor(Color.rgb(155,153,255));
            btn[i].setOnClickListener(this);
        }

        btn_unfocus = btn[0];
        // ATTENTION: This was auto-generated to implement the App Indexing API.
        // See https://g.co/AppIndexing/AndroidStudio for more information.
        client = new GoogleApiClient.Builder(this).addApi(AppIndex.API).build();
    }

    // Called when the user clicks the Send button
    // Build intent to move to questionnaire
 /*   public void sendMessage(View view) {
        Intent intent = new Intent(this, QuestionnaireActivity.class);
        EditText editText = (EditText) findViewById(R.id.edit_message);
        String message = editText.getText().toString();
        intent.putExtra(EXTRA_MESSAGE, message);
        startActivity(intent);
    }
*/


    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.questionBtn:
                setFocus(btn_unfocus, btn[0]);
                btn_unfocus = btn[0];
                Intent questionIntent = new Intent(this, QuestionnaireActivity.class);
                startActivity(questionIntent);
                break;

            case R.id.whyCryBtn:
                setFocus(btn_unfocus, btn[1]);
                btn_unfocus = btn[1];
                Intent whyCryIntent = new Intent(this, WhyCryActivity.class);
                startActivity(whyCryIntent);
                break;

            case R.id.noCryBtn:
                setFocus(btn_unfocus, btn[2]);
                btn_unfocus = btn[2];
                Intent noCryIntent = new Intent(this, NoCryActivity.class);
                startActivity(noCryIntent);
                break;

        }
    }

    private void setFocus(Button btn_unfocus, Button btn_focus) {
       btn_unfocus.setTextColor(Color.rgb(49, 50, 51));
       btn_unfocus.setBackgroundColor(Color.rgb(191,201,245));
        //122,213,198
        //191,169,245
        //191,201,245
        btn_focus.setTextColor(Color.rgb(255, 255, 255));
        btn_focus.setBackgroundColor(Color.rgb(191,169,245));
    }

    @Override
    public void onStart() {
        super.onStart();

        // ATTENTION: This was auto-generated to implement the App Indexing API.
        // See https://g.co/AppIndexing/AndroidStudio for more information.
        client.connect();
        Action viewAction = Action.newAction(
                Action.TYPE_VIEW, // TODO: choose an action type.
                "Main Page", // TODO: Define a title for the content shown.
                // TODO: If you have web page content that matches this app activity's content,
                // make sure this auto-generated web page URL is correct.
                // Otherwise, set the URL to null.
                Uri.parse("http://host/path"),
                // TODO: Make sure this auto-generated app URL is correct.
                Uri.parse("android-app://org.chatterbaby.chatterbaby/http/host/path")
        );
        AppIndex.AppIndexApi.start(client, viewAction);
    }

    @Override
    public void onStop() {
        super.onStop();

        // ATTENTION: This was auto-generated to implement the App Indexing API.
        // See https://g.co/AppIndexing/AndroidStudio for more information.
        Action viewAction = Action.newAction(
                Action.TYPE_VIEW, // TODO: choose an action type.
                "Main Page", // TODO: Define a title for the content shown.
                // TODO: If you have web page content that matches this app activity's content,
                // make sure this auto-generated web page URL is correct.
                // Otherwise, set the URL to null.
                Uri.parse("http://host/path"),
                // TODO: Make sure this auto-generated app URL is correct.
                Uri.parse("android-app://org.chatterbaby.chatterbaby/http/host/path")
        );
        AppIndex.AppIndexApi.end(client, viewAction);
        client.disconnect();
    }



}