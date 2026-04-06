package com.example.jumbowatch.repository;

import com.example.jumbowatch.model.Notification; // Check if this path is actually where Notification.java is
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByZoneId(int zoneId);
}