package com.titkul.lms.repository;

import com.titkul.lms.entity.StudentReward;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudentRewardRepository extends JpaRepository<StudentReward, Long> {
    List<StudentReward> findByStudentIdOrderByUnlockedDateDesc(Long studentId);
}
