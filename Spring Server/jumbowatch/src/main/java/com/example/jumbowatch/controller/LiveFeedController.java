package com.example.jumbowatch.controller;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Comparator;
import java.util.Optional;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
public class LiveFeedController {

    @GetMapping(value = "/stream/latest", produces = MediaType.IMAGE_JPEG_VALUE)
    public ResponseEntity<byte[]> getLatestImage() {
        try {
            Path dir = Paths.get("elephant_alerts");
            
            // Find the newest file in the folder
            Optional<Path> latestFile = Files.list(dir)
                .filter(f -> !Files.isDirectory(f))
                .max(Comparator.comparingLong(f -> f.toFile().lastModified()));

            if (latestFile.isPresent()) {
                byte[] imageBytes = Files.readAllBytes(latestFile.get());
                return ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_JPEG)
                        .body(imageBytes);
            }
        } catch (Exception e) {
            System.out.println("Error reading folder.");
        }
        return ResponseEntity.notFound().build();
    }
}