package com.example.jumbowatch.admin;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.jumbowatch.controller.NotificationController;
import com.example.jumbowatch.model.Notification;
import com.example.jumbowatch.service.NotificationService;


import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@CrossOrigin(origins = "*")
public class AdminNotification extends NotificationController {
    @Autowired
    private NotificationService nfs;

    public AdminNotification() {}

    public AdminNotification(String message, String type,Long sightingId) {
        nfs.setNotification(message, type, sightingId);
    }

    @Override
    @GetMapping("/api/admin/notifications")
    public Map<String, String> sendNotification() {
        Map<String, String> response = new HashMap<>();
        Notification notification = nfs.getNotification();
        nfs.saveNotification(); // Save the notification to the database    
        
        response.put("message", notification.getMessage());
        response.put("type", notification.getType());
        response.put("sightingId", String.valueOf(notification.getSightingId()));
        notification.clear(); // Clear after sending. (Making values null)
        return response;
    }
}