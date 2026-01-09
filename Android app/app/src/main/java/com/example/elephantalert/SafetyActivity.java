package com.example.elephantalert;

import android.os.Bundle;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

public class SafetyActivity extends AppCompatActivity {

    TextView safetyText;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_safety);

        safetyText = findViewById(R.id.safetyText);

        // Sample safety instructions
        String safetyInstructions = "Safety Guidelines:\n\n" +
                "1. Always keep a safe distance from elephants.\n" +
                "2. Avoid sudden movements or loud noises.\n" +
                "3. Follow instructions of local forest officers.\n" +
                "4. Never feed wild animals.\n" +
                "5. Report any unusual animal behavior immediately.";

        safetyText.setText(safetyInstructions);
    }
}
