package org.chatterbaby.chatterbaby;

import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.View;
import android.widget.Button;
import android.graphics.Color;

public class MainActivity extends AppCompatActivity implements View.OnClickListener {

    public final static String EXTRA_MESSAGE = "org.chatterbaby.chatterbaby.MESSAGE";

    private Button[] btn = new Button[5];
    private int[] btn_id = {R.id.whyCryBtn, R.id.noCryBtn, R.id.noPainBtn, R.id.questionBtn, R.id.aboutUs};
    private Button btn_unfocus;

    private String EULA_PREFIX = "appeula";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        setToolbar();

        // First time opening app: Show EULA and save email
        // The eulaKey changes every time you increment the version number in the AndroidManifest.xml
        PackageInfo versionInfo = getPackageInfo();
        final String eulaKey = EULA_PREFIX + versionInfo.versionCode;
        final SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(this);
        boolean hasAccepted = prefs.getBoolean(eulaKey, false);
        if (!hasAccepted) {
            new AppEula(this, eulaKey, prefs).show();
        }

        for (int i = 0; i < btn.length; i++) {
            btn[i] = (Button) findViewById(btn_id[i]);
            btn[i].setOnClickListener(this);
        }
    }

    private void setToolbar() {
        // Attaching the layout to the toolbar object
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        // Setting toolbar as the ActionBar with setSupportActionBar() call
        setSupportActionBar(toolbar);
        toolbar.setLogo(R.mipmap.logo_chatterbaby);
        getSupportActionBar().setDisplayShowTitleEnabled(false);
        getSupportActionBar().setHomeButtonEnabled(true);
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
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.whyCryBtn:
                Intent whyCryIntent = new Intent(this, WhyCryActivity.class);
                startActivity(whyCryIntent);
                break;
            case R.id.noCryBtn:
                Intent noCryIntent = new Intent(this, NoCryActivity.class);
                startActivity(noCryIntent);
                break;
            case R.id.noPainBtn:
                Intent noPainIntent = new Intent(this, NoPainActivity.class);
                startActivity(noPainIntent);
                break;
            case R.id.questionBtn:
                Intent questionIntent = new Intent(this, QuestionnaireActivity.class);
                startActivity(questionIntent);
                break;
            case R.id.aboutUs:
                Intent aboutUsIntent = new Intent(this, AboutUsActivity.class);
                startActivity(aboutUsIntent);
                break;
        }
    }

    private void setFocus(Button btn_focus) {
        //btn_focus.setTextColor(Color.rgb(49, 50, 51));
        btn_focus.setBackgroundColor(Color.rgb(191,201,245));
        //122,213,198
        //191,169,245
        //191,201,245
        btn_focus.setTextColor(Color.rgb(255, 255, 255));
        //btn_focus.setBackgroundColor(Color.rgb(191,169,245));
        // UCLA official blue: 50, 132, 191
        /*
        #6ec4f5
        #7047e1
        #bfc9f5
         */
        btn_focus.setBackgroundColor(Color.rgb(155,153,255));
    }
}