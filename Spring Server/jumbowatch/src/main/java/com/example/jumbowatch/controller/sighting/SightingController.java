package com.example.jumbowatch.controller.sighting; // Keep your package name!

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;


import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;

import com.example.jumbowatch.model.Sighting;
import com.example.jumbowatch.repository.SightingRepository;
import com.example.jumbowatch.service.SightingService;

import org.springframework.beans.factory.annotation.Autowired;

@RestController
@CrossOrigin(origins = "http://localhost:5173")// Allows the web app to connect to this controller
public class SightingController {
    public ConcurrentHashMap<Long, byte[]> latestImages = new ConcurrentHashMap<>();
    
    @Autowired
    private SightingRepository sightingRepo;

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
    private SightingService sightingService;

    @PostMapping("/alert")
    public String receiveAlert(
            @RequestParam("count") String count,
            @RequestParam("time") String time,
            @RequestParam("latitude") String lat,
            @RequestParam("longitude") String lon,
            @RequestParam("photo") MultipartFile photo,
            @RequestParam("source") String source,
            @RequestParam("droneId") Long droneId
        ) {

            sightingService.processSighting(count, time, lat, lon, photo, source, droneId, latestImages);
        return "Alert received and processed!";
    }

    @GetMapping(value = "/api/admin/liveDroneFeed/{id}", produces = MediaType.IMAGE_JPEG_VALUE)
    public ResponseEntity<byte[]> getLatestImage(@PathVariable Long id) {
        
        // Grab the bytes from our map
        byte[] imageBytes = latestImages.get(id);

        if (imageBytes != null) {
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(imageBytes);
        }

        // Return a 404 if the drone hasn't sent anything yet
        return ResponseEntity.notFound().build();
    }

}