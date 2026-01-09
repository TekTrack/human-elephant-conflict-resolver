package com.example.elephantalert;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

public class DashboardActivity extends AppCompatActivity {

    TextView welcomeText;
    Button uploadBtn, historyBtn, safetyBtn, adminBtn;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_dashboard);

        // Get user type from LoginActivity
        String userType = getIntent().getStringExtra("userType");

        // Find views
        welcomeText = findViewById(R.id.welcomeTextView);
        uploadBtn = findViewById(R.id.uploadBtn);
        historyBtn = findViewById(R.id.historyBtn);
        safetyBtn = findViewById(R.id.safetyBtn);
        adminBtn = findViewById(R.id.adminBtn);

        // Set welcome message
        welcomeText.setText("Welcome, " + userType + "!");

        // Show Admin button only for Admin users
        if(userType.equals("Admin")){
            adminBtn.setVisibility(View.VISIBLE);
        } else {
            adminBtn.setVisibility(View.GONE);
        }

        // Button click listeners
        uploadBtn.setOnClickListener(v -> startActivity(new Intent(DashboardActivity.this, UploadActivity.class)));
        historyBtn.setOnClickListener(v -> startActivity(new Intent(DashboardActivity.this, HistoryActivity.class)));
        safetyBtn.setOnClickListener(v -> startActivity(new Intent(DashboardActivity.this, SafetyActivity.class)));
        adminBtn.setOnClickListener(v -> startActivity(new Intent(DashboardActivity.this, AdminActivity.class)));
    }
}
