package com.titkul.lms.service;

import com.titkul.lms.dto.AssignmentRequestDTO;
import com.titkul.lms.entity.Assignment;
import com.titkul.lms.entity.AssignmentType;
import com.titkul.lms.entity.ClassRoom;
import com.titkul.lms.entity.ClassStatus;
import com.titkul.lms.entity.HocLieu;
import com.titkul.lms.entity.TeacherProfile;
import com.titkul.lms.repository.AssignmentRepository;
import com.titkul.lms.repository.ClassRoomRepository;
import com.titkul.lms.repository.HocLieuRepository;
import com.titkul.lms.repository.TeacherProfileRepository;
import com.titkul.lms.repository.LessonRepository;
import com.titkul.lms.repository.ContentNodeRepository;
import com.titkul.lms.repository.SemesterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final ClassRoomRepository classRoomRepository;
    private final TeacherProfileRepository teacherProfileRepository;
    private final LessonRepository lessonRepository;
    private final ContentNodeRepository contentNodeRepository;
    private final SemesterRepository semesterRepository;
    private final HocLieuRepository hocLieuRepository;

    public Assignment createAssignment(AssignmentRequestDTO dto) {
        Assignment assignment = new Assignment();
        assignment.setTitle(dto.getTitle());
        assignment.setDescription(dto.getDescription());
        assignment.setDeadline(dto.getDeadline());
        if (dto.getMaxResubmitCount() != null) {
            assignment.setMaxResubmitCount(dto.getMaxResubmitCount());
        }
        
        if (dto.getType() != null) {
            assignment.setType(AssignmentType.valueOf(dto.getType()));
        } else {
            assignment.setType(AssignmentType.TU_LUAN); // Default
        }

        if (dto.getClassId() != null) {
            ClassRoom classRoom = classRoomRepository.findById(dto.getClassId())
                    .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Không tìm thấy Lớp học với ID: " + dto.getClassId()));
            if (classRoom.getStatus() != ClassStatus.ACTIVE) {
                throw new IllegalArgumentException("Lớp học đã đóng băng (DONG_BANG), không thể giao bài tập mới.");
            }
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

        if (dto.getLessonId() != null) {
            assignment.setLesson(lessonRepository.findById(dto.getLessonId()).orElse(null));
        }
        if (dto.getContentNodeId() != null) {
            assignment.setContentNode(contentNodeRepository.findById(dto.getContentNodeId()).orElse(null));
        }
        if (dto.getHocLieuId() != null) {
            HocLieu hocLieu = hocLieuRepository.findById(dto.getHocLieuId())
                    .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Không tìm thấy Học liệu với ID: " + dto.getHocLieuId()));
            assignment.setHocLieu(hocLieu);
        }
        if (dto.getSemesterId() != null) {
            assignment.setSemester(semesterRepository.findById(dto.getSemesterId()).orElse(null));
        }

        if (assignment.getType() == AssignmentType.H5P) {
            String h5pContentId = assignment.getHocLieu() != null ? assignment.getHocLieu().getH5pContentId()
                    : assignment.getContentNode() != null ? assignment.getContentNode().getH5pContentId() : null;
            if (h5pContentId == null || h5pContentId.isBlank()) {
                throw new IllegalArgumentException("Bài tập H5P phải gắn với một học liệu (hoặc bài giảng) đã có nội dung H5P.");
            }
        }

        return assignmentRepository.save(assignment);
    }

    public org.springframework.data.domain.Page<Assignment> getAssignmentsByClassId(Long classId, org.springframework.data.domain.Pageable pageable) {
        return assignmentRepository.findByClassRoomId(classId, pageable);
    }
}
