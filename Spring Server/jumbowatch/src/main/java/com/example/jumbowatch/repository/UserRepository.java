package com.example.jumbowatch.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.jumbowatch.model.User; // Assuming User is in the model package; adjust if necessary

public interface UserRepository extends JpaRepository<User, String> {

    //Find user by email (or username)
    Optional<User> findByEmail(String email);

    //Check if user with the same email already exists
    boolean existsByEmail(String email);

    //Check if user with the same Identity ID already exists
    @Query("SELECT COUNT(u) > 0 FROM User u WHERE u.identityID = :identityID")
    boolean existsByIdentityID(@Param("identityID") String identityID);

    @Query("SELECT u FROM User u WHERE u.adminID = :adminId")
    List<User> findUsersByAdminId(@Param("adminId") String adminId);

    //Chek if user with same Phone Number is exist
    @Query("SELECT COUNT(u) > 0 FROM User u WHERE u.phoneNumber = :phoneNumber" )
    boolean existByphoneNumber(@Param("phoneNumber") String phoneNumber);

    //get the Id of the User
    @Query("SELECT u FROM User u WHERE u.phoneNumber = :phoneNumber")
    Optional<User> getuserfomPhone(@Param("phoneNumber") String phoneNumber);
}
