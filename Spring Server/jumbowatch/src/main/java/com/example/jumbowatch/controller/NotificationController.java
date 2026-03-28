package com.example.jumbowatch.controller;

import java.util.Map;

public abstract class NotificationController {
    // This method will be called to send a notification
    public abstract Map<String, String> sendNotification();
}