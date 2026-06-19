package com.titkul.lms.repository;

import com.titkul.lms.entity.Assignment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    @EntityGraph(attributePaths = {"teacher", "classRoom"})
    Page<Assignment> findByClassRoomId(Long classRoomId, Pageable pageable);
    
    long countByTeacher_Id(Long teacherId);

    List<Assignment> findByClassRoom_IdIn(List<Long> classRoomIds);
    List<Assignment> findByClassRoom_IdInOrderByDeadlineAsc(List<Long> classRoomIds);
}
