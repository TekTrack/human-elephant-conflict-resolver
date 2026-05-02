package com.example.jumbowatch.controller.notification;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.jumbowatch.model.Notification;
import com.example.jumbowatch.service.NotificationService;

@RestController
@CrossOrigin(origins = "*")
public class UserNotification extends NotificationController {

    @Autowired
    private NotificationService nfs;

    public UserNotification(String message, String type, Long sightingId) {
        nfs.setNotification(message, type, sightingId);
    }

    public UserNotification() {} 

    @Override
    @GetMapping("/api/user/notifications")
    public Map<String, String> sendNotification() {
        Map<String, String> response = new HashMap<>();
        Notification notification = nfs.getNotification();
        nfs.saveNotification();
        
        response.put("message", notification.getMessage());
        response.put("type", notification.getType());
        response.put("sightingId", String.valueOf(notification.getSightingId()));
        notification.clear(); // Clear after sending. (Making values null)
        return response;
    }
}