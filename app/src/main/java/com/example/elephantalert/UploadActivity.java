package com.example.elephantalert;

import android.os.Bundle;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class UploadActivity extends AppCompatActivity {

    TextView timeText;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_upload);

        timeText = findViewById(R.id.timeText);

        // Get current date and time
        Date now = new Date();

        // Format it nicely
        SimpleDateFormat sdf = new SimpleDateFormat("dd MMM yyyy, HH:mm:ss", Locale.getDefault());
        String formattedDate = sdf.format(now);

        timeText.setText("Current Time: " + formattedDate);
    }
}
