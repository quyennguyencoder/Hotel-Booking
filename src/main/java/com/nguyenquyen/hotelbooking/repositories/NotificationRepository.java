package com.nguyenquyen.hotelbooking.repositories;

import com.nguyenquyen.hotelbooking.entities.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

}
