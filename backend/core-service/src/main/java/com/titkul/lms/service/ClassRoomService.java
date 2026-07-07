package com.titkul.lms.service;

import com.titkul.lms.entity.ClassRoom;
import com.titkul.lms.repository.ClassRoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClassRoomService {

    private final ClassRoomRepository classRoomRepository;
    private final com.titkul.lms.repository.TeacherProfileRepository teacherProfileRepository;
    private final com.titkul.lms.repository.StudentProfileRepository studentProfileRepository;
    private final com.titkul.lms.repository.AcademicYearRepository academicYearRepository;

    public List<ClassRoom> getAllClasses() {
        List<ClassRoom> classes = classRoomRepository.findAll();
        for (ClassRoom c : classes) {
            c.setCurrentStudentCount((int) studentProfileRepository.countByClassRoomId(c.getId()));
        }
        return classes;
    }

    public ClassRoom getClassById(Long id) {
        ClassRoom c = classRoomRepository.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy lớp học"));
        c.setCurrentStudentCount((int) studentProfileRepository.countByClassRoomId(c.getId()));
        return c;
    }

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public List<com.titkul.lms.dto.ClassStudentDto> getStudentsByClassId(Long classId) {
        return studentProfileRepository.findByClassRoomId(classId).stream().map(student -> {
            com.titkul.lms.dto.ClassStudentDto dto = new com.titkul.lms.dto.ClassStudentDto();
            dto.setId(student.getUser().getId());
            dto.setCode(student.getStudentCode());
            dto.setName(student.getFullName());
            if (student.getParent() != null && student.getParent().getUser() != null) {
                dto.setParentName(student.getParent().getFullName());
                dto.setPhone(student.getParent().getUser().getPhone() != null ? student.getParent().getUser().getPhone() : "");
            } else {
                dto.setParentName("");
                dto.setPhone(student.getUser().getPhone() != null ? student.getUser().getPhone() : "");
            }
            dto.setDob(student.getDateOfBirth() != null ? student.getDateOfBirth().toString() : "");
            dto.setEvaluation("Chưa đánh giá");
            dto.setAttendance(100);
            dto.setBadges(student.getTotalXp());
            return dto;
        }).toList();
    }

    public ClassRoom createClass(com.titkul.lms.dto.ClassRoomDto dto) {
        com.titkul.lms.entity.AcademicYear academicYear = academicYearRepository.findById(dto.getAcademicYearId())
                .orElseThrow(() -> new RuntimeException("Niên khóa không tồn tại"));

        if (classRoomRepository.existsByNameAndAcademicYear(dto.getName(), academicYear)) {
            throw new RuntimeException("Lớp học đã tồn tại trong niên khóa này");
        }

        ClassRoom classRoom = new ClassRoom();
        classRoom.setName(dto.getName());
        classRoom.setGrade(dto.getGrade());
        classRoom.setAcademicYear(academicYear);
        classRoom.setMaxCapacity(dto.getMaxCapacity());
        classRoom.setStatus(com.titkul.lms.entity.ClassStatus.ACTIVE);

        if (dto.getHomeroomTeacherId() != null) {
            com.titkul.lms.entity.TeacherProfile teacher = teacherProfileRepository.findById(dto.getHomeroomTeacherId())
                    .orElseThrow(() -> new RuntimeException("Giáo viên không tồn tại"));
            classRoom.setHomeroomTeacher(teacher);
        }

        return classRoomRepository.save(classRoom);
    }

    public ClassRoom updateClass(Long id, com.titkul.lms.dto.ClassRoomDto dto) {
        ClassRoom classRoom = classRoomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lớp học không tồn tại"));

        com.titkul.lms.entity.AcademicYear academicYear = academicYearRepository.findById(dto.getAcademicYearId())
                .orElseThrow(() -> new RuntimeException("Niên khóa không tồn tại"));

        if (!classRoom.getName().equals(dto.getName()) || !classRoom.getAcademicYear().getId().equals(dto.getAcademicYearId())) {
            if (classRoomRepository.existsByNameAndAcademicYear(dto.getName(), academicYear)) {
                throw new RuntimeException("Tên lớp đã tồn tại trong niên khóa này");
            }
        }

        classRoom.setName(dto.getName());
        classRoom.setGrade(dto.getGrade());
        classRoom.setAcademicYear(academicYear);
        classRoom.setMaxCapacity(dto.getMaxCapacity());

        if (dto.getHomeroomTeacherId() != null) {
            com.titkul.lms.entity.TeacherProfile teacher = teacherProfileRepository.findById(dto.getHomeroomTeacherId())
                    .orElseThrow(() -> new RuntimeException("Giáo viên không tồn tại"));
            classRoom.setHomeroomTeacher(teacher);
        } else {
            classRoom.setHomeroomTeacher(null);
        }

        return classRoomRepository.save(classRoom);
    }

    public ClassRoom toggleStatus(Long id) {
        ClassRoom classRoom = classRoomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lớp học không tồn tại"));

        if (classRoom.getStatus() == com.titkul.lms.entity.ClassStatus.ACTIVE) {
            classRoom.setStatus(com.titkul.lms.entity.ClassStatus.DONG_BANG);
        } else {
            classRoom.setStatus(com.titkul.lms.entity.ClassStatus.ACTIVE);
        }
        return classRoomRepository.save(classRoom);
    }
}
