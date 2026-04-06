package com.example.jumbowatch.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Admin {

    @Id
    private String username;
    private String password;
    private String email;
    private String phone;
    private String adminid;

    public Admin() {
        // Default constructor for JPA
    }

    public Admin(String username, String password, String email, String phone, String adminid) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.phone = phone;
        this.adminid = adminid;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public String getAdminId() {
        return adminid;
    }

    public void setPassword(String password) {
        this.password = password;
    }

}
