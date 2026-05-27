package com.example.jumbowatch.controller.user;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.jumbowatch.model.User;
import com.example.jumbowatch.repository.UserRepository;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserTrackingController {

    @Autowired
    private UserRepository userRepository;

    @PutMapping("/updateZone")
    public ResponseEntity<Object> updateZone(Principal principal, @RequestBody Map<String, Object> payload) {
        try {
            if (principal == null) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("message", "Unauthorized access");
                return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
            }

            String email = principal.getName();
            User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

            Long zoneId = null;
            if (payload.get("zoneId") != null) {
                String zoneIdStr = payload.get("zoneId").toString().trim();
                if (!"null".equalsIgnoreCase(zoneIdStr) && !zoneIdStr.isEmpty()) {
                    zoneId = Long.valueOf(zoneIdStr);
                }
            }

            // Fallback logic: "When a user is out of all zones, the zoneId in the user table must be set to the primary zone."
            if (zoneId == null) {
                user.setZoneId(user.getPrimaryZone());
            } else {
                user.setZoneId(zoneId);
            }

            User updatedUser = userRepository.save(user);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Zone updated successfully");
            response.put("status", HttpStatus.OK.value());
            response.put("zoneId", updatedUser.getZoneId());
            response.put("primaryZone", updatedUser.getPrimaryZone());
            
            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Failed to update zone");
            errorResponse.put("error", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
    }
}
