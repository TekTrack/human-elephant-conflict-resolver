package com.example.jumbowatch.controller; // Keep your package name!

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.*;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import com.example.jumbowatch.admin.AdminNotification;
import com.example.jumbowatch.model.Sighting;
import com.example.jumbowatch.model.Zone;
import com.example.jumbowatch.repository.SightingRepository;
import com.example.jumbowatch.repository.ZoneRepository;
import com.example.jumbowatch.service.NotificationService;

import org.springframework.beans.factory.annotation.Autowired;

@RestController
@CrossOrigin(origins = "*") // Allows the web app to connect to this controller
public class SightingController {
    private long lastSaveTime = 0;
    private final long COOLDOWN_MS = 60000; // 60 seconds
    @Autowired
    private SightingRepository sightingRepo;
    @Autowired
    private ZoneRepository zoneRepo;

    @GetMapping("/api/admin/sightings/filter")
    public List<Sighting> getFilteredSightings(@RequestParam(defaultValue = "all") String timeframe) {
        LocalDateTime cutoff = LocalDateTime.now();
        
        switch(timeframe.toLowerCase()) {
            case "hour": cutoff = cutoff.minusHours(1); break;
            case "day": cutoff = cutoff.minusDays(1); break;
            case "week": cutoff = cutoff.minusWeeks(1); break;
            case "month": cutoff = cutoff.minusMonths(1); break;
            case "year": cutoff = cutoff.minusYears(1); break;
            default: return sightingRepo.findAll(); // All time
        }
        
        return sightingRepo.findByTimestampAfter(cutoff);
    }

     @Autowired
    private NotificationService nfs;

    @PostMapping("/alert")
    public String receiveAlert(
            @RequestParam("count") String count,
            @RequestParam("time") String time,
            @RequestParam("latitude") String lat,
            @RequestParam("longitude") String lon,
            @RequestParam("photo") MultipartFile photo,
            @RequestParam("source") String source,
            @RequestParam("droneId") String droneId
        ) {

        try {
            // 1. Force absolute path for the folder
            Path saveFolder = Paths.get("elephant_alerts").toAbsolutePath();
            Files.createDirectories(saveFolder);

            // 2. Format time for filename
            LocalDateTime nowTime = LocalDateTime.now();
            String timestamp = nowTime.format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
            String filename = "alert_" + timestamp + ".jpg";
            Path filePath = saveFolder.resolve(filename);

            // 3. Save using Files.copy (Bulletproof method 🛡️)
            Files.copy(photo.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            
            Sighting newSighting = new Sighting(Integer.parseInt(count), nowTime, Double.parseDouble(lat), Double.parseDouble(lon), filename, source);

            // 4. Save data to supabase (with cooldown to prevent spamming). Also admin notifications are sent immediately, while user reports wait for verification.
            long now = System.currentTimeMillis();
            if (now - lastSaveTime > COOLDOWN_MS) {
                sightingRepo.save(newSighting);

                if ("DRONE".equals(newSighting.getSource())) {
                    nfs.setNotification(
                        "New drone alert! Count: " + newSighting.getElephantCount(),
                        "DroneAlert",
                        newSighting.getId()// sightingId is 0 for drone alerts
                    );
                    
                } else {
                    nfs.setNotification(
                        "New user report! Count: " + newSighting.getElephantCount(),
                        "UserReport",
                        newSighting.getId() // sightingId is >0 for user reports
                    );
                }


                lastSaveTime = now;
                
                // Inside your save sighting method:
                Zone breachedZone = zoneRepo.findAll().stream()
                    .filter(z -> z.containsSighting(newSighting))
                    .findFirst().orElse(null);

                if (breachedZone != null) {
                    breachedZone.setLastSightingDate(LocalDateTime.now());
                    zoneRepo.save(breachedZone);
                }


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