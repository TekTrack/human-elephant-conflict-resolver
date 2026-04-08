package com.example.jumbowatch.model; // Adjust if needed

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Sighting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int elephantCount;
    private LocalDateTime timestamp;
    private double latitude;
    private double longitude;
    private String photoFilename;
    private boolean verified = false;
    private String source;
    private Long droneId; 

    // The Constructor
    public Sighting() {}

    public Sighting(int count, LocalDateTime timestamp, double lat, double lon, String photo, String source,Long droneId) {
        this.elephantCount = count;
        this.timestamp = timestamp;
        this.latitude = lat;
        this.longitude = lon;
        this.photoFilename = photo;
        this.source = source;
        this.droneId =droneId;
    }

    // Getters and Setters
    public int getElephantCount() { return elephantCount; }
    public LocalDateTime getTimestamp() { return timestamp; }       
    public double getLatitude() { return latitude; }
    public double getLongitude() { return longitude; }
    public String getPhotoFilename() { return photoFilename; }
    public boolean isVerified() { return verified; }
    public String getSource() { return source; }
    public Long getId() { return id; }
    public Long getDroneId(){ return droneId; }

    // Keep your old methods like verifySighting() here...
    public void setVerified(boolean verified) {
        this.verified = verified;
    }

    @Override
    public String toString() {
        return "Sighting [id=" + id + ", elephantCount=" + elephantCount + ", timestamp=" + timestamp + ", latitude="
                + latitude + ", longitude=" + longitude + ", photoFilename=" + photoFilename + ", verified=" + verified
                + ", source=" + source + ", droneId=" + droneId + "]";
    }
}