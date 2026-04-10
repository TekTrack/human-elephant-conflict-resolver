package com.example.jumbowatch.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.jumbowatch.model.JwtUtil;
import com.example.jumbowatch.model.User;
import com.example.jumbowatch.repository.UserRepository;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<Object> registerUser(@RequestBody User user) {
        try {
            if (userRepository.existsByEmail(user.getEmail())) {
                return ResponseEntity.status(409).body(Map.of("message", "User with this email already exists"));
            }

            //Identity ID Check
            if (userRepository.existsByIdentityID(user.getIdentityID())) {
                return ResponseEntity.status(409).body(Map.of("message", "User with this Identity ID already exists"));
            }

            //Phone Number Check
            if(userRepository.existByphoneNumber(user.getPhoneNumber())){
                return ResponseEntity.status(409).body(Map.of("message", "User with this Phone Number is already exists"));
            }


            // Password hashing before saving to the database
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            User savedUser = userRepository.save(user);

            return ResponseEntity.status(201).body(Map.of(
                    "message", "User created successfully!",
                    "status", 201,
                    "data", savedUser
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Error: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Object> loginUser(@RequestBody Map<String, String> loginData) {
        try {
            String email = loginData.get("email");
            String password = loginData.get("password");

            // User hoyagannawa, nathi unoth exception ekak throw wenawa
            User existingUser = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User Not Found"));

            // Password check kireema
            if (!passwordEncoder.matches(password, existingUser.getPassword())) {
                return ResponseEntity.status(401).body(Map.of("message", "Invalid email or password"));
            }

            //Jwt token generation
            String token = jwtUtil.generateToken(email);

            return ResponseEntity.status(200).body(Map.of(
                    "message", "Login successful!",
                    "status", 200,
                    "data", existingUser,
                    "token", token
            ));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("message", "Login failed: User not found"));
        }
    }
}
