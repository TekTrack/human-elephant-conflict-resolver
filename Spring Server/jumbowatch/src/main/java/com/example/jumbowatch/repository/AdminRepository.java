package com.example.jumbowatch.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.jumbowatch.model.Admin;

@Repository
public interface AdminRepository extends JpaRepository<Admin, String> {

    //Find user by email (or username)
    Optional<Admin> findByEmail(String email);

    //Check if user with the same email already exists
    boolean existsByEmail(String email);

    @Query("SELECT a.adminid FROM Admin a WHERE a.username = :username")
    String findAdminIdByUsername(@Param("username") String username);

}
