package com.example.jumbowatch.controller.sighting;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.jumbowatch.model.Sighting;
import com.example.jumbowatch.repository.SightingRepository;

import java.util.Optional;

@RestController
@RequestMapping("/api/admin/sightings")
public class ConfirmationController {

    @Autowired
    private SightingRepository sightingRepo;

    public ConfirmationController(SightingRepository sightingRepo) {
        this.sightingRepo = sightingRepo;
    }

    @PutMapping("/verify/{id}")
    public String verifySighting(@PathVariable Long id) {
        Optional<Sighting> sightingBox = sightingRepo.findById(id);

        if (sightingBox.isPresent()) {
            Sighting sighting = sightingBox.get();
            sighting.setStatus("verified");
            sightingRepo.save(sighting);
            return "Sighting " + id + " verified by admin!";
        }
        return "Sighting not found!";
    }

    @PutMapping("/neglect/{id}")
    public String neglectSighting(@PathVariable Long id) {
        Optional<Sighting> sightingBox = sightingRepo.findById(id);

        if (sightingBox.isPresent()) {
            Sighting sighting = sightingBox.get();
            sighting.setStatus("neglected");
            sightingRepo.save(sighting);
            return "Sighting " + id + " neglected by admin!";
        }
        return "Sighting not found!";
    }
}

