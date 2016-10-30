package org.chatterbaby.chatterbaby; /**
 * This file provides simple End User License Agreement
 * It shows a simple dialog with the license text, and two buttons.
 * If user clicks on 'cancel' button, app closes and user will not be granted access to app.
 * If user clicks on 'accept' button, app access is allowed and this choice is saved in preferences
 * so next time this will not show, until next upgrade.
 */

//import android.support.v7.appcompat.R;
import android.app.Activity;
import android.app.AlertDialog;
import android.app.Dialog;
import android.content.DialogInterface;
import android.content.SharedPreferences;
import android.content.pm.ActivityInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.preference.PreferenceManager;
import android.webkit.WebView;

public class AppEula {
    private String EULA_PREFIX = "appeula";
    private Activity mActivity;
    private String appEULAlink = "https://docs.google.com/a/g.ucla.edu/document/d/1Kk5sS_TZco67vvpb4SCk9bvGAR89szXWqlye-AhISpo/edit?usp=sharing";

    public AppEula(Activity context) {
        mActivity = context;
    }

    private PackageInfo getPackageInfo() {
        PackageInfo info = null;
        try {
            info = mActivity.getPackageManager().getPackageInfo(
                    mActivity.getPackageName(), PackageManager.GET_ACTIVITIES);
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }
        return info;
    }

    public void show() {
        PackageInfo versionInfo = getPackageInfo();

        // The eulaKey changes every time you increment the version number in the AndroidManifest.xml
        final String eulaKey = EULA_PREFIX + versionInfo.versionCode;
        final SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(mActivity);
        boolean hasAccepted = prefs.getBoolean(eulaKey, false);
        if (!hasAccepted) {
            // EULA title
            String title = mActivity.getString(R.string.app_name);
            //+ " v" + versionInfo.versionName;

            // Disable orientation changes, to prevent parent activity
            mActivity.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);

            // create a WebView with the current EULA
            WebView webView = new WebView(mActivity);
            webView.loadUrl(appEULAlink);

            AlertDialog.Builder builder = new AlertDialog.Builder(mActivity)
                    .setTitle(title)
                    .setView(webView)
                    .setCancelable(false)
                    .setPositiveButton(R.string.accept, new Dialog.OnClickListener() {
                                @Override
                                public void onClick(
                                        DialogInterface dialogInterface, int i) {
                                    // Mark this version as read.
                                    SharedPreferences.Editor editor = prefs.edit();
                                    editor.putBoolean(eulaKey, true);
                                    editor.commit();

                                    // Close dialog
                                    dialogInterface.dismiss();

                                    // Enable orientation changes based on device's sensor
                                    mActivity.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_SENSOR);

                                    /// move to email activity
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
}