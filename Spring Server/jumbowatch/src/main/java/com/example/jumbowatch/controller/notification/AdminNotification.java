package com.example.jumbowatch.controller.notification;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.jumbowatch.model.Notification;
import com.example.jumbowatch.repository.NotificationRepository;


@RestController
@CrossOrigin(origins = "*")
public class AdminNotification { // 1. NO 'extends' here


    @Autowired
    private NotificationRepository notificationRepository;

    @GetMapping("/api/admin/allnotifications")
    public List<Notification> getAllNotifications(@RequestParam(required = false) Integer zoneId) {
        if (zoneId == null || zoneId == 0) {
            return notificationRepository.findAll();
        }
        return notificationRepository.findByZoneId(zoneId);
    }

    @DeleteMapping("/api/admin/allnotifications")
    public void deleteAllNotifications(){
        notificationRepository.deleteAll(); 
    }
}