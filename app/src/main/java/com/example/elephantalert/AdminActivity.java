package com.example.elephantalert;

import android.os.Bundle;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

public class AdminActivity extends AppCompatActivity {

    TextView adminWelcomeText;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_admin);

        adminWelcomeText = findViewById(R.id.adminWelcomeText);

        // Set welcome message
        adminWelcomeText.setText("Welcome, Admin! You can manage the app here.");
    }
}
