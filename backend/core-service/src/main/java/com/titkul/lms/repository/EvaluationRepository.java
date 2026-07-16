package com.titkul.lms.repository;

import com.titkul.lms.entity.Evaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;

@Repository
public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {
    List<Evaluation> findBySubmission_Student_IdOrderByEvaluatedAtDesc(Long studentId, Pageable pageable);
    List<Evaluation> findBySubmission_Student_IdInOrderByEvaluatedAtDesc(List<Long> studentIds, Pageable pageable);
    List<Evaluation> findBySubmission_Student_IdInOrderByEvaluatedAtDesc(List<Long> studentIds);
    Optional<Evaluation> findBySubmission_Id(Long submissionId);
}
