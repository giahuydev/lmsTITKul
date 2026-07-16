package com.titkul.lms.repository;

import com.titkul.lms.entity.NotificationReadStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NotificationReadStatusRepository extends JpaRepository<NotificationReadStatus, Long> {
    Optional<NotificationReadStatus> findByUser_NguoiDungIdAndNotification_Id(Long userId, Long notificationId);

    List<NotificationReadStatus> findByUser_NguoiDungId(Long userId);
}
