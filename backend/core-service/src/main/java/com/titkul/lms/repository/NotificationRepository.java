package com.titkul.lms.repository;

import com.titkul.lms.entity.Notification;
import com.titkul.lms.entity.NotificationAudience;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    // classRoom IS NULL = thông báo hệ thống toàn trường, luôn hiện cho mọi lớp
    @Query("SELECT n FROM Notification n WHERE (n.classRoom.id = :classRoomId OR n.classRoom IS NULL) AND n.audience IN :audiences ORDER BY n.postedAt DESC")
    List<Notification> findVisibleToClass(@Param("classRoomId") Long classRoomId, @Param("audiences") Collection<NotificationAudience> audiences);

    @Query("SELECT n FROM Notification n WHERE n.classRoom IS NULL AND n.audience IN :audiences ORDER BY n.postedAt DESC")
    List<Notification> findGlobalOnly(@Param("audiences") Collection<NotificationAudience> audiences);

    List<Notification> findBySender_IdOrderByPostedAtDesc(Long senderId);
}
