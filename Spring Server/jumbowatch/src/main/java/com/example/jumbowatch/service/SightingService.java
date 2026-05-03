package com.example.jumbowatch.service;

import org.springframework.web.multipart.MultipartFile;
// import java.nio.file.*;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
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

    public String processSighting(String count, String time, String lat, String lon, MultipartFile photo, String source, Long droneId, ConcurrentHashMap<Long, byte[]> latestImages) {
         try {
            // 1. Force absolute path for the folder
            // Path saveFolder = Paths.get("elephant_alerts/"+droneId.toString()).toAbsolutePath();
            // Files.createDirectories(saveFolder);

            // 2. Format time for filename
            LocalDateTime nowTime = LocalDateTime.now();
            // String timestamp = nowTime.format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
            // String filename = "alert_" + timestamp + ".jpg";
            //Path filePath = saveFolder.resolve(filename);

            // 3. Save using Files.copy (Bulletproof method 🛡️)
            //Files.copy(photo.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            String imageUrl = uploadImage(photo);

            latestImages.put(droneId, photo.getBytes());
            
            Sighting newSighting = new Sighting(Integer.parseInt(count), nowTime, Double.parseDouble(lat), Double.parseDouble(lon), imageUrl, source,droneId);

            // 4. Save data to supabase (with cooldown to prevent spamming). Also admin notifications are sent immediately, while user reports wait for verification.
            long now = System.currentTimeMillis();

            
            if (now - lastSaveTime > COOLDOWN_MS) {
                sightingRepo.save(newSighting);

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

                lastSaveTime = now;
                
                // Inside your save sighting method:
                Zone breachedZone = zoneRepo.findAll().stream()
                    .filter(z -> z.containsSighting(newSighting))
                    .findFirst().orElse(null);

                sseController.pushAlert(savedNotification);

                if (breachedZone != null) {
                    breachedZone.setLastSightingDate(LocalDateTime.now());
                    zoneRepo.save(breachedZone);
                }

                sendSmsToZoneResidents(breachedZone);

                System.out.println("✅ Saved directly to Supabase!");
            }

            // 5. Print the terminal notification
            System.out.println("\n========================================");
            System.out.println("ALERT RECEIVED!");
            System.out.println("Count: " + count);
            System.out.println("GPS:   " + lat + ", " + lon);
            System.out.println("Time:  " + time);
            System.out.println("Photo: " + imageUrl);
            System.out.println("Drone ID: " + droneId);
            System.out.println("========================================");

            return "Alert Received";

        } catch (Exception e) {
            System.out.println("❌ Error saving file: " + e.getMessage());
            e.printStackTrace(); // This prints the exact error in the terminal if it fails again
            return "Failed to process alert.";
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

    @Autowired
    private Cloudinary cloudinary;

    public String uploadImage(MultipartFile file) throws Exception {
        // Upload the file to Cloudinary
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
        
        // Extract and return the secure live URL
        return uploadResult.get("secure_url").toString();
    }
}
