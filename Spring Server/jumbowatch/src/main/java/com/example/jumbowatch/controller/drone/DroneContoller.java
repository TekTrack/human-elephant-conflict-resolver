package com.example.jumbowatch.controller.drone;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;                         //B////////////C
import org.springframework.web.bind.annotation.GetMapping;                          //            //
import org.springframework.web.bind.annotation.PostMapping;                         //            //
import org.springframework.web.bind.annotation.RequestBody;                         //            //
import org.springframework.web.bind.annotation.RequestMapping;                      //A////////////D 
import org.springframework.web.bind.annotation.RestController;

import com.example.jumbowatch.model.Drone;
import com.example.jumbowatch.repository.DroneRepository;

@RestController
@RequestMapping("/api/admin/drones")
@CrossOrigin(origins = "http://localhost:5173") 
public class DroneContoller {
    @Autowired
    private DroneRepository droneRepo;

    @GetMapping
    public List<Drone> getDrones(){
        List<Drone> drones = droneRepo.findAll();

        return drones;
    }
    
    @PostMapping
    public Drone createDrone(@RequestBody Drone drone){
        return droneRepo.save(drone);
    }


}
