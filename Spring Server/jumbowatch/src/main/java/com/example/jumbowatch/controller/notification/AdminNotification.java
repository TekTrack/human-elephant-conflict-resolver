package com.example.jumbowatch.controller.notification;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import com.example.jumbowatch.model.Notification;
import com.example.jumbowatch.repository.NotificationRepository;
import com.example.jumbowatch.service.NotificationService;


import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@CrossOrigin(origins = "*")
public class AdminNotification extends NotificationController {
    @Autowired
    private NotificationService nfs;

    public AdminNotification() {}

    public void setNotification(String message, String type,Long sightingId) {
        nfs.setNotification(message, type, sightingId);
    }

    @Override
    @GetMapping("/api/admin/notifications")
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

    @Autowired
    private NotificationRepository notificationRepository;
    
    @GetMapping("/api/admin/allnotifications")
    public List<Notification> getAllNotifications(@RequestParam(required = false) Integer zoneId) {
    if (zoneId == null || zoneId == 0) {
        return notificationRepository.findAll(); // Show everything if no zone selected
        }
        return notificationRepository.findByZoneId(zoneId);
    }
    @DeleteMapping("/api/admin/allnotifications")
    public void deleteAllNotifications(){
        notificationRepository.deleteAll(); 
    }

}