package com.example.jumbowatch.service;

import org.springframework.stereotype.Service;
import com.example.jumbowatch.model.Notification;
import com.example.jumbowatch.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;
    private Notification currentNotification = new Notification();

    public void setNotification(String message, String type, Long sightingId) {
        currentNotification.setMessage(message);
        currentNotification.setType(type);
        currentNotification.setSightingId(sightingId);
    }

    public Notification getNotification() {
        return currentNotification;
    }

    public void saveNotification() {
        notificationRepository.save(currentNotification);
    }
}