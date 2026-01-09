package com.example.elephantalert;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.EditText;
import android.widget.Spinner;

import androidx.appcompat.app.AppCompatActivity;

public class LoginActivity extends AppCompatActivity {

    Spinner spinner;
    EditText usernameEditText, passwordEditText;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        spinner = findViewById(R.id.userTypeSpinner);
        usernameEditText = findViewById(R.id.usernameEditText);
        passwordEditText = findViewById(R.id.passwordEditText);

        String[] users = {
                "Villager",
                "Photographer",
                "Safari Guide",
                "Forest Officer",
                "Admin"
        };

        ArrayAdapter<String> adapter = new ArrayAdapter<>(
                this,
                android.R.layout.simple_spinner_dropdown_item,
                users
        );

        spinner.setAdapter(adapter);
    }

    public void login(View v) {
        String selectedUser = spinner.getSelectedItem().toString();
        String username = usernameEditText.getText().toString();
        String password = passwordEditText.getText().toString();

        // Simple check (you can enhance with real authentication later)
        if(username.isEmpty() || password.isEmpty()){
            usernameEditText.setError("Enter username");
            passwordEditText.setError("Enter password");
            return;
        }

        // Open DashboardActivity and pass the user type
        Intent intent = new Intent(LoginActivity.this, DashboardActivity.class);
        intent.putExtra("userType", selectedUser);
        startActivity(intent);
    }
}
