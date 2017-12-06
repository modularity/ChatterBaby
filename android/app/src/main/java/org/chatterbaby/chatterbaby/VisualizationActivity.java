package org.chatterbaby.chatterbaby;

import android.graphics.Color;
import android.graphics.Typeface;
import android.os.Bundle;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.Log;

import com.github.mikephil.charting.charts.BarChart;
import com.github.mikephil.charting.components.AxisBase;
import com.github.mikephil.charting.components.XAxis;
import com.github.mikephil.charting.components.YAxis;
import com.github.mikephil.charting.data.BarData;
import com.github.mikephil.charting.data.BarDataSet;
import com.github.mikephil.charting.data.BarEntry;
import com.github.mikephil.charting.formatter.*;

import org.json.JSONException;
import org.json.JSONObject;

import java.math.BigDecimal;
import java.util.ArrayList;

public class VisualizationActivity extends AppCompatActivity {
    Float painProb;
    Float hungryProb;
    Float fussyProb;
    Float yesProb;
    Float noProb;
    String mode;
    String[] labelValues;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_visualization);

        setToolbar();
        System.gc();


        // retrieve extras from algorithm response
        String jsonStr = getIntent().getStringExtra("json");
        mode = getIntent().getStringExtra("mode");
        System.out.println("Received intent: " + jsonStr + " " + mode);
        parseJson(jsonStr, mode);

        // a BarChart is initialized from xml
        BarChart chart = (BarChart) findViewById(R.id.chart);

        // configure xaxis (states)
        XAxis xAxis = chart.getXAxis();
        xAxis.setPosition(XAxis.XAxisPosition.BOTTOM);
        xAxis.setGranularity(1f); // minimum axis-step (interval) is 1
        xAxis.setTextSize(16f);
        xAxis.setTypeface(Typeface.DEFAULT_BOLD);
        //xAxis.setValueFormatter(formatter);
        xAxis.setValueFormatter(new AxisValueFormatter() {
                @Override
                public String getFormattedValue(float value, AxisBase axis) {
                    return labelValues[(int) value];
                }
                // we don't draw numbers, so no decimal digits needed
                @Override
                public int getDecimalDigits() {  return 0; }
            }
        );
        xAxis.setDrawGridLines(false);

        // configure yaxis (probabilities)
        YAxis yAxis = chart.getAxisLeft();
        yAxis.setPosition(YAxis.YAxisLabelPosition.OUTSIDE_CHART);
        yAxis.setAxisMinValue(0f);
        yAxis.setAxisMaxValue(1f);
        yAxis.setDrawGridLines(false);

        // set data within chart
        BarData data = new BarData(getDataSet(mode));
        data.setBarWidth(0.8f); // set custom bar width
        chart.setData(data);
        chart.getAxisRight().setDrawLabels(false);
        chart.getAxisRight().setDrawGridLines(false);
        chart.setDescriptionPosition(0,0);
        chart.animateY(2400);
        chart.setFitBars(true); // make the x-axis fit exactly all bars

        chart.setHardwareAccelerationEnabled(true);
        chart.setDrawValueAboveBar(false);
        chart.invalidate(); // refresh

        Log.i("Visualization", "displayed image result");
    }


    private void setToolbar() {
        // Attaching the layout to the toolbar object
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        // Setting toolbar as the ActionBar with setSupportActionBar() call
        setSupportActionBar(toolbar);
        ActionBar ab = getSupportActionBar();
        ab.setDisplayHomeAsUpEnabled(true);
    }

    private void parseJson(String jsonStr, String mode) {
        if (jsonStr != null) {
            try {
                JSONObject jsonObj = new JSONObject(jsonStr);
                if (mode.equals("PainNoPain")) {
                    yesProb = BigDecimal.valueOf(jsonObj.getDouble("Pain")).floatValue();
                    noProb = 1-yesProb;
                    labelValues = new String[]{"Pain", "No Pain"};
                } else if (mode.equals("CryNoCry")) {
                    yesProb = BigDecimal.valueOf(jsonObj.getDouble("Crying")).floatValue();
                    noProb = 1-yesProb;
                    labelValues = new String[]{"Cry", "No Cry"};
                } else if (mode.equals("whyCry")) {
                    painProb = BigDecimal.valueOf(jsonObj.getDouble("Pain")).floatValue();
                    hungryProb = BigDecimal.valueOf(jsonObj.getDouble("Hungry")).floatValue();
                    fussyProb = BigDecimal.valueOf(jsonObj.getDouble("Fussy")).floatValue();
                    labelValues = new String[]{"Pain", "Hungry", "Fussy"};
                }
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
    }

    private BarDataSet getDataSet(String mode) {

        // create dataset
        ArrayList<BarEntry> entries = new ArrayList<>();

        /* hardcoded values for testing
        entries.add(new BarEntry(0f, .1f));
        entries.add(new BarEntry(1f, .65f));
        entries.add(new BarEntry(2f, .25f));
        */

        if (mode.equals("PainNoPain")) {
            entries.add(new BarEntry(0f, yesProb));
            entries.add(new BarEntry(1f, noProb));
        } else if (mode.equals("CryNoCry")) {
            entries.add(new BarEntry(0f, yesProb));
            entries.add(new BarEntry(1f, noProb));
        } else if (mode.equals("whyCry")) {
            entries.add(new BarEntry(0f, painProb));
            entries.add(new BarEntry(1f, hungryProb));
            entries.add(new BarEntry(2f, fussyProb));
        }
        BarDataSet barDataSet = new BarDataSet(entries, "Probability of state");
        barDataSet.setDrawValues(false);
        barDataSet.setColors(new int[]{Color.rgb(245, 131, 87), Color.rgb(253, 186, 49), Color.rgb(95, 151, 203)});
        barDataSet.setValueTextSize(14f);
        barDataSet.setValueTextColor(Color.rgb(255,255,255));
        barDataSet.setBarShadowColor(Color.rgb(215, 215, 215));

        return barDataSet;
    }

    private ArrayList<String> getXAxisValues() {
        ArrayList<String> xAxis = new ArrayList<>();
        xAxis.add("Pain");
        xAxis.add("Hungry");
        xAxis.add("Fussy");
        return xAxis;
    }

}