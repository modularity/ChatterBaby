package org.chatterbaby.chatterbaby;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.media.Image;
import android.os.Bundle;
import android.os.Environment;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import java.io.File;


public class WhyCryVisualization extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_why_cry_visualization);

      /*
        // retrieve image path from algorithm response
        Intent intent = getIntent();
        String jpgPath = intent.getStringExtra("imageFile");
        System.out.println(jpgPath);

        // display image result
        ImageView imgView= (ImageView) findViewById(R.id.imageView);


        BitmapFactory.Options options = new BitmapFactory.Options();
        options.inSampleSize = 2;
        Bitmap bm = BitmapFactory.decodeFile(jpgPath, options);
        imgView.setImageBitmap(bm);
        //imgView.setImageDrawable(Drawable.createFromPath(jpgPath));
        //imgView.setVisibility(View.VISIBLE);
        */
    }

}
