package com.example.jumbowatch.repository;

import com.example.jumbowatch.model.Sighting;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SightingRepository extends JpaRepository<Sighting, Long> {
    // 👈 Add this exact line!
    List<Sighting> findByTimestampAfter(LocalDateTime time); 
}