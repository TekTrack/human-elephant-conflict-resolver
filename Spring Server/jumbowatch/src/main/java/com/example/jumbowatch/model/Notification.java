package com.example.jumbowatch.model;

public class Notification {
    String message;
    String type;
    Long sightingId; // 0 for non sighting notifications. >0 for sighting-related notifications.

    public Notification() {}

    public Notification(String message, String type,Long sightingId) {
        this.message = message;
        this.type = type;
        this.sightingId = sightingId;
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
    }
}
