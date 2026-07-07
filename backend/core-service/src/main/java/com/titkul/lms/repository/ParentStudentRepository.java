package com.titkul.lms.repository;

import com.titkul.lms.entity.ParentStudent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ParentStudentRepository extends JpaRepository<ParentStudent, Long> {
}

