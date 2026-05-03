package com.example.jumbowatch.controller.notification;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.jumbowatch.service.NotificationService;

@RestController
@CrossOrigin(origins = "*")
public class UserNotification {

    @Autowired
    private NotificationService nfs;

    public UserNotification() {} 

    @GetMapping("/api/user/notifications")
    public Map<String, String> sendNotification(String message, String type, Long sightingId) {
        nfs.createAndSave(message, type, sightingId); // Save to DB and get the fresh object back
        Map<String, String> response = new HashMap<>();
        response.put("message", message);
        response.put("type", type);
        response.put("sightingId", sightingId.toString());
        return response; // Return the data to be sent via SSE
    }

}