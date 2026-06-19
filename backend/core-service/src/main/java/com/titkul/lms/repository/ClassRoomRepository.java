package com.titkul.lms.repository;

import com.titkul.lms.entity.ClassRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClassRoomRepository extends JpaRepository<ClassRoom, Long> {
    java.util.Optional<ClassRoom> findByName(String name);
    boolean existsByNameAndAcademicYear(String name, String academicYear);
    java.util.List<ClassRoom> findByHomeroomTeacher_Id(Long teacherId);
    long countByStatus(com.titkul.lms.entity.ClassStatus status);
}
