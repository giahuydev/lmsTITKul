package com.titkul.lms.repository;

import com.titkul.lms.entity.ClassTransferHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClassTransferHistoryRepository extends JpaRepository<ClassTransferHistory, Long> {
    List<ClassTransferHistory> findByStudent_IdOrderByTransferredAtDesc(Long studentId);
}
