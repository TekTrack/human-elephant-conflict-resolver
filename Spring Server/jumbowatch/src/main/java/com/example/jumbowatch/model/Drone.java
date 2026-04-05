package com.example.jumbowatch.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Drone {
    @Id
    private String id;
    private double[] coordinates;
    private boolean remoteControlled;
    private boolean active;

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public boolean isRemoteControlled() {
        return remoteControlled;
    }

    public void setRemoteControlled(boolean remoteControlled) {
        this.remoteControlled = remoteControlled;
    }

    public double[] getCoordinates() {
        return coordinates;
    }

    public void setCoordinates(double[] coordinates) {
        this.coordinates = coordinates;
    }
    

    public Drone(String id, double[] coordinates, boolean remoteControlled, boolean active) {
        this.id = id;
        this.coordinates = coordinates;
        this.remoteControlled = remoteControlled;
        this.active = active;
    }
    
    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }
    
}
