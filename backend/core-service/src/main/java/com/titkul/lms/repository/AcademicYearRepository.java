package com.titkul.lms.repository;

import com.titkul.lms.entity.AcademicYear;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AcademicYearRepository extends JpaRepository<AcademicYear, Integer> {
    java.util.Optional<AcademicYear> findByName(String name);
}

