package com.titkul.lms.repository;

import com.titkul.lms.entity.StudentProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentProgressRepository extends JpaRepository<StudentProgress, Long> {
    Optional<StudentProgress> findByStudent_IdAndContentNode_Id(Long studentId, Integer contentNodeId);

    List<StudentProgress> findByStudent_Id(Long studentId);

    List<StudentProgress> findByStudent_IdIn(List<Long> studentIds);

    List<StudentProgress> findByStudent_IdAndContentNode_Subject_Id(Long studentId, Integer subjectId);

    long countByStudent_IdAndContentNode_Subject_IdAndCompletedTrue(Long studentId, Integer subjectId);
}
