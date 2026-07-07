package com.titkul.lms.service;

import com.titkul.lms.dto.AssignmentResponseDto;
import com.titkul.lms.dto.StudentDashboardDto;
import com.titkul.lms.entity.*;
import com.titkul.lms.repository.*;
import com.titkul.lms.util.AssignmentStatusUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final EvaluationRepository evaluationRepository;
    private final AssignmentRepository assignmentRepository;
    private final SubmissionRepository submissionRepository;

    public StudentDashboardDto getDashboard(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        StudentProfile profile = studentProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ học sinh"));

        ClassRoom classRoom = profile.getClassRoom();

        List<Evaluation> recentEvaluations = evaluationRepository
                .findBySubmission_Student_IdOrderByEvaluatedAtDesc(profile.getId(), PageRequest.of(0, 5));

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        List<StudentDashboardDto.EvaluationDto> evalDtos = recentEvaluations.stream()
                .map(eval -> StudentDashboardDto.EvaluationDto.builder()
                        .assignmentTitle(eval.getSubmission().getAssignment().getTitle())
                        .score(eval.getScore() != null ? eval.getScore().toString() : null)
                        .grade(eval.getGrade() != null ? eval.getGrade().name() : null)
                        .comment(eval.getComment())
                        .evaluatedAt(eval.getEvaluatedAt().format(formatter))
                        .build())
                .collect(Collectors.toList());

        List<StudentDashboardDto.SubjectProgressDto> subjects = List.of(
            StudentDashboardDto.SubjectProgressDto.builder().id("math").name("Toán Học").desc("Khám phá thế giới của những con số").icon("https://img.icons8.com/color/96/calculator--v1.png").color("bg-white border-slate-200 text-blue-700").btnColor("bg-blue-50 text-blue-600 hover:bg-blue-100").trackColor("bg-slate-100").barColor("bg-blue-500").progress(60).build(),
            StudentDashboardDto.SubjectProgressDto.builder().id("viet").name("Tiếng Việt").desc("Luyện đọc và viết chữ thật hay").icon("https://img.icons8.com/color/96/books.png").color("bg-white border-slate-200 text-orange-700").btnColor("bg-orange-50 text-orange-600 hover:bg-orange-100").trackColor("bg-slate-100").barColor("bg-orange-500").progress(85).build()
        );

        List<StudentDashboardDto.UpcomingTaskDto> upcomingTasks = List.of(
            StudentDashboardDto.UpcomingTaskDto.builder().id(1L).title("Luyện tập phép cộng trừ").subject("Toán Học").time("3 giờ nữa").build()
        );

        List<StudentDashboardDto.NotificationDto> notifications = List.of(
            StudentDashboardDto.NotificationDto.builder().id(1L).title("Chào mừng đến Titkul LMS").isNew(true).content("Hãy bắt đầu học nhé").date("Hôm nay").type("HE_THONG").pinned(true).build()
        );

        return StudentDashboardDto.builder()
                .fullName(profile.getFullName())
                .className(classRoom != null ? classRoom.getName() : "Chưa có lớp")
                .academicYear(classRoom != null && classRoom.getAcademicYear() != null ? classRoom.getAcademicYear().getName() : "")
                .totalXp(profile.getTotalXp())
                .recentEvaluations(evalDtos)
                .subjects(subjects)
                .upcomingTasks(upcomingTasks)
                .recentNotifications(notifications)
                .build();
    }

    public List<AssignmentResponseDto> getAssignments(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        StudentProfile profile = studentProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ học sinh"));

        ClassRoom classRoom = profile.getClassRoom();
        if (classRoom == null) return List.of();

        List<Assignment> assignments = assignmentRepository
                .findByClassRoomId(classRoom.getId(), PageRequest.of(0, 100))
                .getContent();

        Map<Long, Submission> submissionMap = submissionRepository.findByStudent_Id(profile.getId())
                .stream()
                .collect(Collectors.toMap(s -> s.getAssignment().getId(), s -> s, (a, b) -> a));

        return assignments.stream()
                .map(a -> AssignmentStatusUtils.toDto(a, submissionMap.get(a.getId())))
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getNotifications(String username) {
        userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        return List.of(
            Map.of("id", 1, "title", "Nghỉ học ngày mai do bão", "content", "Các con ở nhà chú ý an toàn nhé.", "date", "18/06/2026 08:30", "read", false, "type", "NOI_BO", "pinned", true),
            Map.of("id", 2, "title", "Thưởng nóng 50 Kim cương!", "content", "Cô khen cả lớp hôm qua đã nộp bài đầy đủ và đúng hạn.", "date", "17/06/2026 15:00", "read", true, "type", "KHEN_THUONG", "pinned", false),
            Map.of("id", 3, "title", "Nhắc nhở làm bài tập Toán", "content", "Hiện tại vẫn còn 5 bạn chưa nộp bài tập Số Tự Nhiên.", "date", "16/06/2026 14:20", "read", true, "type", "NOI_BO", "pinned", false)
        );
    }

    public Map<String, Object> getRewards(String username) {
        userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        return Map.of(
            "badges", List.of(
                Map.of("id", 1, "name", "Vua Toán Học", "desc", "Đạt điểm tuyệt đối 3 bài kiểm tra Toán", "icon", "https://img.icons8.com/color/96/crown.png", "date", "15/06/2026", "unlocked", true),
                Map.of("id", 2, "name", "Chăm Chỉ", "desc", "Hoàn thành bài tập 7 ngày liên tiếp", "icon", "https://img.icons8.com/color/96/star--v1.png", "date", "10/06/2026", "unlocked", true),
                Map.of("id", 3, "name", "Bút Vàng", "desc", "Hoàn thành bài tập Tiếng Việt xuất sắc", "icon", "https://img.icons8.com/color/96/pen.png", "date", "05/06/2026", "unlocked", true),
                Map.of("id", 4, "name", "Siêu Tốc Độ", "desc", "Hoàn thành bài tập sớm nhất lớp", "icon", "https://img.icons8.com/color/96/rocket.png", "date", "", "unlocked", false),
                Map.of("id", 5, "name", "Nhà Thám Hiểm", "desc", "Hoàn thành 50% chương trình Tự nhiên XH", "icon", "https://img.icons8.com/color/96/map-marker--v1.png", "date", "", "unlocked", false)
            ),
            "letters", List.of(
                Map.of("id", 1, "teacher", "Cô Lan", "subject", "Tiếng Việt", "content", "Cô rất tự hào về An, con đã có một bài viết miêu tả con vật rất sinh động.", "date", "12/06/2026"),
                Map.of("id", 2, "teacher", "Thầy Hùng", "subject", "Toán Học", "content", "Tuần qua An làm bài tập rất nhanh và chính xác.", "date", "08/06/2026")
            )
        );
    }

    public List<Map<String, Object>> getSubjectTree(String username) {
        userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        return List.of(
            Map.of("id", 1, "title", "Chương 1: Số Tự Nhiên",
                "icon", "https://img.icons8.com/color/96/1-circle.png",
                "lessons", List.of(
                    Map.of("id", 101, "title", "Ôn tập các số đến 100,000", "type", "video", "status", "completed"),
                    Map.of("id", 102, "title", "Biểu thức có chứa một chữ", "type", "h5p", "status", "completed"),
                    Map.of("id", 103, "title", "Các số có sáu chữ số", "type", "document", "status", "current")
                )),
            Map.of("id", 2, "title", "Chương 2: Bốn Phép Tính",
                "icon", "https://img.icons8.com/color/96/math.png",
                "lessons", List.of(
                    Map.of("id", 201, "title", "Phép cộng", "type", "h5p", "status", "locked"),
                    Map.of("id", 202, "title", "Phép trừ", "type", "h5p", "status", "locked"),
                    Map.of("id", 203, "title", "Biểu thức có chứa hai chữ", "type", "video", "status", "locked")
                ))
        );
    }
}
