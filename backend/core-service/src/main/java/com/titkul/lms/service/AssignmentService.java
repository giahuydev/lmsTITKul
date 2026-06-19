package com.titkul.lms.service;

import com.titkul.lms.dto.AssignmentRequestDTO;
import com.titkul.lms.entity.Assignment;
import com.titkul.lms.entity.AssignmentType;
import com.titkul.lms.entity.ClassRoom;
import com.titkul.lms.entity.TeacherProfile;
import com.titkul.lms.repository.AssignmentRepository;
import com.titkul.lms.repository.ClassRoomRepository;
import com.titkul.lms.repository.TeacherProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final ClassRoomRepository classRoomRepository;
    private final TeacherProfileRepository teacherProfileRepository;

    public Assignment createAssignment(AssignmentRequestDTO dto) {
        Assignment assignment = new Assignment();
        assignment.setTitle(dto.getTitle());
        assignment.setDescription(dto.getDescription());
        assignment.setDeadline(dto.getDeadline());
        if (dto.getIsHardLock() != null) {
            assignment.setIsHardLock(dto.getIsHardLock());
        }
        
        if (dto.getType() != null) {
            assignment.setType(AssignmentType.valueOf(dto.getType()));
        } else {
            assignment.setType(AssignmentType.TU_LUAN); // Default
        }

        if (dto.getClassId() != null) {
            ClassRoom classRoom = classRoomRepository.findById(dto.getClassId())
                    .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Không tìm thấy Lớp học với ID: " + dto.getClassId()));
            assignment.setClassRoom(classRoom);
        } else {
            throw new IllegalArgumentException("classId không được để trống!");
        }

        if (dto.getTeacherId() != null) {
            TeacherProfile teacher = teacherProfileRepository.findByUserId(dto.getTeacherId())
                    .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Không tìm thấy Giáo viên với User ID: " + dto.getTeacherId()));
            assignment.setTeacher(teacher);
        } else {
            throw new IllegalArgumentException("teacherId không được để trống!");
        }

        return assignmentRepository.save(assignment);
    }

    public org.springframework.data.domain.Page<Assignment> getAssignmentsByClassId(Long classId, org.springframework.data.domain.Pageable pageable) {
        return assignmentRepository.findByClassRoomId(classId, pageable);
    }
}
