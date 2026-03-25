package com.example.jumbowatch.repository;

import com.example.jumbowatch.model.Sighting;
import org.springframework.data.jpa.repository.JpaRepository;

// This single line gives you full create, read, update, delete powers!
public interface SightingRepository extends JpaRepository<Sighting, Long> {
}