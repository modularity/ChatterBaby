package org.chatterbaby.chatterbaby;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.view.LayoutInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toolbar;

public class QuestionnaireActivity extends AppCompatActivity implements View.OnClickListener {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_webquestionnaire);

        Intent intent = getIntent();
        setToolbar();

        // Questionnaire link button
        Button contactBtn = (Button) findViewById(R.id.questionBtn);
        contactBtn.setOnClickListener(this);
    }
    private void setToolbar() {
        // Attaching the layout to the toolbar object
        android.support.v7.widget.Toolbar toolbar = (android.support.v7.widget.Toolbar) findViewById(R.id.toolbar);
        // Setting toolbar as the ActionBar with setSupportActionBar() call
        setSupportActionBar(toolbar);
        ActionBar ab = getSupportActionBar();
        ab.setDisplayHomeAsUpEnabled(true);
    }

    public void onClick(View v) {
        Intent webQuestIntent = new Intent();
        webQuestIntent.setAction(Intent.ACTION_VIEW);
        webQuestIntent.addCategory(Intent.CATEGORY_BROWSABLE);
        webQuestIntent.setData(Uri.parse("http://www.chatterbaby.org"));
        startActivity(webQuestIntent);
    }
}