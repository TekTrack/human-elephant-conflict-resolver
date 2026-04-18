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

    // //Check if admin with the same admin ID already exists
    // boolean existsByAdminId(String adminId);

    // //Check if admin with the same username already exists
    // boolean existsByUsername(String username);

    // //Check if admin with the same phone number already exists
    // boolean existsByPhone(String phone);

    //get usermname by Admin ID
    @Query("SELECT a.username FROM Admin a WHERE a.adminid = :adminId")
    String findUsernameByAdminId(@Param("adminId") String adminId);


    //get the by admin id
    @Query("SELECT a FROM Admin a WHERE a.adminid = :adminid")
    Optional<Admin> userfindbyID (@Param ("adminid") String adminid);
}
