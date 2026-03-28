package com.example.jumbowatch.controller; // Keep your package name!

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.*;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import com.example.jumbowatch.admin.AdminNotification;
import com.example.jumbowatch.model.Sighting;
import com.example.jumbowatch.repository.SightingRepository;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
public class AlertController {
    private long lastSaveTime = 0;
    private final long COOLDOWN_MS = 60000; // 60 seconds
    @Autowired
    private SightingRepository sightingRepo;

    @PostMapping("/alert")
    public String receiveAlert(
            @RequestParam("count") String count,
            @RequestParam("time") String time,
            @RequestParam("latitude") String lat,
            @RequestParam("longitude") String lon,
            @RequestParam("photo") MultipartFile photo,
            @RequestParam("source") String source
        ) {

        try {
            // 1. Force absolute path for the folder
            Path saveFolder = Paths.get("elephant_alerts").toAbsolutePath();
            Files.createDirectories(saveFolder);

            // 2. Format time for filename
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
            String filename = "alert_" + timestamp + ".jpg";
            Path filePath = saveFolder.resolve(filename);

            // 3. Save using Files.copy (Bulletproof method 🛡️)
            Files.copy(photo.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            
            Sighting newSighting = new Sighting(Integer.parseInt(count), time, Double.parseDouble(lat), Double.parseDouble(lon), filename, source);
            AdminNotification.message="New sighting detected!";
            AdminNotification.type="DroneAlert";

            // 4. Save data to supabase (with cooldown to prevent spamming). Also admin notifications are sent immediately, while user reports wait for verification.
            long now = System.currentTimeMillis();
            if (now - lastSaveTime > COOLDOWN_MS) {
                if ("DRONE".equals(newSighting.getSource())) {
                    newSighting.setVerified(true);
                } else {
                    newSighting.setVerified(false); // Users wait for admin
                }
                sightingRepo.save(newSighting);

                lastSaveTime = now;
                System.out.println("✅ Saved directly to Supabase!");
            }

            // 5. Print the terminal notification
            System.out.println("\n========================================");
            System.out.println("🚨 ALERT RECEIVED!");
            System.out.println("🐘 Count: " + count);
            System.out.println("📍 GPS:   " + lat + ", " + lon);
            System.out.println("⏰ Time:  " + time);
            System.out.println("📁 Photo: " + filename);
            System.out.println("========================================");

            return "Alert Received";

        } catch (IOException e) {
            System.out.println("❌ Error saving file: " + e.getMessage());
            e.printStackTrace(); // This prints the exact error in the terminal if it fails again
            return "Failed to process alert.";
        }
    }
}