package com.titkul.lms.repository;

import com.titkul.lms.entity.LessonCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LessonCategoryRepository extends JpaRepository<LessonCategory, Long> {
}
