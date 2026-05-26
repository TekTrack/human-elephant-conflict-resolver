package com.example.jumbowatch.controller.zone;

import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;                         //B////////////C
import org.springframework.web.bind.annotation.DeleteMapping;                          //            //
import org.springframework.web.bind.annotation.GetMapping;                         //            //
import org.springframework.web.bind.annotation.PathVariable;                         //            //
import org.springframework.web.bind.annotation.PostMapping;                      //A////////////D 
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.jumbowatch.model.Zone;
import com.example.jumbowatch.repository.AdminRepository;
import com.example.jumbowatch.repository.ZoneRepository;
@RestController
@RequestMapping("/api/admin/zones")
@CrossOrigin(origins = "http://localhost:5173") // Lets the web app connect!
//@CrossOrigin(origins = "*") // Allows the web app to connect to this controller 
public class ZoneController {

    @Autowired
    private ZoneRepository zoneRepo;

    @Autowired
    private AdminRepository adminRepo;

    // 🗺️ Fetch all zones to draw on the map
    @GetMapping
    public List<Zone> getAllZones() {

        List<Zone> zones = zoneRepo.findAll();
        return zones;
    }



    //get admin username form token
    private String getAdminIdfromprincipal(Principal principal) {
       if (principal == null) {
            throw new RuntimeException("Unauthorized: No security principal found");
        }
        String username = principal.getName();
        return adminRepo.findAdminIdByUsername(username);
    }




  
    // ✏️ Save a newly drawn zone from the web portal
   @PostMapping
    public Zone notcreatedZoneSaving(@RequestBody Zone zone, Principal principal) {
        String adminId = getAdminIdfromprincipal(principal);
        zone.setAdminid(adminId);
        return zoneRepo.save(zone);
    }

    // 🧹 Delete all zones (for testing purposes)
    @DeleteMapping
    public void deleteAllZones() {
        zoneRepo.deleteAll();
    }

    @DeleteMapping("/{id}")
    public void deleteZoneById(@PathVariable Long id) {
        zoneRepo.deleteById(id);
    }

    // @PutMapping("/{id}")
    // public Zone updateZone(@PathVariable Long id, @RequestBody Zone zone) {
    //     zone.setId(id);
    //     return zoneRepo.save(zone);
    // }
    
}

