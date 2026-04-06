package com.example.jumbowatch.admin;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;                         //B////////////C
import org.springframework.web.bind.annotation.GetMapping;                          //            //
import org.springframework.web.bind.annotation.PostMapping;                         //            //
import org.springframework.web.bind.annotation.RequestBody;                         //            //
import org.springframework.web.bind.annotation.RequestMapping;                      //A////////////D 
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.example.jumbowatch.model.Zone;
import com.example.jumbowatch.repository.ZoneRepository;
import com.example.jumbowatch.model.Sighting;

@RestController
@RequestMapping("/api/admin/zones")
@CrossOrigin(origins = "http://localhost:5173") // Lets the web app connect!
//@CrossOrigin(origins = "*") // Allows the web app to connect to this controller 
public class ZoneController {

    @Autowired
    private ZoneRepository zoneRepo;

    // 🗺️ Fetch all zones to draw on the map
    @GetMapping
    public List<Zone> getAllZones() {

        List<Zone> zones = zoneRepo.findAll();
        return zones;
    }

  
    // ✏️ Save a newly drawn zone from the web portal
    @PostMapping
    public Zone notcreatedZoneSaving(@RequestBody Zone zone) {
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

