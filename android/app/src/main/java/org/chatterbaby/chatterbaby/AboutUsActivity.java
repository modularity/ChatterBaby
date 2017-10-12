package org.chatterbaby.chatterbaby;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.ActionBar;
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

        setToolbar();

        // About Us text
        String aboutUsText = this.getString(R.string.about_us);
        TextView aboutUsTV = new TextView(this);
        aboutUsTV.setText(aboutUsText);
        aboutUsTV.setMovementMethod(new ScrollingMovementMethod());

        // Contact button
        Button contactBtn = (Button) findViewById(R.id.contactBtn);
        contactBtn.setOnClickListener(this);
    }

    public void onClick(View v) {
        Intent contactIntent = new Intent(this, ContactActivity.class);
        startActivity(contactIntent);
    }

    private void setToolbar() {
        // Attaching the layout to the toolbar object
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        // Setting toolbar as the ActionBar with setSupportActionBar() call
        setSupportActionBar(toolbar);
        ActionBar ab = getSupportActionBar();
        ab.setDisplayHomeAsUpEnabled(true);
    }
}
