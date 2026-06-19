package com.titkul.lms.repository;

import com.titkul.lms.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipientIdOrderByDateDesc(Long recipientId);
    List<Notification> findByRecipientIdAndReadFalseOrderByDateDesc(Long recipientId);
}
