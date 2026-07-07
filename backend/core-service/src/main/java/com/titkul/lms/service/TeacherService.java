package com.titkul.lms.service;

import com.titkul.lms.dto.TeacherDashboardDto;
import com.titkul.lms.entity.ClassRoom;
import com.titkul.lms.entity.TeacherProfile;
import com.titkul.lms.entity.User;
import com.titkul.lms.repository.AssignmentRepository;
import com.titkul.lms.repository.ClassRoomRepository;
import com.titkul.lms.repository.TeacherProfileRepository;
import com.titkul.lms.repository.UserRepository;
import com.titkul.lms.repository.StudentProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TeacherService {

    private final UserRepository userRepository;
    private final TeacherProfileRepository teacherProfileRepository;
    private final ClassRoomRepository classRoomRepository;
    private final AssignmentRepository assignmentRepository;
    private final StudentProfileRepository studentProfileRepository;

    public TeacherDashboardDto getDashboard(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        TeacherProfile profile = teacherProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ giáo viên"));

        List<ClassRoom> homeroomClasses = classRoomRepository.findByHomeroomTeacher_Id(profile.getId());
        String homeroomClassStr = homeroomClasses.isEmpty() ? "Không có" : homeroomClasses.get(0).getName();
        long totalAssignments = assignmentRepository.countByTeacher_Id(profile.getId());

        return TeacherDashboardDto.builder()
                .fullName(profile.getFullName())
                .classesCount(1)
                .homeroomClass(homeroomClassStr)
                .department(profile.getDepartment())
                .totalAssignments(totalAssignments)
                .build();
    }

    public List<java.util.Map<String, Object>> getClasses(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        TeacherProfile profile = teacherProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ giáo viên"));

        List<ClassRoom> homeroomClasses = classRoomRepository.findByHomeroomTeacher_Id(profile.getId());
        
        return homeroomClasses.stream().map(c -> {
            java.util.Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", c.getId());
            map.put("name", c.getName());
            map.put("role", "GV Chủ Nhiệm");
            map.put("students", studentProfileRepository.countByClassRoomId(c.getId()));
            return map;
        }).collect(java.util.stream.Collectors.toList());
    }

    public java.util.Map<String, Object> getClassDetails(String username, Long classId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        return java.util.Map.of(
            "classInfo", java.util.Map.of("id", classId, "name", "Lớp 5A", "role", "GV Chủ Nhiệm", "students", 35),
            "students", List.of(
                java.util.Map.of("id", 1, "code", "HS001", "name", "Nguyễn Văn An", "dob", "15/03/2015", "parentName", "Nguyễn Văn Bình", "phone", "0901234567", "evaluation", "Hoàn thành Tốt", "attendance", 100, "badges", 5),
                java.util.Map.of("id", 2, "code", "HS002", "name", "Trần Thị Bình", "dob", "22/07/2015", "parentName", "Trần Văn Cường", "phone", "0912345678", "evaluation", "Hoàn thành", "attendance", 95, "badges", 2),
                java.util.Map.of("id", 3, "code", "HS003", "name", "Lê Hoàng Cường", "dob", "10/01/2015", "parentName", "Lê Văn Dũng", "phone", "0987654321", "evaluation", "Chưa hoàn thành", "attendance", 85, "badges", 0),
                java.util.Map.of("id", 4, "code", "HS004", "name", "Phạm Thị Dung", "dob", "05/11/2015", "parentName", "Phạm Văn Em", "phone", "0909876543", "evaluation", "Hoàn thành Tốt", "attendance", 98, "badges", 4),
                java.util.Map.of("id", 5, "code", "HS005", "name", "Hoàng Văn Em", "dob", "30/08/2015", "parentName", "Hoàng Văn Phát", "phone", "0933456789", "evaluation", "Hoàn thành", "attendance", 90, "badges", 1)
            )
        );
    }

    public java.util.Map<String, Object> getReports(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        return java.util.Map.of(
            "students", List.of(
                java.util.Map.of("id", 1, "name", "Nguyễn Văn An", "math", "Tốt", "viet", "Tốt", "avg", "Tốt", "isExcellent", true),
                java.util.Map.of("id", 2, "name", "Trần Thị Bình", "math", "Đạt", "viet", "Tốt", "avg", "Đạt", "isExcellent", false)
            ),
            "submissions", List.of(
                java.util.Map.of("id", 1, "student", "Nguyễn Văn An", "task", "Viết đoạn văn tả con vật", "type", "Tu_Luan", "date", "10/06 14:30", "status", "DA_NOP", "late", false),
                java.util.Map.of("id", 2, "student", "Trần Thị Bình", "task", "Bài tập trắc nghiệm H5P", "type", "H5P", "date", "10/06 15:45", "status", "DA_CHAM", "late", false, "score", "Hoàn thành tốt")
            )
        );
    }

    public List<TeacherProfile> getAllTeachers() {
        return teacherProfileRepository.findAll();
    }
}
