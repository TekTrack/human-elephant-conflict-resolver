package com.example.jumbowatch.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User {

    @Id
    private String email;
    private String password;
    private String name;
    private String phoneNumber;
    private String userCategory;
    private String IdentityID;
    private String AdminID;

    public User() {
    }

    public User(String email, String password, String name, String phoneNumber, String IdentityID, String AdminID,
            String userCategory) {

        this.email = email;
        this.password = password;
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.userCategory = userCategory;
        this.IdentityID = IdentityID;
        this.AdminID = AdminID;

    }

    // Getters and Setters...
    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getIdentityID() {
        return IdentityID;
    }

    public String getUserCategory() {
        return userCategory;
    }

    public String getAdminID() {
        return AdminID;
    }


    public void setAdminID(String adminID) {
        AdminID = adminID;
    }

    public void setIdentityID(String identityID) {
        IdentityID = identityID;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public void setUserCategory(String userCategory) {
        this.userCategory = userCategory;   
    }

    


}
