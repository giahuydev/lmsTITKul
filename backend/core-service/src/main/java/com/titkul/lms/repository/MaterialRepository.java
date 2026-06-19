package com.titkul.lms.repository;

import com.titkul.lms.entity.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaterialRepository extends JpaRepository<Material, Long> {
    List<Material> findByLessonCategoryId(Long lessonCategoryId);
    long countByTeacher_Id(Long teacherId);
}
