package org.chatterbaby.chatterbaby;

import android.app.Activity;
import android.graphics.Color;
import android.graphics.Typeface;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
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

import java.util.ArrayList;

public class WhyCryVisualization extends AppCompatActivity {
    Float painProb;
    Float hungryProb;
    Float fussyProb;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_why_cry_visualization);

        // retrieve json from algorithm response
        String jsonStr = getIntent().getStringExtra("json");
        System.out.println("Received intent: " + jsonStr);
        parseJson(jsonStr);

        // a BarChart is initialized from xml
        BarChart chart = (BarChart) findViewById(R.id.chart);

        // configure xaxis (states)
        XAxis xAxis = chart.getXAxis();
        xAxis.setPosition(XAxis.XAxisPosition.BOTTOM);
        xAxis.setGranularity(1f); // minimum axis-step (interval) is 1
        xAxis.setTextSize(16f);
        xAxis.setTypeface(Typeface.DEFAULT_BOLD);
        xAxis.setValueFormatter(formatter);
        xAxis.setDrawGridLines(false);

        // configure yaxis (probabilities)
        YAxis yAxis = chart.getAxisLeft();
        yAxis.setPosition(YAxis.YAxisLabelPosition.OUTSIDE_CHART);
        yAxis.setAxisMinValue(0f);
        yAxis.setAxisMaxValue(1f);
        yAxis.setDrawGridLines(false);

        // set data within chart
        BarData data = new BarData(getDataSet());
        data.setBarWidth(0.8f); // set custom bar width
        chart.setData(data);
        chart.getAxisRight().setDrawLabels(false);
        chart.getAxisRight().setDrawGridLines(false);
        chart.setDescription("Predictive model of why baby is crying");
        chart.setDescriptionPosition(0,0);
        chart.animateY(2400);
        chart.setFitBars(true); // make the x-axis fit exactly all bars
        //chart.setTouchEnabled(false);
        //chart.setDrawGridBackground(false);

        chart.setHardwareAccelerationEnabled(true);
        chart.setDrawValueAboveBar(false);
        chart.invalidate(); // refresh

        Log.i("Visualization", "displayed image result");
    }

    private void parseJson(String jsonStr) {
        if (jsonStr != null) {
            try {
                JSONObject jsonObj = new JSONObject(jsonStr);
                painProb = (Float) jsonObj.get("Pain");
                hungryProb = (Float) jsonObj.get("Hungry");
                fussyProb = (Float) jsonObj.get("Fussy");
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
    }

    private BarDataSet getDataSet() {

        // create dataset
        ArrayList<BarEntry> entries = new ArrayList<>();

        entries.add(new BarEntry(0f, .23f));
        entries.add(new BarEntry(1f, .35f));
        entries.add(new BarEntry(2f, .12f));

        //entries.add(new BarEntry(0f, painProb));
        //entries.add(new BarEntry(1f, hungryProb));
        //entries.add(new BarEntry(2f, fussyProb));

        BarDataSet barDataSet = new BarDataSet(entries, "Probability of state");
        //barDataSet.setValueFormatter(new PercentFormatter());
        barDataSet.setColors(new int[]{Color.rgb(246, 18, 18), Color.rgb(0, 135, 0), Color.rgb(0, 102, 204)});
        barDataSet.setValueTextSize(14f);
        barDataSet.setValueTextColor(Color.rgb(255,255,255));
        //barDataSet.setBarShadowColor(Color.rgb(215, 215, 215));

        return barDataSet;
    }

    private ArrayList<String> getXAxisValues() {
        ArrayList<String> xAxis = new ArrayList<>();
        xAxis.add("Pain");
        xAxis.add("Hungry");
        xAxis.add("Fussy");
        return xAxis;
    }

    // Formatter
    final String[] values = new String[]{"Pain", "Hungry", "Fussy"};
    AxisValueFormatter formatter = new AxisValueFormatter() {
        @Override
        public String getFormattedValue(float value, AxisBase axis) {
            return values[(int) value];
        }
        // we don't draw numbers, so no decimal digits needed
        @Override
        public int getDecimalDigits() {  return 0; }
    };
}