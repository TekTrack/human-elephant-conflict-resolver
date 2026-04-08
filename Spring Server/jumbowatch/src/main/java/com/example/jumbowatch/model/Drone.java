package com.example.jumbowatch.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Drone {
    @Id
    private Long id;
    
    // Changed to String so the Database can easily save it as "6.927, 79.861"
    private String coordinates; 
    
    private boolean remoteControlled;
    private boolean active;

    // 👇 CRITICAL FIX: The empty constructor Spring needs!
    public Drone() {
    }

    public Drone(Long id, String coordinates, boolean remoteControlled, boolean active) {
        this.id = id;
        this.coordinates = coordinates;
        this.remoteControlled = remoteControlled;
        this.active = active;
    }

    // --- Getters and Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCoordinates() { return coordinates; }
    public void setCoordinates(String coordinates) { this.coordinates = coordinates; }

    public boolean isRemoteControlled() { return remoteControlled; }
    public void setRemoteControlled(boolean remoteControlled) { this.remoteControlled = remoteControlled; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}