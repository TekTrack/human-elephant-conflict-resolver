package com.example.elephantalert;

import android.os.Bundle;
import android.widget.ArrayAdapter;
import android.widget.ListView;

import androidx.appcompat.app.AppCompatActivity;

public class HistoryActivity extends AppCompatActivity {

    ListView historyListView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_history);

        historyListView = findViewById(R.id.historyListView);

        // Sample history items
        String[] historyItems = {
                "Uploaded photo - 03 Jan 2026",
                "Checked elephant alert - 02 Jan 2026",
                "Logged in as Villager - 01 Jan 2026"
        };

        ArrayAdapter<String> adapter = new ArrayAdapter<>(
                this,
                android.R.layout.simple_list_item_1,
                historyItems
        );

        historyListView.setAdapter(adapter);
    }
}

