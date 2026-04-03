package com.example.jumbowatch.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Zone {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private double minLat, maxLat, minLon, maxLon;
    private LocalDateTime lastSightingDate = null;

    public Zone() {
        // Default constructor for JPA
    }
    public Zone(String name, double minLat, double maxLat, double minLon, double maxLon) {
        this.name = name;
        this.minLat = minLat;
        this.maxLat = maxLat;
        this.minLon = minLon;
        this.maxLon = maxLon;
    }

    // This method takes another Object (Sighting) as a parameter!
    public boolean containsSighting(Sighting sighting) {
        return sighting.getLatitude() >= minLat && sighting.getLatitude() <= maxLat &&
               sighting.getLongitude() >= minLon && sighting.getLongitude() <= maxLon;
    }

    public Long getId() { return id; }
    public LocalDateTime getLastSightingDate() { return lastSightingDate; }
    public void setLastSightingDate(LocalDateTime date) { this.lastSightingDate = date; }
    public String getName() { return name; }
    public double getMinLat() { return minLat; }
    public double getMaxLat() { return maxLat; }
    public double getMinLon() { return minLon; }
    public double getMaxLon() { return maxLon; }
}