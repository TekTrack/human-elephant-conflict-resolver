package com.example.jumbowatch.service;

import org.springframework.stereotype.Service;
import com.example.jumbowatch.model.Notification;

@Service
public class NotificationService {
    private Notification currentNotification = new Notification();

    public void setNotification(String message, String type, Long sightingId) {
        currentNotification.setMessage(message);
        currentNotification.setType(type);
        currentNotification.setSightingId(sightingId);
    }

    public Notification getNotification() {
        return currentNotification;
    }
}