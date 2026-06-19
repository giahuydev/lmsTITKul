package com.titkul.lms.repository;

import com.titkul.lms.entity.StudentProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentProfileRepository extends JpaRepository<StudentProfile, Long> {
    Optional<StudentProfile> findByStudentCode(String studentCode);
    Optional<StudentProfile> findByUserId(Long userId);
    java.util.List<StudentProfile> findByParentId(Long parentId);
    java.util.List<StudentProfile> findByClassRoomId(Long classRoomId);
    long countByClassRoomId(Long classRoomId);
}
