package com.example.jumbowatch.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.jumbowatch.model.Admin;


@Repository
public interface AdminRepository extends JpaRepository<Admin, String> {

    //Find user by email (or username)
    Optional<Admin> findByEmail(String email);

}
