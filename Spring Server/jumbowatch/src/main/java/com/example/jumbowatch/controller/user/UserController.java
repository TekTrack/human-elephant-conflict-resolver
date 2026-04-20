package com.example.jumbowatch.controller.user;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.jumbowatch.model.JwtUtil;
import com.example.jumbowatch.model.User;
import com.example.jumbowatch.repository.UserRepository;

import tools.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api/user")

public class UserController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<Object> register(@RequestBody Map<String, String> payload) {
        try {
            // Spring Boot now grabs the data directly from your JSON body!
            User user = new User(
                payload.get("email"), 
                payload.get("password"), 
                payload.get("name"), 
                payload.get("phoneNumber"), 
                payload.get("NIC"), 
                payload.get("adminID"), // Matches your JSON exactly
                payload.get("userCategory")
            );
            
            System.out.println("Received user registration request: " + user.getName()); 

            //Check if user with the same username already exists
            if (userRepository.existsByName(user.getName())) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("message", "User with this username already exists");
                return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
            }

            //Check if user with the same email already exists
            if (userRepository.existsByEmail(user.getEmail())) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("message", "User with this email already exists");
                return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
            }

            String hashedPassword = passwordEncoder.encode(user.getPassword());
            user.setPassword(hashedPassword);

            User savedUser = userRepository.save(user);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "User created successfully!");
            response.put("status", HttpStatus.CREATED.value());
            response.put("data", savedUser);
            
            ObjectMapper mapper = new ObjectMapper();
            String jsonResponse = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(response);

            System.out.println("--- Full JSON Response to Frontend ---");
            System.out.println(jsonResponse);
            System.out.println("--------------------------------------");
            
            return new ResponseEntity<>(response, HttpStatus.CREATED);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Failed to create admin");
            errorResponse.put("error", e.getMessage());

            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody Map<String, String> loginData) {

        String email = loginData.get("email");
        String password = loginData.get("password");
        try {
           User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Admin not found"));

            if (passwordEncoder.matches(password,user.getPassword())) {

                String token = jwtUtil.generateToken(email);

                Map<String, Object> response = new HashMap<>();
                response.put("message", "Login successful!");
                response.put("status", HttpStatus.OK.value());
                response.put("token", token);
                response.put("role","user");
                response.put("data", user);
               
                return new ResponseEntity<>(response, HttpStatus.OK);
            } else {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("message", "Invalid credentials");
                return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
            }
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Login failed");
            errorResponse.put("error", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
    }


    //User Updates
    @PostMapping("/updateuser")
    public ResponseEntity<Object> updateUser(@RequestBody User user){
        try {
            
            User existUser = userRepository.userFindbyEmail(user.getEmail())
                .orElseThrow(() -> new RuntimeException("User not Found"));

        
                
            existUser.setName(user.getName());
            existUser.setAdminID(user.getAdminID());
            existUser.setPhoneNumber(user.getPhoneNumber());
            existUser.setUserCategory(user.getUserCategory());

            if (user.getPassword() != null && !user.getPassword().isEmpty()) {
                existUser.setPassword(passwordEncoder.encode(user.getPassword()));
            }


            User updatedUser = userRepository.save(existUser);

            Map<String, Object> response = new HashMap<>();
             response.put("message", "User updated successfully!");
            response.put("status", HttpStatus.OK.value());
            response.put("data", updatedUser);
            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (Exception e) {
             Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Failed to update User");
            errorResponse.put("error", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
    }

}
