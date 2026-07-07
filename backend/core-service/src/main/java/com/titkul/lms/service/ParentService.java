package com.titkul.lms.service;

import com.titkul.lms.dto.AssignmentResponseDto;
import com.titkul.lms.dto.ParentDashboardDto;
import com.titkul.lms.entity.*;
import com.titkul.lms.repository.*;
import com.titkul.lms.util.AssignmentStatusUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ParentService {

    private final UserRepository userRepository;
    private final ParentProfileRepository parentProfileRepository;
    private final EvaluationRepository evaluationRepository;
    private final AssignmentRepository assignmentRepository;
    private final NotificationRepository notificationRepository;
    private final SubmissionRepository submissionRepository;

    @Transactional(readOnly = true)
    public ParentDashboardDto getDashboard(String username) {
        User user = resolveUser(username);
        ParentProfile profile = resolveProfile(user);

        List<StudentProfile> children = profile.getChildren() != null ? profile.getChildren() : Collections.emptyList();

        List<ParentDashboardDto.ChildDto> childDtos = children.stream()
                .map(c -> ParentDashboardDto.ChildDto.builder()
                        .id(c.getId())
                        .studentName(c.getFullName())
                        .className(c.getClassRoom() != null ? c.getClassRoom().getName() : "Chưa có lớp")
                        .build())
                .collect(Collectors.toList());

        List<Long> childIds = children.stream().map(StudentProfile::getId).collect(Collectors.toList());

        List<ParentDashboardDto.ActivityDto> activities = buildActivities(childIds);
        List<ParentDashboardDto.AlertDto> alerts = buildAlerts(children);
        List<ParentDashboardDto.AnnouncementDto> announcements = buildAnnouncements(user);

        return ParentDashboardDto.builder()
                .fullName(profile.getFullName())
                .childrenCount(children.size())
                .children(childDtos)
                .recentActivities(activities)
                .alerts(alerts)
                .announcements(announcements)
                .build();
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getChildren(String username) {
        ParentProfile profile = resolveProfile(resolveUser(username));
        if (profile.getChildren() == null) return Collections.emptyList();

        return profile.getChildren().stream().map(child -> {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("id", child.getId());
            map.put("name", child.getFullName());
            map.put("grade", child.getClassRoom() != null ? child.getClassRoom().getName() : "Chưa có lớp");
            map.put("school", "Tiểu học Titkul Kids");
            map.put("username", child.getStudentCode());
            map.put("className", child.getClassRoom() != null ? child.getClassRoom().getName() : "Chưa phân lớp");
            map.put("totalXp", child.getTotalXp());
            return map;
        }).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getGrades(String username) {
        ParentProfile profile = resolveProfile(resolveUser(username));
        List<Long> childIds = profile.getChildren() != null
                ? profile.getChildren().stream().map(StudentProfile::getId).collect(Collectors.toList())
                : Collections.emptyList();

        if (childIds.isEmpty()) return Collections.emptyList();

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        return evaluationRepository.findBySubmission_Student_IdInOrderByEvaluatedAtDesc(childIds)
                .stream()
                .map(eval -> {
                    Map<String, Object> map = new LinkedHashMap<>();
                    map.put("id", eval.getId());
                    map.put("subject", "Môn học");
                    map.put("assignment", eval.getSubmission().getAssignment().getTitle());
                    map.put("score", eval.getGrade() != null ? eval.getGrade().name() : (eval.getScore() != null ? eval.getScore().toString() : "Đã chấm"));
                    map.put("type", eval.getSubmission().getAssignment().getType().name());
                    map.put("date", eval.getEvaluatedAt() != null ? eval.getEvaluatedAt().format(fmt) : "");
                    map.put("studentName", eval.getSubmission().getStudent().getFullName());
                    return map;
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AssignmentResponseDto> getAssignments(String username, Long childId) {
        ParentProfile profile = resolveProfile(resolveUser(username));

        StudentProfile child = profile.getChildren().stream()
                .filter(c -> c.getId().equals(childId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Học sinh không thuộc phụ huynh này"));

        ClassRoom classRoom = child.getClassRoom();
        if (classRoom == null) return Collections.emptyList();

        List<Assignment> assignments = assignmentRepository
                .findByClassRoomId(classRoom.getId(), PageRequest.of(0, 100))
                .getContent();

        Map<Long, Submission> submissionMap = submissionRepository.findByStudent_Id(child.getId())
                .stream()
                .collect(Collectors.toMap(s -> s.getAssignment().getId(), s -> s, (a, b) -> a));

        return assignments.stream()
                .map(a -> AssignmentStatusUtils.toDto(a, submissionMap.get(a.getId())))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getNotifications(String username) {
        User user = resolveUser(username);
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

        return notificationRepository.findByRecipientIdOrderByDateDesc(user.getId())
                .stream()
                .map(n -> {
                    Map<String, Object> map = new LinkedHashMap<>();
                    map.put("id", n.getId());
                    map.put("title", n.getTitle());
                    map.put("content", n.getContent());
                    map.put("date", n.getDate().format(fmt));
                    map.put("read", n.isRead());
                    map.put("type", n.getType().name());
                    map.put("pinned", n.isPinned());
                    return map;
                })
                .collect(Collectors.toList());
    }

    public Map<String, Object> getRewards(String username, Long childId) {
        resolveUser(username);
        return Map.of(
            "badges", List.of(
                Map.of("id", 1, "name", "Vua Toán Học", "desc", "Đạt điểm tuyệt đối 3 bài kiểm tra Toán", "icon", "https://img.icons8.com/color/96/crown.png", "date", "15/06/2026", "unlocked", true),
                Map.of("id", 2, "name", "Chăm Chỉ", "desc", "Hoàn thành bài tập 7 ngày liên tiếp", "icon", "https://img.icons8.com/color/96/star--v1.png", "date", "10/06/2026", "unlocked", true)
            ),
            "letters", List.of(
                Map.of("id", 1, "teacher", "Cô Lan", "subject", "Tiếng Việt", "content", "Cô khen bé đã cố gắng rất nhiều trong môn học này.", "date", "12/06/2026")
            )
        );
    }

    public List<Map<String, Object>> getSubjectTree(String username, Long childId) {
        resolveUser(username);
        return List.of(
            Map.of("id", 1, "title", "Chương 1: Khám phá",
                "icon", "https://img.icons8.com/color/96/1-circle.png",
                "lessons", List.of(
                    Map.of("id", 101, "title", "Bài học số 1", "type", "video", "status", "completed"),
                    Map.of("id", 102, "title", "Bài tập thực hành", "type", "h5p", "status", "completed")
                ))
        );
    }

    // ── Private helpers ───────────────────────────────────────────────────────────

    private User resolveUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
    }

    private ParentProfile resolveProfile(User user) {
        return parentProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ phụ huynh"));
    }

    private List<ParentDashboardDto.ActivityDto> buildActivities(List<Long> childIds) {
        if (childIds.isEmpty()) return Collections.emptyList();
        return evaluationRepository.findBySubmission_Student_IdInOrderByEvaluatedAtDesc(childIds, PageRequest.of(0, 5))
                .stream()
                .map(eval -> ParentDashboardDto.ActivityDto.builder()
                        .title("Bài tập - " + eval.getSubmission().getAssignment().getTitle())
                        .type(eval.getSubmission().getAssignment().getType() == AssignmentType.H5P ? "Bài tập H5P" : "Bài tự luận")
                        .badge(eval.getGrade() != null ? eval.getGrade().name() : "Đã chấm điểm")
                        .build())
                .collect(Collectors.toList());
    }

    private List<ParentDashboardDto.AlertDto> buildAlerts(List<StudentProfile> children) {
        List<Long> classRoomIds = children.stream()
                .filter(c -> c.getClassRoom() != null)
                .map(c -> c.getClassRoom().getId())
                .distinct()
                .collect(Collectors.toList());

        if (classRoomIds.isEmpty()) return Collections.emptyList();

        return assignmentRepository.findByClassRoom_IdInOrderByDeadlineAsc(classRoomIds)
                .stream()
                .filter(a -> a.getDeadline() != null && a.getDeadline().isAfter(LocalDateTime.now()))
                .limit(3)
                .map(a -> ParentDashboardDto.AlertDto.builder()
                        .title("Sắp đến hạn nộp bài!")
                        .description("Bài tập \"" + a.getTitle() + "\" sẽ hết hạn vào "
                                + a.getDeadline().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")) + ".")
                        .build())
                .collect(Collectors.toList());
    }

    private List<ParentDashboardDto.AnnouncementDto> buildAnnouncements(User user) {
        return notificationRepository.findByRecipientIdOrderByDateDesc(user.getId())
                .stream()
                .limit(3)
                .map(n -> ParentDashboardDto.AnnouncementDto.builder()
                        .title(n.getTitle())
                        .content(n.getContent())
                        .date(n.getDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")))
                        .tag(n.isPinned() ? "Ghim" : "Thông báo")
                        .build())
                .collect(Collectors.toList());
    }
}
