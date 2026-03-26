package com.example.jumbowatch.admin;

import com.example.jumbowatch.model.Zone;
import com.example.jumbowatch.repository.ZoneRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/zones")
@CrossOrigin(origins = "*") // Lets the web app connect!
public class ZoneController {

    @Autowired
    private ZoneRepository zoneRepo;

    // 🗺️ Fetch all zones to draw on the map
    @GetMapping
    public List<Zone> getAllZones() {
        return zoneRepo.findAll();
    }

    // ✏️ Save a newly drawn zone from the web portal
    @PostMapping
    public Zone createZone(@RequestBody Zone zone) {
        return zoneRepo.save(zone);
    }
}

// function loadZones() {
//     fetch('http://localhost:8080/api/admin/zones')
//         .then(response => response.json())
//         .then(data => {
//             console.log("Loaded Zones:", data);
//             // Loop through 'data' here and draw the rectangles on your map!
//         })
//         .catch(error => console.error('Error loading zones:', error));
// }




// function saveZone(zoneName, minLat, maxLat, minLon, maxLon) {
//     const zoneData = {
//         name: zoneName,
//         minLat: minLat,
//         maxLat: maxLat,
//         minLon: minLon,
//         maxLon: maxLon
//     };

//     fetch('http://localhost:8080/api/admin/zones', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(zoneData)
//     })
//     .then(response => response.json())
//     .then(data => alert("✅ Zone saved successfully with ID: " + data.id))
//     .catch(error => console.error('Error saving zone:', error));
// }