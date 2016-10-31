package org.chatterbaby.chatterbaby; /**
 * This file provides simple End User License Agreement
 * It shows a simple dialog with the license text, and two buttons.
 * If user clicks on 'cancel' button, app closes and user will not be granted access to app.
 * If user clicks on 'accept' button, app access is allowed and this choice is saved in preferences
 * so next time this will not show, until next upgrade.
 */

import android.app.Activity;
import android.app.AlertDialog;
import android.app.Dialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.ActivityInfo;
import android.graphics.Color;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class AppEula {
    private String eulaKey;
    private SharedPreferences prefs;
    private Activity mActivity;
    private String appEULAlink = "http://docs.google.com/document/d/1Kk5sS_TZco67vvpb4SCk9bvGAR89szXWqlye-AhISpo/edit?usp=sharing";
    AppEula(Activity context, String eula, SharedPreferences sp) {
        mActivity = context;
        eulaKey = eula;
        prefs = sp;
    }

    public void show() {

        // EULA title
        String title = mActivity.getString(R.string.app_name);
        //+ " v" + versionInfo.versionName;

        // Disable orientation changes, to prevent parent activity
        mActivity.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);

        // create a WebView with the current EULA
        WebView webView = new WebView(mActivity);
        webView.loadUrl(appEULAlink);
        webView.setBackgroundColor(Color.rgb(235,235,240));
        webView.setWebViewClient(new WebViewClient());

        AlertDialog.Builder builder = new AlertDialog.Builder(mActivity)
                .setTitle(title)
                .setView(webView)
                .setCancelable(false)
                .setIcon(R.mipmap.logo_chatterbaby)
                .setPositiveButton(R.string.accept, new Dialog.OnClickListener() {
                    @Override
                    public void onClick(
                            DialogInterface dialogInterface, int i) {
                        // Mark this version as read.
                        SharedPreferences.Editor editor = prefs.edit();
                        editor.putBoolean(eulaKey, true);
                        editor.apply();

                        // Close dialog
                        dialogInterface.dismiss();

                        // Enable orientation changes based on device's sensor
                        mActivity.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_SENSOR);

                        Intent registerIntent = new Intent(mActivity, RegisterEmail.class);
                        mActivity.startActivity(registerIntent);
                    }
                })
                .setNegativeButton(android.R.string.cancel, new Dialog.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        // Close the activity as they have declined the EULA
                        mActivity.finish();
                        mActivity.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_SENSOR);
                    }

                });
        builder.create().show();
    }
}