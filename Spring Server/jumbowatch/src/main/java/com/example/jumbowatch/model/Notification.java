package com.example.jumbowatch.model;

public class Notification {
    String message;
    String type;
    String timestamp;

    public Notification() {}

    public Notification(String message, String type) {
        this.message = message;
        this.type = type;
    }
    void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }  
    void setMessage(String message) {
        this.message = message;
    }
    void setType(String type) {
        this.type = type;
    }
    public String getMessage() {
        return message;
    }
    public String getType() {
        return type;
    }
    public String getTimestamp() {
        return timestamp;
    }
    void clear() {
        this.message = null;
        this.type = null;
        this.timestamp = null;
    }
}
