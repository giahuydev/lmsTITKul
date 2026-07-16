package com.titkul.lms.repository;

import com.titkul.lms.entity.StudentReward;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentRewardRepository extends JpaRepository<StudentReward, Long> {
    List<StudentReward> findByStudent_IdOrderByAwardedAtDesc(Long studentId);
}

