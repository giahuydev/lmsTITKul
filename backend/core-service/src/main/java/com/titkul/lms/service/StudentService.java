package com.titkul.lms.service;

import com.titkul.lms.dto.StudentDashboardDto;
import com.titkul.lms.entity.ClassRoom;
import com.titkul.lms.entity.Evaluation;
import com.titkul.lms.entity.StudentProfile;
import com.titkul.lms.entity.User;
import com.titkul.lms.repository.EvaluationRepository;
import com.titkul.lms.repository.StudentProfileRepository;
import com.titkul.lms.repository.UserRepository;
import com.titkul.lms.repository.AssignmentRepository;
import com.titkul.lms.repository.SubmissionRepository;
import com.titkul.lms.entity.Assignment;
import com.titkul.lms.entity.Submission;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
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

        List<Evaluation> recentEvaluations = evaluationRepository.findBySubmission_Student_IdOrderByEvaluatedAtDesc(
                profile.getId(),
                PageRequest.of(0, 5)
        );

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        List<StudentDashboardDto.EvaluationDto> evalDtos = recentEvaluations.stream().map(eval -> {
            return StudentDashboardDto.EvaluationDto.builder()
                    .assignmentTitle(eval.getSubmission().getAssignment().getTitle())
                    .score(eval.getScore() != null ? eval.getScore().toString() : null)
                    .grade(eval.getGrade() != null ? eval.getGrade().name() : null)
                    .comment(eval.getComment())
                    .evaluatedAt(eval.getEvaluatedAt().format(formatter))
                    .build();
        }).collect(Collectors.toList());

        // Fetch Notifications (Mock temporary for now or fetch from DB if available)
        // We will mock the subjects and tasks in backend temporarily to remove them from frontend
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
                .academicYear(classRoom != null ? classRoom.getAcademicYear() : "")
                .totalXp(profile.getTotalXp())
                .recentEvaluations(evalDtos)
                .subjects(subjects)
                .upcomingTasks(upcomingTasks)
                .recentNotifications(notifications)
                .build();
    }

    public List<com.titkul.lms.dto.AssignmentResponseDto> getAssignments(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        StudentProfile profile = studentProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ học sinh"));

        ClassRoom classRoom = profile.getClassRoom();
        if (classRoom == null) return List.of();

        org.springframework.data.domain.Page<Assignment> assignmentPage = assignmentRepository.findByClassRoomId(classRoom.getId(), org.springframework.data.domain.PageRequest.of(0, 100));
        List<Assignment> assignments = assignmentPage.getContent();
        
        List<Submission> submissions = submissionRepository.findByStudent_Id(profile.getId());
        java.util.Map<Long, Submission> submissionMap = submissions.stream()
                .collect(Collectors.toMap(sub -> sub.getAssignment().getId(), sub -> sub, (a, b) -> a));

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

        return assignments.stream().map(assignment -> {
            Submission sub = submissionMap.get(assignment.getId());
            String status = "CHUA_NOP";
            boolean isLate = false;
            
            if (sub != null) {
                status = "DA_NOP";
            } else if (assignment.getDeadline() != null && assignment.getDeadline().isBefore(java.time.LocalDateTime.now())) {
                isLate = true;
                status = "QUA_HAN";
            }

            String timeRemaining = "-";
            if (!isLate && assignment.getDeadline() != null && sub == null) {
                java.time.Duration duration = java.time.Duration.between(java.time.LocalDateTime.now(), assignment.getDeadline());
                if (duration.toDays() > 0) timeRemaining = duration.toDays() + " ngày";
                else if (duration.toHours() > 0) timeRemaining = duration.toHours() + " giờ";
                else timeRemaining = duration.toMinutes() + " phút";
            }

            return com.titkul.lms.dto.AssignmentResponseDto.builder()
                    .id(assignment.getId())
                    .title(assignment.getTitle())
                    .subject("Bài tập")
                    .type(assignment.getType().name())
                    .status(status)
                    .deadline(assignment.getDeadline() != null ? assignment.getDeadline().format(formatter) : "Không thời hạn")
                    .timeRemaining(timeRemaining)
                    .isLate(isLate)
                    .build();
        }).collect(Collectors.toList());
    }

    public List<java.util.Map<String, Object>> getNotifications(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        // Mock return for now
        return List.of(
            java.util.Map.of("id", 1, "title", "Nghỉ học ngày mai do bão", "content", "Các con ở nhà chú ý an toàn nhé, cô sẽ gửi bài tập H5P lên hệ thống.", "date", "18/06/2026 08:30", "read", false, "type", "NOI_BO", "pinned", true),
            java.util.Map.of("id", 2, "title", "Thưởng nóng 50 Kim cương!", "content", "Cô khen cả lớp hôm qua đã nộp bài đầy đủ và đúng hạn. Mỗi bạn được cộng 50 Kim cương nhé!", "date", "17/06/2026 15:00", "read", true, "type", "KHEN_THUONG", "pinned", false),
            java.util.Map.of("id", 3, "title", "Nhắc nhở làm bài tập Toán", "content", "Hiện tại vẫn còn 5 bạn chưa nộp bài tập Số Tự Nhiên, các con tranh thủ làm trước 9h tối nay.", "date", "16/06/2026 14:20", "read", true, "type", "NOI_BO", "pinned", false)
        );
    }

    public java.util.Map<String, Object> getRewards(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        return java.util.Map.of(
            "badges", List.of(
                java.util.Map.of("id", 1, "name", "Vua Toán Học", "desc", "Đạt điểm tuyệt đối 3 bài kiểm tra Toán", "icon", "https://img.icons8.com/color/96/crown.png", "date", "15/06/2026", "unlocked", true),
                java.util.Map.of("id", 2, "name", "Chăm Chỉ", "desc", "Hoàn thành bài tập 7 ngày liên tiếp", "icon", "https://img.icons8.com/color/96/star--v1.png", "date", "10/06/2026", "unlocked", true),
                java.util.Map.of("id", 3, "name", "Bút Vàng", "desc", "Hoàn thành bài tập Tiếng Việt xuất sắc", "icon", "https://img.icons8.com/color/96/pen.png", "date", "05/06/2026", "unlocked", true),
                java.util.Map.of("id", 4, "name", "Siêu Tốc Độ", "desc", "Hoàn thành bài tập sớm nhất lớp", "icon", "https://img.icons8.com/color/96/rocket.png", "date", "", "unlocked", false),
                java.util.Map.of("id", 5, "name", "Nhà Thám Hiểm", "desc", "Hoàn thành 50% chương trình Tự nhiên XH", "icon", "https://img.icons8.com/color/96/map-marker--v1.png", "date", "", "unlocked", false)
            ),
            "letters", List.of(
                java.util.Map.of("id", 1, "teacher", "Cô Lan", "subject", "Tiếng Việt", "content", "Cô rất tự hào về An, con đã có một bài viết miêu tả con vật rất sinh động và giàu cảm xúc. Cố gắng phát huy nhé!", "date", "12/06/2026"),
                java.util.Map.of("id", 2, "teacher", "Thầy Hùng", "subject", "Toán Học", "content", "Tuần qua An làm bài tập rất nhanh và chính xác. Tinh thần tự học của con rất đáng khen ngợi!", "date", "08/06/2026")
            )
        );
    }

    public List<java.util.Map<String, Object>> getSubjectTree(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        return List.of(
            java.util.Map.of(
                "id", 1,
                "title", "Chương 1: Số Tự Nhiên",
                "icon", "https://img.icons8.com/color/96/1-circle.png",
                "lessons", List.of(
                    java.util.Map.of("id", 101, "title", "Ôn tập các số đến 100,000", "type", "video", "status", "completed"),
                    java.util.Map.of("id", 102, "title", "Biểu thức có chứa một chữ", "type", "h5p", "status", "completed"),
                    java.util.Map.of("id", 103, "title", "Các số có sáu chữ số", "type", "document", "status", "current")
                )
            ),
            java.util.Map.of(
                "id", 2,
                "title", "Chương 2: Bốn Phép Tính",
                "icon", "https://img.icons8.com/color/96/math.png",
                "lessons", List.of(
                    java.util.Map.of("id", 201, "title", "Phép cộng", "type", "h5p", "status", "locked"),
                    java.util.Map.of("id", 202, "title", "Phép trừ", "type", "h5p", "status", "locked"),
                    java.util.Map.of("id", 203, "title", "Biểu thức có chứa hai chữ", "type", "video", "status", "locked")
                )
            )
        );
    }
}
