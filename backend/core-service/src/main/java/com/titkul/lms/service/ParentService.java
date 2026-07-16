package com.titkul.lms.service;

import com.titkul.lms.dto.AssignmentResponseDto;
import com.titkul.lms.dto.ParentDashboardDto;
import com.titkul.lms.entity.*;
import com.titkul.lms.repository.*;
import com.titkul.lms.util.AssignmentStatusUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ParentService {

    private static final List<NotificationAudience> PARENT_AUDIENCE =
            List.of(NotificationAudience.TAT_CA, NotificationAudience.PHU_HUYNH);

    private final UserRepository userRepository;
    private final ParentProfileRepository parentProfileRepository;
    private final EvaluationRepository evaluationRepository;
    private final AssignmentRepository assignmentRepository;
    private final NotificationRepository notificationRepository;
    private final NotificationReadStatusRepository notificationReadStatusRepository;
    private final SubmissionRepository submissionRepository;
    private final PasswordEncoder passwordEncoder;
    private final StudentService studentService;

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
        List<ParentDashboardDto.AnnouncementDto> announcements = buildAnnouncements(profile);

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
                    com.titkul.lms.entity.Assignment assignment = eval.getSubmission().getAssignment();
                    String subjectName = "Chưa phân loại";
                    if (assignment.getHocLieu() != null && assignment.getHocLieu().getSubject() != null) {
                        subjectName = assignment.getHocLieu().getSubject().getName();
                    } else if (assignment.getContentNode() != null && assignment.getContentNode().getSubject() != null) {
                        subjectName = assignment.getContentNode().getSubject().getName();
                    }

                    Map<String, Object> map = new LinkedHashMap<>();
                    map.put("id", eval.getId());
                    map.put("subject", subjectName);
                    map.put("assignment", assignment.getTitle());
                    map.put("score", eval.getGrade() != null ? eval.getGrade().name() : (eval.getScore() != null ? eval.getScore().toString() : "Đã chấm"));
                    map.put("type", assignment.getType().name());
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
        ParentProfile profile = resolveProfile(user);
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

        return resolveVisibleNotifications(profile).stream()
                .map(n -> {
                    boolean read = notificationReadStatusRepository
                            .findByUser_IdAndNotification_Id(user.getId(), n.getId())
                            .map(NotificationReadStatus::isRead)
                            .orElse(false);
                    Map<String, Object> map = new LinkedHashMap<>();
                    map.put("id", n.getId());
                    map.put("title", n.getTitle());
                    map.put("content", n.getContent());
                    map.put("date", n.getPostedAt().format(fmt));
                    map.put("read", read);
                    map.put("type", n.getType().name());
                    map.put("pinned", n.isPinned());
                    return map;
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public void markNotificationRead(String username, Long notificationId) {
        User user = resolveUser(username);
        markNotificationReadForUser(user, notificationId);
    }

    @Transactional
    public void markAllNotificationsRead(String username) {
        User user = resolveUser(username);
        ParentProfile profile = resolveProfile(user);
        resolveVisibleNotifications(profile).forEach(n -> markNotificationReadForUser(user, n.getId()));
    }

    private void markNotificationReadForUser(User user, Long notificationId) {
        NotificationReadStatus status = notificationReadStatusRepository
                .findByUser_IdAndNotification_Id(user.getId(), notificationId)
                .orElseGet(NotificationReadStatus::new);
        if (status.getId() == null) {
            status.setUser(user);
            status.setNotification(notificationRepository.getReferenceById(notificationId));
        }
        status.setRead(true);
        status.setReadAt(LocalDateTime.now());
        notificationReadStatusRepository.save(status);
    }

    // Thông báo hiển thị cho phụ huynh: theo lớp của TẤT CẢ các con + thông báo hệ thống toàn trường.
    private List<Notification> resolveVisibleNotifications(ParentProfile profile) {
        List<Long> classIds = profile.getChildren() == null ? List.of() : profile.getChildren().stream()
                .filter(c -> c.getClassRoom() != null)
                .map(c -> c.getClassRoom().getId())
                .distinct()
                .collect(Collectors.toList());

        Map<Long, Notification> byId = new LinkedHashMap<>();
        for (Notification n : notificationRepository.findGlobalOnly(PARENT_AUDIENCE)) {
            byId.putIfAbsent(n.getId(), n);
        }
        for (Long classId : classIds) {
            for (Notification n : notificationRepository.findVisibleToClass(classId, PARENT_AUDIENCE)) {
                byId.putIfAbsent(n.getId(), n);
            }
        }
        return byId.values().stream()
                .sorted(Comparator.comparing(Notification::getPostedAt).reversed())
                .collect(Collectors.toList());
    }

    public Map<String, Object> getRewards(String username, Long childId) {
        ParentProfile profile = resolveProfile(resolveUser(username));
        StudentProfile child = profile.getChildren().stream()
                .filter(c -> c.getId().equals(childId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Học sinh không thuộc phụ huynh này"));
        return studentService.buildRewardsPayload(child);
    }

    // QT01.3 - Luồng 2, Ưu tiên 1: PH tự cấp lại mật khẩu cho con
    @Transactional
    public void resetChildPassword(String username, Long childId, String newPassword) {
        ParentProfile profile = resolveProfile(resolveUser(username));

        StudentProfile child = profile.getChildren().stream()
                .filter(c -> c.getId().equals(childId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Học sinh không thuộc phụ huynh này"));

        User childUser = child.getUser();
        childUser.setPasswordHash(passwordEncoder.encode(newPassword));
        childUser.setRequirePasswordChange(true);
        userRepository.save(childUser);
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

    private List<ParentDashboardDto.AnnouncementDto> buildAnnouncements(ParentProfile profile) {
        return resolveVisibleNotifications(profile).stream()
                .limit(3)
                .map(n -> ParentDashboardDto.AnnouncementDto.builder()
                        .title(n.getTitle())
                        .content(n.getContent())
                        .date(n.getPostedAt().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")))
                        .tag(n.isPinned() ? "Ghim" : "Thông báo")
                        .build())
                .collect(Collectors.toList());
    }
}
