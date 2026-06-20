package com.titkul.lms.service;

import com.titkul.lms.dto.AdminDashboardDto;
import com.titkul.lms.repository.ClassRoomRepository;
import com.titkul.lms.repository.ParentProfileRepository;
import com.titkul.lms.repository.StudentProfileRepository;
import com.titkul.lms.repository.TeacherProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {

    private final StudentProfileRepository studentProfileRepository;
    private final TeacherProfileRepository teacherProfileRepository;
    private final ParentProfileRepository parentProfileRepository;
    private final ClassRoomRepository classRoomRepository;

    @Transactional(readOnly = true)
    public AdminDashboardDto getDashboardStats() {
        long totalStudents = studentProfileRepository.count();
        long totalTeachers = teacherProfileRepository.count();
        long totalParents = parentProfileRepository.count();
        long totalClasses = classRoomRepository.count();
        long activeClasses = classRoomRepository.countByStatus(com.titkul.lms.entity.ClassStatus.ACTIVE);

        List<String> warnings = new ArrayList<>();
        long studentsWithoutClass = studentProfileRepository.findAll().stream()
                .filter(s -> s.getClassRoom() == null).count();
        if (studentsWithoutClass > 0) {
            warnings.add(studentsWithoutClass + " Học sinh chưa được phân lớp. Vui lòng phân bổ học sinh mới import vào lớp học.");
        }
        
        long classesWithoutTeacher = classRoomRepository.findAll().stream()
                .filter(c -> c.getHomeroomTeacher() == null).count();
        if (classesWithoutTeacher > 0) {
            warnings.add(classesWithoutTeacher + " Lớp học chưa có Giáo viên chủ nhiệm.");
        }
        
        if (warnings.isEmpty()) {
            warnings.add("Hệ thống hoạt động ổn định, không có cảnh báo nào.");
        }

        List<Integer> mockTraffic = java.util.Arrays.asList(120, 200, 150, 300, 250, 400, 380);

        return AdminDashboardDto.builder()
                .totalStudents(totalStudents)
                .totalTeachers(totalTeachers)
                .totalParents(totalParents)
                .totalClasses(totalClasses)
                .activeClasses(activeClasses)
                .trafficData(mockTraffic)
                .systemWarnings(warnings)
                .build();
    }
}
