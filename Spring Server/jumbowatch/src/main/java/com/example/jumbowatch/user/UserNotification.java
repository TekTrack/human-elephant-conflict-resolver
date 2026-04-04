package com.example.jumbowatch.user;

import java.util.HashMap;
import java.util.Map;
import org.springframework.web.bind.annotation.*;
import com.example.jumbowatch.controller.NotificationController;

@RestController
@CrossOrigin(origins = "*")
public class UserNotification extends NotificationController {
        
    // 👈 Unique static variables JUST for Admin
    public static String message = null;
    public static String type = null;

    public UserNotification() {} 

    @Override
    @GetMapping("/api/user/notifications")
    public Map<String, String> sendNotification() {
        Map<String, String> response = new HashMap<>();
        if(message == null || type == null) {
            return null;
        }
        response.put("message", message);
        response.put("type", type);
        message = null; // Clear after sending
        type = null;
        return response;
    }
}