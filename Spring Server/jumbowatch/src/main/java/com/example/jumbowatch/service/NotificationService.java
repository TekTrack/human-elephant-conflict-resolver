package com.example.jumbowatch.service;

import org.springframework.stereotype.Service;
import com.example.jumbowatch.model.Notification;
import com.example.jumbowatch.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;

    // No private Notification variable here anymore! 🚫

    public Notification createAndSave(String message, String type, Long sightingId) {
        Notification n = new Notification();
        n.setMessage(message);
        n.setType(type);
        n.setSightingId(sightingId);
        return notificationRepository.save(n); // Save and return a fresh object
    }
}