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

import com.example.jumbowatch.model.Zone;
import com.example.jumbowatch.model.ZoneCorners;
import com.example.jumbowatch.repository.ZoneRepository;

@RestController
@RequestMapping("/api/admin/zones")
@CrossOrigin(origins = "*") // Lets the web app connect!
public class ZoneController {

    @Autowired
    private ZoneRepository zoneRepo;

    // 🗺️ Fetch all zones to draw on the map
    @GetMapping
    public List<ZoneCorners> getAllZones() {

        List<Zone> zones = zoneRepo.findAll();
        List<ZoneCorners> zoneCornersList = new ArrayList<>();

        for (Zone zone : zones) {
            zoneCornersList.add(zoneCreation(zone));
        }

        return zoneCornersList;

    }

    private ZoneCorners zoneCreation(Zone zone) {

        double[] a = {zone.getMinLat(), zone.getMinLon()}; // A
        double[] b = {zone.getMinLat(), zone.getMaxLon()}; // B
        double[] c = {zone.getMaxLat(), zone.getMaxLon()}; // C
        double[] d = {zone.getMaxLat(), zone.getMinLon()}; // D

        ZoneCorners zoneCorners = new ZoneCorners(zone.getName(), a, b, c, d);
        return zoneCorners;
    }

    // ✏️ Save a newly drawn zone from the web portal
    @PostMapping
    public Zone notcreatedZoneSaving(@RequestBody Zone zone) {
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
