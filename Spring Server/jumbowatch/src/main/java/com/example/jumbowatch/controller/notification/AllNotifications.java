package com.example.jumbowatch.controller.notification;

import java.util.List;

import com.example.jumbowatch.model.Notification;
import com.example.jumbowatch.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/allnotifications")
@CrossOrigin(origins = "*")
public class AllNotifications {
    @Autowired
    private NotificationRepository notificationRepository;
    
    @GetMapping
    public List<Notification> getAllNotifications(@RequestParam(required = false) Integer zoneId) {
    if (zoneId == null || zoneId == 0) {
        return notificationRepository.findAll(); // Show everything if no zone selected
        }
        return notificationRepository.findByZoneId(zoneId);
    }
    @DeleteMapping
    public void deleteAllNotifications(){
        notificationRepository.deleteAll(); 
    }
}
