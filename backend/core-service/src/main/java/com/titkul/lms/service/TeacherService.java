package com.titkul.lms.service;

import com.titkul.lms.dto.AnnouncementCreateDTO;
import com.titkul.lms.dto.AwardBadgeDTO;
import com.titkul.lms.dto.TeacherDashboardDto;
import com.titkul.lms.entity.Assignment;
import com.titkul.lms.entity.Badge;
import com.titkul.lms.entity.ClassRoom;
import com.titkul.lms.entity.Evaluation;
import com.titkul.lms.entity.EvaluationGrade;
import com.titkul.lms.entity.Notification;
import com.titkul.lms.entity.NotificationAudience;
import com.titkul.lms.entity.NotificationType;
import com.titkul.lms.entity.StudentProfile;
import com.titkul.lms.entity.StudentReward;
import com.titkul.lms.entity.Subject;
import com.titkul.lms.entity.TeacherProfile;
import com.titkul.lms.entity.User;
import com.titkul.lms.repository.AssignmentRepository;
import com.titkul.lms.repository.BadgeRepository;
import com.titkul.lms.repository.ClassRoomRepository;
import com.titkul.lms.repository.EvaluationRepository;
import com.titkul.lms.repository.NotificationRepository;
import com.titkul.lms.repository.StudentRewardRepository;
import com.titkul.lms.repository.SubjectRepository;
import com.titkul.lms.repository.TeacherProfileRepository;
import com.titkul.lms.repository.UserRepository;
import com.titkul.lms.repository.StudentProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeacherService {

    private final UserRepository userRepository;
    private final TeacherProfileRepository teacherProfileRepository;
    private final ClassRoomRepository classRoomRepository;
    private final AssignmentRepository assignmentRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final EvaluationRepository evaluationRepository;
    private final SubjectRepository subjectRepository;
    private final NotificationRepository notificationRepository;
    private final BadgeRepository badgeRepository;
    private final StudentRewardRepository studentRewardRepository;
    private final EmailService emailService;

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

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
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
            map.put("grade", c.getGrade());
            map.put("academicYear", c.getAcademicYear() != null ? c.getAcademicYear().getName() : null);
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

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public Map<String, Object> getReports(String username, Long classId, Integer semesterId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
        TeacherProfile profile = teacherProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ giáo viên"));

        Long targetClassId = classId;
        if (targetClassId == null) {
            List<ClassRoom> homeroomClasses = classRoomRepository.findByHomeroomTeacher_Id(profile.getId());
            if (homeroomClasses.isEmpty()) {
                return Map.of("students", List.of());
            }
            targetClassId = homeroomClasses.get(0).getId();
        }

        List<StudentProfile> students = studentProfileRepository.findByClassRoomId(targetClassId);
        if (students.isEmpty()) {
            return Map.of("students", List.of());
        }
        List<Long> studentIds = students.stream().map(StudentProfile::getId).collect(java.util.stream.Collectors.toList());

        List<Evaluation> evaluations = evaluationRepository.findBySubmission_Student_IdInOrderByEvaluatedAtDesc(studentIds);
        Subject mathSubject = subjectRepository.findByName("Toán").orElse(null);
        Subject vietSubject = subjectRepository.findByName("Tiếng Việt").orElse(null);

        List<Map<String, Object>> result = students.stream().map(s -> {
            EvaluationGrade mathGrade = latestGradeForSubject(evaluations, s.getId(), mathSubject, semesterId);
            EvaluationGrade vietGrade = latestGradeForSubject(evaluations, s.getId(), vietSubject, semesterId);
            EvaluationGrade overall = worstGrade(mathGrade, vietGrade);

            Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", s.getId());
            map.put("name", s.getFullName());
            map.put("math", gradeLabel(mathGrade));
            map.put("viet", gradeLabel(vietGrade));
            map.put("avg", gradeLabel(overall));
            map.put("isExcellent", overall == EvaluationGrade.HOAN_THANH_TOT);
            return map;
        }).collect(java.util.stream.Collectors.toList());

        return Map.of("students", result);
    }

    // Ưu tiên hocLieu.subject (Kho Học Liệu GV tự soạn), fallback contentNode.subject (cây SGK).
    private Subject resolveAssignmentSubject(Assignment assignment) {
        if (assignment.getHocLieu() != null && assignment.getHocLieu().getSubject() != null) {
            return assignment.getHocLieu().getSubject();
        }
        return assignment.getContentNode() != null ? assignment.getContentNode().getSubject() : null;
    }

    private EvaluationGrade latestGradeForSubject(List<Evaluation> evaluations, Long studentId, Subject subject, Integer semesterId) {
        if (subject == null) return null;
        return evaluations.stream()
                .filter(e -> e.getSubmission().getStudent().getId().equals(studentId))
                .filter(e -> {
                    Assignment a = e.getSubmission().getAssignment();
                    Subject assignmentSubject = resolveAssignmentSubject(a);
                    if (assignmentSubject == null || !assignmentSubject.getId().equals(subject.getId())) return false;
                    if (semesterId != null) {
                        return a.getSemester() != null && semesterId.equals(a.getSemester().getId());
                    }
                    return true;
                })
                .map(Evaluation::getGrade)
                .filter(java.util.Objects::nonNull)
                .findFirst() // list đã sắp evaluatedAt desc nên phần tử đầu là mới nhất
                .orElse(null);
    }

    private EvaluationGrade worstGrade(EvaluationGrade... grades) {
        EvaluationGrade worst = null;
        for (EvaluationGrade g : grades) {
            if (g == null) continue;
            if (worst == null || rank(g) < rank(worst)) worst = g;
        }
        return worst;
    }

    private int rank(EvaluationGrade g) {
        return switch (g) {
            case CHUA_HOAN_THANH -> 0;
            case HOAN_THANH -> 1;
            case HOAN_THANH_TOT -> 2;
        };
    }

    private String gradeLabel(EvaluationGrade g) {
        if (g == null) return "Chưa có";
        return switch (g) {
            case HOAN_THANH_TOT -> "Tốt";
            case HOAN_THANH -> "Đạt";
            case CHUA_HOAN_THANH -> "Chưa đạt";
        };
    }

    public List<TeacherProfile> getAllTeachers() {
        return teacherProfileRepository.findAll();
    }

    @Transactional
    public Notification createAnnouncement(String username, AnnouncementCreateDTO dto) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
        TeacherProfile profile = teacherProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ giáo viên"));

        ClassRoom classRoom;
        if (dto.getClassId() != null) {
            classRoom = classRoomRepository.findById(dto.getClassId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp học"));
        } else {
            List<ClassRoom> homeroomClasses = classRoomRepository.findByHomeroomTeacher_Id(profile.getId());
            if (homeroomClasses.isEmpty()) {
                throw new RuntimeException("Bạn chưa là giáo viên chủ nhiệm của lớp nào để đăng thông báo.");
            }
            classRoom = homeroomClasses.get(0);
        }

        if (dto.getTitle() == null || dto.getTitle().isBlank()) {
            throw new IllegalArgumentException("Tiêu đề thông báo không được để trống.");
        }

        Notification notification = new Notification();
        notification.setSender(user);
        notification.setClassRoom(classRoom);
        notification.setTitle(dto.getTitle());
        notification.setContent(dto.getContent());
        notification.setType(NotificationType.NOI_BO);
        notification.setPinned(Boolean.TRUE.equals(dto.getPinned()));
        notification.setAudience(dto.getAudience() != null
                ? NotificationAudience.valueOf(dto.getAudience())
                : NotificationAudience.TAT_CA);

        return notificationRepository.save(notification);
    }

    public List<Map<String, Object>> getMyAnnouncements(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        return notificationRepository.findBySender_IdOrderByPostedAtDesc(user.getId()).stream()
                .map(n -> {
                    Map<String, Object> map = new LinkedHashMap<>();
                    map.put("id", n.getId());
                    map.put("title", n.getTitle());
                    map.put("content", n.getContent());
                    map.put("date", n.getPostedAt().format(fmt));
                    map.put("pinned", n.isPinned());
                    map.put("audience", n.getAudience().name());
                    return map;
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public StudentReward awardBadge(String username, Long studentId, AwardBadgeDTO dto) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
        TeacherProfile teacher = teacherProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ giáo viên"));
        StudentProfile student = studentProfileRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy học sinh"));
        if (dto.getBadgeId() == null) {
            throw new IllegalArgumentException("Vui lòng chọn huy hiệu để trao.");
        }
        Badge badge = badgeRepository.findById(dto.getBadgeId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy huy hiệu"));

        boolean emailSent = false;
        if (student.getParent() != null && student.getParent().getNotificationEmail() != null
                && !student.getParent().getNotificationEmail().isBlank()) {
            try {
                String body = "Con " + student.getFullName() + " vừa được trao huy hiệu \"" + badge.getName() + "\"!\n\n"
                        + (dto.getComplimentLetter() != null && !dto.getComplimentLetter().isBlank()
                                ? "Lời nhắn từ giáo viên: " + dto.getComplimentLetter()
                                : badge.getDescription() != null ? badge.getDescription() : "");
                emailService.sendSimpleEmail(student.getParent().getNotificationEmail(),
                        "Titkul LMS - Con bạn vừa nhận được huy hiệu mới!", body);
                emailSent = true;
            } catch (Exception e) {
                // Không chặn việc trao thưởng nếu gửi email thất bại (VD: SMTP tạm lỗi)
            }
        }

        StudentReward reward = StudentReward.builder()
                .student(student)
                .badge(badge)
                .teacher(teacher)
                .complimentLetter(dto.getComplimentLetter())
                .source(StudentReward.Source.THU_CONG)
                .emailSent(emailSent)
                .build();
        return studentRewardRepository.save(reward);
    }
}
