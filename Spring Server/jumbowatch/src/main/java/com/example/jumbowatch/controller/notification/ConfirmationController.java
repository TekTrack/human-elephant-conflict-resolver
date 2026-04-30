package com.example.jumbowatch.controller.notification;

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

    @PutMapping("/{id}/verify")
    public String verifySighting(@PathVariable Long id) {
        Optional<Sighting> sightingBox = sightingRepo.findById(id);

        if (sightingBox.isPresent()) {
            Sighting sighting = sightingBox.get();
            sighting.setVerified(true);
            sightingRepo.save(sighting);
            return "Sighting " + id + " verified by admin!";
        }
        return "Sighting not found!";
    }
}

