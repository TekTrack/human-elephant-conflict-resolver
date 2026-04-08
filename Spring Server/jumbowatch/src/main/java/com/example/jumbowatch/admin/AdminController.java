package com.example.jumbowatch.admin;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.jumbowatch.model.Admin;
import com.example.jumbowatch.model.JwtUtil;
import com.example.jumbowatch.model.User;
import com.example.jumbowatch.repository.AdminRepository;
import com.example.jumbowatch.repository.UserRepository;

import tools.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AdminRepository adminRepository;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    @Autowired
    private UserRepository userRepository;

    //Admin Registration Endpoint
    @PostMapping("/newadmin")
    public ResponseEntity<Object> createAdmin(@RequestBody Admin admin) {
        try {


            System.out.println("Received admin registration request: " + admin.getUsername()); // Debugging line

            //Check if admin with the same username already exists
            if (adminRepository.existsById(admin.getUsername())) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("message", "Admin with this username already exists");
                return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
            }

            //Check if admin with the same email already exists
            if (adminRepository.existsByEmail(admin.getEmail())) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("message", "Admin with this email already exists");
                return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
            }

            // //check if admin with the same phone number already exists
            // if (adminRepository.existsByPhone(admin.getPhone())) {
            //     Map<String, Object> errorResponse = new HashMap<>();
            //     errorResponse.put("message", "Admin with this phone number already exists");
            //     return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
            // }

            // //Check if admin with the same admin ID already exists
            // if (adminRepository.existsByAdminId(admin.getAdminId())) {
            //     Map<String, Object> errorResponse = new HashMap<>();
            //     errorResponse.put("message", "Admin with this Admin ID already exists");
            //     return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
            // }

            String hashedPassword = passwordEncoder.encode(admin.getPassword());
            admin.setPassword(hashedPassword);

            Admin savedAdmin = adminRepository.save(admin);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Admin created successfully!");
            response.put("status", HttpStatus.CREATED.value());
            response.put("data", savedAdmin);
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
//Admin Login Endpoint

    @PostMapping("/login")
    public ResponseEntity<Object> loginAdmin(@RequestBody Map<String, String> loginData) {

        String username = loginData.get("username");
        String password = loginData.get("password");
        try {
            Admin admin = adminRepository.findById(username)
                    .orElseThrow(() -> new RuntimeException("Admin not found"));

            if (passwordEncoder.matches(password, admin.getPassword())) {

                String token = jwtUtil.generateToken(username);

                Map<String, Object> response = new HashMap<>();
                response.put("message", "Login successful!");
                response.put("status", HttpStatus.OK.value());
                response.put("token", token);
                response.put("data", admin);
               
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

    //Get the All User Details Endpoint
    @GetMapping("/users")
    public ResponseEntity<Object> getAllUsers(Principal principal) {
        try {
            String adminUsername = principal.getName();
            System.out.println("Admin Username: " + adminUsername); // Debugging line
            

            String AdminID = adminRepository.findAdminIdByUsername(adminUsername);
            if (AdminID == null) {
                throw new RuntimeException("Admin ID not found for username: " + adminUsername);
            }

            Iterable<User> users = userRepository.findUsersByAdminId(AdminID);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Users retrieved successfully!");
            response.put("status", HttpStatus.OK.value());
            response.put("data", users);
           

            // ObjectMapper mapper = new ObjectMapper();
            // String jsonResponse = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(response);

            // System.out.println("--- Full JSON Response to Frontend ---");
            // System.out.println(jsonResponse);
            // System.out.println("--------------------------------------");
        return new ResponseEntity<>(response, HttpStatus.OK);


        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Failed to retrieve users");
            errorResponse.put("error", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
    }

    //get Admin Details Endpoint
    @GetMapping("/details")
    public ResponseEntity<Object> getAdminDetails(Principal principal) {
        try {
            String adminUsername = principal.getName();

            Admin admin = adminRepository.findById(adminUsername)
                    .orElseThrow(() -> new RuntimeException("Admin not found"));

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Admin details retrieved successfully!");
            response.put("status", HttpStatus.OK.value());
            response.put("data", admin);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Failed to retrieve admin details");
            errorResponse.put("error", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
    }

    //get all admin details Endpoint
    @GetMapping("/alladmins")
    public ResponseEntity<Object> getAllAdmins() {
        try {
            Iterable<Admin> admins = adminRepository.findAll();
            System.out.println("--- Current Admin IDs ---");
        admins.forEach(admin -> System.out.println("Admin ID: " + admin.getAdminId()));
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Admins retrieved successfully!");
            response.put("status", HttpStatus.OK.value());
            response.put("data", admins);
          
            // ObjectMapper mapper = new ObjectMapper();
            // String jsonResponse = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(response);

            // System.out.println("--- Full JSON Response to Frontend ---");
            // System.out.println(jsonResponse);
            // System.out.println("--------------------------------------");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Failed to retrieve admins");
            errorResponse.put("error", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
    }

    //User Creation Endpoint
    @PostMapping("/createuser")
    public ResponseEntity<Object> createUser(@RequestBody User user) {
        try {
            if (userRepository.existsByEmail(user.getEmail())) {
                return ResponseEntity.status(409).body(Map.of("message", "User with this email already exists"));
            }

            //Identity ID Check
            if (userRepository.existsByIdentityID(user.getIdentityID())) {
                return ResponseEntity.status(409).body(Map.of("message", "User with this Identity ID already exists"));
            }

            // Password hashing before saving to the database
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            User savedUser = userRepository.save(user);
           // System.out.println(user);
            return ResponseEntity.status(201).body(Map.of(
                    "message", "User created successfully!",
                    "status", 201,
                    "data", savedUser
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Error: " + e.getMessage()));
        }

    }


    //Admin Logout Endpoint (Token Invalidation)
    @PostMapping("/logout")
    public ResponseEntity<Object> logoutAdmin(Principal principal) {
        try {
            String adminUsername = principal.getName();
            jwtUtil.invalidateToken(adminUsername);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Logout successful!");
            response.put("status", HttpStatus.OK.value());
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Logout failed");
            errorResponse.put("error", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
    }


    //User Update Endpoint
    @PostMapping("/updateuser")
    public ResponseEntity<Object> updateUser(@RequestBody User user) {
        try {


            System.out.println("Attempting to update user: " + user.getEmail()); // Debugging line
            User existingUser = userRepository.findByEmail(user.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            existingUser.setName(user.getName());
            existingUser.setPhoneNumber(user.getPhoneNumber());

            if (user.getPassword() != null && !user.getPassword().isEmpty()) {
                existingUser.setPassword(passwordEncoder.encode(user.getPassword()));
            }

            User updatedUser = userRepository.save(existingUser);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "User updated successfully!");
            response.put("status", HttpStatus.OK.value());
            response.put("data", updatedUser);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Failed to update user");
            errorResponse.put("error", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
    }

   // Admin Update Endpoint
    @PostMapping("/updateadmin")
    public ResponseEntity<Object> updateAdmin(@RequestBody Admin admin) {
        try {
            Admin existingAdmin = adminRepository.findById(admin.getUsername())
                    .orElseThrow(() -> new RuntimeException("Admin not found"));

                    System.out.println("Attempting to update admin: " + admin.getUsername()); // Debugging line

            existingAdmin.setAdminId(admin.getAdminId());
            existingAdmin.setEmail(admin.getEmail());
            existingAdmin.setPhone(admin.getPhone());
            existingAdmin.setName(admin.getName());

            if (admin.getPassword() != null && !admin.getPassword().isEmpty()) {
                existingAdmin.setPassword(passwordEncoder.encode(admin.getPassword()));
            }

            Admin updatedAdmin = adminRepository.save(existingAdmin);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Admin updated successfully!");
            response.put("status", HttpStatus.OK.value());
            response.put("data", updatedAdmin);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Failed to update admin");
            errorResponse.put("error", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
    }


    // User Deletion Endpoint
    @PostMapping("/deleteuser")
    public ResponseEntity<Object> deleteUser(@RequestBody User user) {
        try {

            String userEmail = user.getEmail(); // Get the email from the request body
            User existingUser = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not found with email: " + userEmail));
            userRepository.delete(existingUser); // Delete the user using the email
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User deleted successfully!");
            response.put("status", HttpStatus.OK.value());
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Failed to delete user");
            errorResponse.put("error", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
    }

   // Admin Deletion Endpoint
    @PostMapping("/deleteadmin")
    public ResponseEntity<Object> deleteAdmin(@RequestBody Admin admin) {
        try {

            System.out.println("Attempting to delete admin: " + admin.getAdminId()); // Debugging line

            String adminId = admin.getAdminId(); // Get the admin ID from the request body
            //get the usename of the admin to be deleted
            String username = adminRepository.findUsernameByAdminId(adminId);
            if (username == null) {
                throw new RuntimeException("Admin not found with ID: " + adminId);
            }

                    System.out.println("Admin username to be deleted: " + username); // Debugging line

            adminRepository.deleteById(username); // Delete the admin using the username
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Admin deleted successfully!");
            response.put("status", HttpStatus.OK.value());
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Failed to delete admin");
            errorResponse.put("error", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
    }

}
