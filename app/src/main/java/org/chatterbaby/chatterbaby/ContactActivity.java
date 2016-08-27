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

public class ContactActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_contact);
        Intent intent = getIntent();

        // Contact Us text
        String contactText = this.getString(R.string.contact_info);
        TextView contactTV = new TextView(this);
        contactTV.setText(contactText);
        contactTV.setMovementMethod(new ScrollingMovementMethod());
    }

}
