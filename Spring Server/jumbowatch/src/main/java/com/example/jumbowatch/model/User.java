
package com.example.jumbowatch.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
//import jakarta.validation.constraints.Size;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique=true)
    private String email;
    
    private String password;
    
    @Column(unique=true)
    private String name;

    @Column(length = 10, unique=true) // Database level limit
   // @Size(min = 10, max = 10, message = "Phone number must be 10 characters") // Validation level limit
    private String phoneNumber;

    private String userCategory;

    @Column(unique = true)
    private String NIC;

    @Column(length = 7)
    //@Size(min = 7, max = 7, message = "Admin ID must be 7 characters")
    private String adminID;

    // Default Constructor
    public User() {
    }

    // Parametrized Constructor
    public User(String email, String password, String name, String phoneNumber, String NIC, String adminID, String userCategory) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.NIC = NIC;
        this.adminID = adminID;
        this.userCategory = userCategory;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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

    public void setName(String name) {
        this.name = name;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getUserCategory() {
        return userCategory;
    }

    public void setUserCategory(String userCategory) {
        this.userCategory = userCategory;
    }

    public String getNIC() {
        return NIC;
    }

    public void setNIC(String NIC) {
        this.NIC = NIC;
    }

    public String getAdminID() {
        return adminID;
    }

    public void setAdminID(String adminID) {
        this.adminID = adminID;
    }
}