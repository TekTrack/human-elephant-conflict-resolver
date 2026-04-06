package com.example.jumbowatch.admin;

import java.util.List;

import com.example.jumbowatch.model.Notification;
import com.example.jumbowatch.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
public class AllNotifications {
    @Autowired
    private NotificationRepository notificationRepository;
    
    @GetMapping("/api/admin/allnotifications")
    public List<Notification> getAllNotifications(@RequestParam(required = false) Integer zoneId) {
    if (zoneId == null || zoneId == 0) {
        return notificationRepository.findAll(); // Show everything if no zone selected
    }
    return notificationRepository.findByZoneId(zoneId);
}

}
