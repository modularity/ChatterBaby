package org.chatterbaby.chatterbaby;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toolbar;

public class QuestionnaireActivity extends Activity implements View.OnClickListener {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_webquestionnaire);

        Intent intent = getIntent();

        // Questionnaire link button
        Button contactBtn = (Button) findViewById(R.id.questionBtn);
        contactBtn.setOnClickListener(this);
        contactBtn.setBackgroundColor(Color.rgb(155,153,255));
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle app bar item clicks here. The app bar
        // automatically handles clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();
        /*if (id == R.id.action_settings) {
            return true;
        }
        */
        return super.onOptionsItemSelected(item);
    }

    public void onClick(View v) {
        Intent webQuestIntent = new Intent();
        webQuestIntent.setAction(Intent.ACTION_VIEW);
        webQuestIntent.addCategory(Intent.CATEGORY_BROWSABLE);
        webQuestIntent.setData(Uri.parse("http://www.chatterbaby.org"));
        startActivity(webQuestIntent);
    }
}