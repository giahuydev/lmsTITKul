package com.titkul.lms.repository;

import com.titkul.lms.entity.ContentNode;
import com.titkul.lms.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContentNodeRepository extends JpaRepository<ContentNode, Integer> {
    @Query("SELECT DISTINCT cn.subject FROM ContentNode cn WHERE cn.lesson.topic.book.gradeLevel = :grade")
    List<Subject> findDistinctSubjectsByGrade(@Param("grade") Integer grade);

    @Query("SELECT cn FROM ContentNode cn WHERE cn.subject.id = :subjectId AND cn.lesson.topic.book.gradeLevel = :grade ORDER BY cn.lesson.topic.orderNo, cn.lesson.orderNo, cn.orderNo")
    List<ContentNode> findBySubjectAndGradeOrdered(@Param("subjectId") Integer subjectId, @Param("grade") Integer grade);
}

