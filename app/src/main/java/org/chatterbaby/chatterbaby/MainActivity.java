package org.chatterbaby.chatterbaby;

import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.design.widget.NavigationView;
import android.support.v4.view.GravityCompat;
import android.support.v4.widget.DrawerLayout;
import android.support.v7.app.ActionBarDrawerToggle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.MenuItem;

public class MainActivity extends AppCompatActivity implements NavigationView.OnNavigationItemSelectedListener {

    public final static String EXTRA_MESSAGE = "org.chatterbaby.chatterbaby.MESSAGE";

    // Drawer components
    private DrawerLayout drawerLayout;

    private String EULA_PREFIX = "appeula";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.drawer_layout);

        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        // Set drawer components
        drawerLayout = (DrawerLayout) findViewById(R.id.drawer_layout);
        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(
                this, drawerLayout, toolbar, R.string.navigation_drawer_open, R.string.navigation_drawer_close);
        drawerLayout.addDrawerListener(toggle);
        toggle.syncState();

        NavigationView navigationView = (NavigationView) findViewById(R.id.nav_view);
        navigationView.setNavigationItemSelectedListener(this);

        // The eulaKey changes every time you increment the version number in the AndroidManifest.xml
        PackageInfo versionInfo = getPackageInfo();
        final String eulaKey = EULA_PREFIX + versionInfo.versionCode;
        final SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(this);
        boolean hasAccepted = prefs.getBoolean(eulaKey, false);
        if (!hasAccepted) {
            new AppEula(this, eulaKey, prefs).show();
        }
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
    public void onBackPressed() {
        DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        if (drawer.isDrawerOpen(GravityCompat.START)) {
            drawer.closeDrawer(GravityCompat.START);
        } else {
            super.onBackPressed();
        }
    }

    @SuppressWarnings("StatementWithEmptyBody")
    @Override
    public boolean onNavigationItemSelected(MenuItem item) {
        // Handle navigation view item clicks here.
        int id = item.getItemId();

        if (id == R.id.nav_record) {
            Intent recordingIntent = new Intent(this, RecordingActivity.class);
            startActivity(recordingIntent);
        } else if (id == R.id.nav_questionnaire) {
            Intent questionIntent = new Intent(this, QuestionnaireActivity.class);
            startActivity(questionIntent);
        } else if (id == R.id.nav_aboutus) {
            Intent aboutUsIntent = new Intent(this, AboutUsActivity.class);
            startActivity(aboutUsIntent);
        } else if (id == R.id.nav_faq) {
            Intent faqIntent = new Intent(this, FAQActivity.class);
            startActivity(faqIntent);
        }

        DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        drawer.closeDrawer(GravityCompat.START);
        return true;
    }
}