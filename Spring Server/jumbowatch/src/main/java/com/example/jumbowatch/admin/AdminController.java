// package com.example.jumbowatch.admin;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.RequestBody;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;
// import com.example.jumbowatch.model.Adimin;
// import com.example.jumbowatch.repository.AdminRepository;
// @RestController
// @RequestMapping("/api/admin/newadmin")
// public class AdminController {
//     @Autowired
//     private AdminRepository adminRepo;
//     public AdminController(AdminRepository adminRepo) {
//         this.adminRepo = adminRepo;
//     }
//     @PostMapping
//     public String addAdmin(@RequestBody Adimin newAdmin) {
//         if (adminRepo.existsById(newAdmin.getUsername())) {
//             return "❌ Admin with username '" + newAdmin.getUsername() + "' already exists!";
//         }
//         adminRepo.save(newAdmin);
//         return "✅ New admin '" + newAdmin.getUsername() + "' added successfully!";
//     }
// }
package com.example.jumbowatch.admin;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.jumbowatch.model.Admin;
import com.example.jumbowatch.repository.AdminRepository;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AdminRepository adminRepository;
//Admin Registration Endpoint

    @PostMapping("/newadmin")
    public ResponseEntity<Object> createAdmin(@RequestBody Admin admin) {
        try {

            Admin savedAdmin = adminRepository.save(admin);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Admin created successfully!");
            response.put("status", HttpStatus.CREATED.value());
            response.put("data", savedAdmin);

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

            if (admin.getPassword().equals(password)) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Login successful!");
                response.put("status", HttpStatus.OK.value());
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
}
