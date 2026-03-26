package com.example.jumbowatch.model; // Adjust if needed

import jakarta.persistence.*;

@Entity
public class Sighting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int elephantCount;
    private String time;
    private double latitude;
    private double longitude;
    private String photoFilename;
    private boolean verified = false;
    private String source; 

    // The Constructor
    public Sighting() {}

    public Sighting(int count, String time, double lat, double lon, String photo, String source) {
        this.elephantCount = count;
        this.time = time;
        this.latitude = lat;
        this.longitude = lon;
        this.photoFilename = photo;
        this.source = source;
    }

    // Getters and Setters
    public int getElephantCount() { return elephantCount; }
    public String getTime() { return time; } 
    public double getLatitude() { return latitude; }
    public double getLongitude() { return longitude; }
    public String getPhotoFilename() { return photoFilename; }
    public boolean isVerified() { return verified; }
    public String getSource() { return source; }

    // Keep your old methods like verifySighting() here...
    public void setVerified(boolean verified) {
        this.verified = verified;
    }

    // Add this to print the object easily in the terminal
    @Override
    public String toString() {
        return "Sighting [Count=" + elephantCount + ", Time=" + time + ", Lat=" + latitude + ", Lon=" + longitude + ", Photo=" + photoFilename + "]";
    }
}