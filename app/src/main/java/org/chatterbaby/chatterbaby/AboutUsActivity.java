package org.chatterbaby.chatterbaby;

import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.support.design.widget.FloatingActionButton;
import android.support.design.widget.Snackbar;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.text.method.ScrollingMovementMethod;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

public class AboutUsActivity extends AppCompatActivity implements View.OnClickListener {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_about_us);

        // About Us text
        String aboutUsText = this.getString(R.string.about_us);
        TextView aboutUsTV = new TextView(this);
        aboutUsTV.setText(aboutUsText);
        aboutUsTV.setMovementMethod(new ScrollingMovementMethod());

        // Contact button
        Button contactBtn = (Button) findViewById(R.id.contactBtn);
        contactBtn.setOnClickListener(this);
        contactBtn.setBackgroundColor(Color.rgb(155,153,255));
    }
    public void onClick(View v) {
        Intent contactIntent = new Intent(this, ContactActivity.class);
        startActivity(contactIntent);
    }
}
