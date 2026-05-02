package com.example.jumbowatch.controller.notification;

import org.springframework.stereotype.Service;

@Service
public abstract class NotificationController {
    public NotificationController() {}

    public NotificationController(String message, String type,Long sightingId) {
        // This constructor can be used by AdminNotification to set the notification details
    }
    

    public abstract java.util.Map<String, String> sendNotification();
}
