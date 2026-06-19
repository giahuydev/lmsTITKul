package com.titkul.lms.repository;

import com.titkul.lms.entity.LessonCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LessonCategoryRepository extends JpaRepository<LessonCategory, Long> {
    List<LessonCategory> findByGradeOrderByLessonNumberAsc(Short grade);
}
