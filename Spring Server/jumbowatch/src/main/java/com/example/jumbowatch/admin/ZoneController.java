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

import com.example.jumbowatch.model.Zone;
import com.example.jumbowatch.repository.ZoneRepository;
import com.example.jumbowatch.model.Sighting;

@RestController
@RequestMapping("/api/admin/zones")
@CrossOrigin(origins = "*") // Lets the web app connect!
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

    // Future: Add PUT endpoint to update zones if needed
    // @PutMapping("/{id}")
    // public Zone updateZone(@PathVariable Long id, @RequestBody Zone zone) {
    //     zone.setId(id);
    //     return zoneRepo.save(zone);
    // }
    //Zone Blooming If the Drone is Inthe Zone, then the Zone Blooms (turns red on the map) and Admin gets an immediate notification. This is handled in the AlertController when a new sighting is saved. The containsSighting method in the Zone class checks if the sighting falls within any defined zones, and if so, updates the AdminNotification accordingly.
    //return true id the Drone i s inte Zone
    //Hear we pass the ZoneCorners to the web app to draw the rectangle on the map and also pass the message to AdminNotification to update the notification for the admin.
    

}

