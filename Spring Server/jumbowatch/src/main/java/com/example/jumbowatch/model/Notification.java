package com.example.jumbowatch.model;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String message;
    private String type;
    private Long sightingId; // 0 for non sighting notifications. >0 for sighting-related notifications.
    private int zoneId;

    public int getZoneId() {
        return zoneId;
    }

    public void setZoneId(int zoneId) {
        this.zoneId = zoneId;
    }

    public Notification() {}

    public Notification(String message, String type,Long sightingId, int zoneId) {
        this.message = message;
        this.type = type;
        this.sightingId = sightingId;
        this.zoneId = zoneId=0; // Default to 0 if not provided.
    }
    public void setMessage(String message) {
        this.message = message;
    }
    public void setType(String type) {
        this.type = type;
    }
    public String getMessage() {
        return message;
    }
    public String getType() {
        return type;
    }
    public void setSightingId(Long sightingId) {
        this.sightingId = sightingId;
    }
    public Long getSightingId() {
        return sightingId;
    }
    public void clear() {
        this.message = null;
        this.type = null;
        this.sightingId = null;
        this.zoneId = 0;
    }
}
