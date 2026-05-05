package com.example.jumbowatch.service;

import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.jumbowatch.controller.notification.SseNotificationController;
import com.example.jumbowatch.model.Notification;
import com.example.jumbowatch.model.Sighting;
import com.example.jumbowatch.model.Zone;
import com.example.jumbowatch.repository.SightingRepository;
import com.example.jumbowatch.repository.UserRepository;
import com.example.jumbowatch.repository.ZoneRepository;
import org.springframework.beans.factory.annotation.Autowired;

@Service
public class SightingService {
    private long lastSaveTime = 0;
    private final long COOLDOWN_MS = 60000; // 60 seconds

    @Autowired
    private SseNotificationController sseController;
    @Autowired
    private SightingRepository sightingRepo;
    @Autowired
    private ZoneRepository zoneRepo;
    @Autowired
    private UserRepository userRepo;
    @Autowired 
    private NotificationService nfs;
    @Autowired
    private SmsService smsService;
    @Autowired
    private Cloudinary cloudinary;

    public String processSighting(String count, String time, String lat, String lon, MultipartFile photo, String source, Long droneId, ConcurrentHashMap<Long, byte[]> latestImages) {
        String imageUrl = "";
        LocalDateTime nowTime = LocalDateTime.now();

        // 1. IMAGE UPLOAD BLOCK
        try {
            if (photo == null || photo.isEmpty()) {
                System.out.println("❌ Photo is missing from source: " + source);
                return "Error: Photo is empty or missing.";
            }
            
            imageUrl = uploadImage(photo);
            latestImages.put(droneId, photo.getBytes());
        } catch (Exception e) {
            System.err.println("❌ Cloudinary Upload Failed: " + e.getMessage());
            return "Failed at Image Upload: " + e.getMessage();
        }

        // 2. DATA PARSING BLOCK
        Sighting newSighting;
        try {
            newSighting = new Sighting(
                Integer.parseInt(count), 
                nowTime, 
                Double.parseDouble(lat), 
                Double.parseDouble(lon), 
                imageUrl, 
                source, 
                droneId
            );
        } catch (Exception e) {
            System.err.println("❌ Data Parsing Failed: " + e.getMessage());
            return "Failed at Data Parsing: " + e.getMessage();
        }

        // 3. DATABASE AND NOTIFICATION BLOCK
        try {
            long now = System.currentTimeMillis();

            // Check Cooldown
            if (now - lastSaveTime <= COOLDOWN_MS) {
                System.out.println("⚠️ Alert skipped: Cooldown active (60s).");
                return "Alert received, but skipped due to cooldown.";
            }

            // Save Sighting
            sightingRepo.save(newSighting);
            lastSaveTime = now;

            // Handle Notifications
            Notification savedNotification;
            if ("drone".equals(newSighting.getSource())) {
                savedNotification = nfs.createAndSave(
                    "New drone alert! Count: " + newSighting.getElephantCount(),
                    "DroneAlert",
                    newSighting.getId()
                );
            } else {
                savedNotification = nfs.createAndSave(
                    "New user report! Count: " + newSighting.getElephantCount(),
                    "UserReport",
                    newSighting.getId()
                );
            }

            // Zone Processing
            Zone breachedZone = zoneRepo.findAll().stream()
                .filter(z -> z.containsSighting(newSighting))
                .findFirst().orElse(null);

            sseController.pushAlert(savedNotification);

            if (breachedZone != null) {
                breachedZone.setLastSightingDate(LocalDateTime.now());
                zoneRepo.save(breachedZone);
                sendSmsToZoneResidents(breachedZone);
            }

            System.out.println("✅ Successfully saved and processed sighting.");
            return "Alert received and processed!";

        } catch (Exception e) {
            System.err.println("❌ Database/Notification Failure: " + e.getMessage());
            e.printStackTrace();
            return "Failed at Database/Notification: " + e.getMessage();
        }
    }

    public String sendSmsToZoneResidents(Zone breachedZone) {
        try {
            if (breachedZone != null) {
                List<String> phoneNumbers = userRepo.findUsersByZoneId(breachedZone.getId()).stream()
                    .map(user -> user.getPhoneNumber())
                    .collect(Collectors.toList());
                return smsService.sendSms(phoneNumbers, "Elephant Alert! A new sighting has been reported in your area. Stay safe and stay alert!");
            }
            return "No breached zone found.";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error occurred while sending SMS.";
        }
    }

    public String uploadImage(MultipartFile file) throws Exception {
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
        return uploadResult.get("secure_url").toString();
    }
}