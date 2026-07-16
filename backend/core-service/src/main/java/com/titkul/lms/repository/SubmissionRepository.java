package com.titkul.lms.repository;

import com.titkul.lms.entity.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByAssignmentId(Long assignmentId);
    List<Submission> findByStudent_Id(Long studentId);
    List<Submission> findByAssignmentIdAndStudent_Id(Long assignmentId, Long studentId);
    List<Submission> findByStudent_IdIn(List<Long> studentIds);
}
