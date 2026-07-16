package com.titkul.lms.repository;

import com.titkul.lms.entity.SupportTicket;
import com.titkul.lms.entity.SupportTicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupportTicketRepository extends JpaRepository<SupportTicket, Long> {
    List<SupportTicket> findByTeacher_NguoiDungIdOrderByCreatedAtDesc(Long teacherId);
    List<SupportTicket> findByStatusOrderByCreatedAtAsc(SupportTicketStatus status);
}
