package com.example.jumbowatch.model;

public class Zone {
    private String name;
    private double minLat, maxLat, minLon, maxLon;

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

    public String getName() {
        return name;
    }
}