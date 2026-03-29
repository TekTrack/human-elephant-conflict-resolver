package com.example.jumbowatch.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.jumbowatch.model.Zone;

@Repository
public interface ZoneRepository extends JpaRepository<Zone, Long> {

    Zone findByName(String name);

}
