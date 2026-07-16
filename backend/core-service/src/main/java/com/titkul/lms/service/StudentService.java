package com.titkul.lms.service;

import com.titkul.lms.dto.AssignmentResponseDto;
import com.titkul.lms.dto.ContentNodeCompleteResultDto;
import com.titkul.lms.dto.ContentNodeDetailDto;
import com.titkul.lms.dto.EssayAssignmentDetailDto;
import com.titkul.lms.dto.EssaySubmissionRequest;
import com.titkul.lms.dto.EssaySubmissionResultDto;
import com.titkul.lms.dto.H5PAssignmentDetailDto;
import com.titkul.lms.dto.H5PSubmissionRequest;
import com.titkul.lms.dto.H5PSubmissionResultDto;
import com.titkul.lms.dto.StudentDashboardDto;
import com.titkul.lms.entity.*;
import com.titkul.lms.repository.*;
import com.titkul.lms.util.AssignmentStatusUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentService {

    private static final DateTimeFormatter DEADLINE_FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
    private static final List<NotificationAudience> STUDENT_AUDIENCE =
            List.of(NotificationAudience.TAT_CA, NotificationAudience.HOC_SINH);

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final EvaluationRepository evaluationRepository;
    private final AssignmentRepository assignmentRepository;
    private final SubmissionRepository submissionRepository;
    private final SubmissionService submissionService;
    private final ContentNodeRepository contentNodeRepository;
    private final StudentProgressRepository studentProgressRepository;
    private final SemesterRepository semesterRepository;
    private final NotificationRepository notificationRepository;
    private final NotificationReadStatusRepository notificationReadStatusRepository;
    private final BadgeRepository badgeRepository;
    private final StudentRewardRepository studentRewardRepository;

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

        List<StudentDashboardDto.SubjectProgressDto> subjects = buildSubjectProgress(profile, classRoom);

        List<StudentDashboardDto.UpcomingTaskDto> upcomingTasks = List.of(
            StudentDashboardDto.UpcomingTaskDto.builder().id(1L).title("Luyện tập phép cộng trừ").subject("Toán Học").time("3 giờ nữa").build()
        );

        List<Notification> visibleNotifications = classRoom != null
                ? notificationRepository.findVisibleToClass(classRoom.getId(), STUDENT_AUDIENCE)
                : notificationRepository.findGlobalOnly(STUDENT_AUDIENCE);
        DateTimeFormatter notiFmt = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        List<StudentDashboardDto.NotificationDto> notifications = visibleNotifications.stream()
                .limit(3)
                .map(n -> {
                    boolean read = notificationReadStatusRepository
                            .findByUser_IdAndNotification_Id(user.getId(), n.getId())
                            .map(NotificationReadStatus::isRead)
                            .orElse(false);
                    return StudentDashboardDto.NotificationDto.builder()
                            .id(n.getId())
                            .title(n.getTitle())
                            .isNew(!read)
                            .content(n.getContent())
                            .date(n.getPostedAt().format(notiFmt))
                            .type(n.getType().name())
                            .pinned(n.isPinned())
                            .build();
                })
                .collect(Collectors.toList());

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

    private static final Map<String, String[]> SUBJECT_STYLE = Map.of(
            "Toán", new String[]{"https://img.icons8.com/color/96/calculator--v1.png", "text-blue-700", "bg-blue-50 text-blue-600 hover:bg-blue-100", "bg-blue-500"},
            "Tiếng Việt", new String[]{"https://img.icons8.com/color/96/books.png", "text-orange-700", "bg-orange-50 text-orange-600 hover:bg-orange-100", "bg-orange-500"}
    );
    private static final String[] DEFAULT_SUBJECT_STYLE =
            {"https://img.icons8.com/color/96/school.png", "text-slate-700", "bg-slate-50 text-slate-600 hover:bg-slate-100", "bg-slate-500"};

    // Chỉ hiện những môn ĐÃ có nội dung thật trong cây SGK cho đúng khối của lớp học sinh —
    // không hiện môn giả/rỗng. % tiến độ tính thật từ StudentProgress.
    private List<StudentDashboardDto.SubjectProgressDto> buildSubjectProgress(StudentProfile profile, ClassRoom classRoom) {
        if (classRoom == null || classRoom.getGrade() == null) return List.of();
        Integer grade = classRoom.getGrade().intValue();
        List<Subject> subjectsWithContent = contentNodeRepository.findDistinctSubjectsByGrade(grade);

        return subjectsWithContent.stream().map(subject -> {
            List<ContentNode> nodes = contentNodeRepository.findBySubjectAndGradeOrdered(subject.getId(), grade);
            long completed = studentProgressRepository.countByStudent_IdAndContentNode_Subject_IdAndCompletedTrue(profile.getId(), subject.getId());
            int progress = nodes.isEmpty() ? 0 : (int) Math.round(completed * 100.0 / nodes.size());
            String[] style = SUBJECT_STYLE.getOrDefault(subject.getName(), DEFAULT_SUBJECT_STYLE);

            return StudentDashboardDto.SubjectProgressDto.builder()
                    .id(String.valueOf(subject.getId()))
                    .name(subject.getName())
                    .desc(nodes.size() + " bài học")
                    .icon(style[0])
                    .color("bg-white border-slate-200 " + style[1])
                    .btnColor(style[2])
                    .trackColor("bg-slate-100")
                    .barColor(style[3])
                    .progress(progress)
                    .build();
        }).collect(Collectors.toList());
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

    public H5PAssignmentDetailDto getH5PAssignmentDetail(String username, Long assignmentId) {
        StudentProfile profile = resolveProfile(username);
        Assignment assignment = resolveH5PAssignmentForStudent(assignmentId, profile);

        List<Submission> attempts = submissionRepository.findByAssignmentIdAndStudent_Id(assignmentId, profile.getId());
        int attemptsUsed = attempts.size();
        boolean hasSubmitted = attemptsUsed > 0;
        boolean pastDeadline = assignment.getDeadline() != null && assignment.getDeadline().isBefore(LocalDateTime.now());
        boolean canSubmit = !hasSubmitted
                || (Boolean.TRUE.equals(assignment.getAllowResubmit()) && attemptsUsed < assignment.getMaxResubmitCount());

        return H5PAssignmentDetailDto.builder()
                .assignmentId(assignment.getId())
                .title(assignment.getTitle())
                .h5pContentId(resolveH5pContentId(assignment))
                .xpReward(resolveXpReward(assignment))
                .allowResubmit(assignment.getAllowResubmit())
                .maxResubmitCount(assignment.getMaxResubmitCount())
                .attemptsUsed(attemptsUsed)
                .canSubmit(canSubmit)
                .deadline(assignment.getDeadline() != null ? assignment.getDeadline().format(DEADLINE_FMT) : null)
                .isPastDeadline(pastDeadline)
                .build();
    }

    @Transactional
    public H5PSubmissionResultDto submitH5PAssignment(String username, Long assignmentId, H5PSubmissionRequest request) {
        StudentProfile profile = resolveProfile(username);
        Assignment assignment = resolveH5PAssignmentForStudent(assignmentId, profile);
        Integer xpReward = resolveXpReward(assignment);

        if (request.getMaxScore() == null || request.getMaxScore() <= 0) {
            throw new IllegalArgumentException("Dữ liệu điểm số không hợp lệ.");
        }

        List<Submission> previousAttempts = submissionRepository.findByAssignmentIdAndStudent_Id(assignmentId, profile.getId());
        boolean hasSubmitted = !previousAttempts.isEmpty();
        boolean canResubmit = Boolean.TRUE.equals(assignment.getAllowResubmit()) && previousAttempts.size() < assignment.getMaxResubmitCount();
        if (hasSubmitted && !canResubmit) {
            throw new RuntimeException("Bạn đã hết lượt làm lại cho bài tập này.");
        }

        BigDecimal score = BigDecimal.valueOf(request.getRawScore())
                .divide(BigDecimal.valueOf(request.getMaxScore()), 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(10))
                .setScale(1, RoundingMode.HALF_UP);

        Submission submission = new Submission();
        submission.setAssignment(assignment);
        submission.setStudent(profile);
        submission.setContentNode(assignment.getContentNode());
        submission.setAutoScore(score);
        submission.setInteractionDetails(request.getInteractionDetails());
        submission.setAttemptNumber((short) (previousAttempts.size() + 1));

        // Chỉ thưởng XP ở lần nộp đầu tiên hoàn thành, tránh cày XP qua nộp lại nhiều lần
        boolean completed = Boolean.TRUE.equals(request.getCompleted());
        int xpEarned = (completed && !hasSubmitted && xpReward != null) ? xpReward : 0;
        submission.setXpEarned(xpEarned);

        Submission saved = submissionService.submitAssignment(submission);

        if (xpEarned > 0) {
            profile.setTotalXp(profile.getTotalXp() + xpEarned);
            studentProfileRepository.save(profile);
        }

        return H5PSubmissionResultDto.builder()
                .submissionId(saved.getId())
                .score(score)
                .xpEarned(xpEarned)
                .totalXp(profile.getTotalXp())
                .status(saved.getStatus().name())
                .isLate(saved.getIsLate())
                .build();
    }

    public EssayAssignmentDetailDto getEssayAssignmentDetail(String username, Long assignmentId) {
        StudentProfile profile = resolveProfile(username);
        Assignment assignment = resolveEssayAssignmentForStudent(assignmentId, profile);

        List<Submission> attempts = submissionRepository.findByAssignmentIdAndStudent_Id(assignmentId, profile.getId());
        Submission draft = attempts.stream().filter(s -> s.getStatus() == SubmissionStatus.LUU_NHAP).findFirst().orElse(null);
        long finalizedCount = attempts.stream().filter(s -> s.getStatus() != SubmissionStatus.LUU_NHAP).count();

        boolean hasFinalized = finalizedCount > 0;
        boolean pastDeadline = assignment.getDeadline() != null && assignment.getDeadline().isBefore(LocalDateTime.now());
        boolean canSubmit = !hasFinalized
                || (Boolean.TRUE.equals(assignment.getAllowResubmit()) && finalizedCount < assignment.getMaxResubmitCount());

        return EssayAssignmentDetailDto.builder()
                .assignmentId(assignment.getId())
                .title(assignment.getTitle())
                .description(assignment.getDescription())
                .deadline(assignment.getDeadline() != null ? assignment.getDeadline().format(DEADLINE_FMT) : null)
                .isPastDeadline(pastDeadline)
                .allowResubmit(assignment.getAllowResubmit())
                .maxResubmitCount(assignment.getMaxResubmitCount())
                .attemptsUsed((int) finalizedCount)
                .canSubmit(canSubmit)
                .draftText(draft != null ? draft.getTextContent() : null)
                .draftAttachmentUrl(draft != null ? draft.getAttachmentUrl() : null)
                .build();
    }

    @Transactional
    public EssaySubmissionResultDto submitEssay(String username, Long assignmentId, EssaySubmissionRequest request) {
        StudentProfile profile = resolveProfile(username);
        Assignment assignment = resolveEssayAssignmentForStudent(assignmentId, profile);

        List<Submission> attempts = submissionRepository.findByAssignmentIdAndStudent_Id(assignmentId, profile.getId());
        Submission draft = attempts.stream().filter(s -> s.getStatus() == SubmissionStatus.LUU_NHAP).findFirst().orElse(null);
        long finalizedCount = attempts.stream().filter(s -> s.getStatus() != SubmissionStatus.LUU_NHAP).count();

        boolean isDraft = Boolean.TRUE.equals(request.getIsDraft());
        if (!isDraft) {
            boolean hasFinalized = finalizedCount > 0;
            boolean canResubmit = Boolean.TRUE.equals(assignment.getAllowResubmit()) && finalizedCount < assignment.getMaxResubmitCount();
            if (hasFinalized && !canResubmit) {
                throw new RuntimeException("Bạn đã hết lượt nộp lại cho bài tập này.");
            }
        }

        Submission submission = draft != null ? draft : new Submission();
        submission.setAssignment(assignment);
        submission.setStudent(profile);
        submission.setTextContent(request.getTextContent());
        submission.setAttachmentUrl(request.getAttachmentUrl());
        submission.setAttemptNumber((short) (finalizedCount + 1));

        if (isDraft) {
            submission.setStatus(SubmissionStatus.LUU_NHAP);
            Submission saved = submissionRepository.save(submission);
            return EssaySubmissionResultDto.builder()
                    .submissionId(saved.getId())
                    .status(saved.getStatus().name())
                    .isLate(false)
                    .build();
        }

        Submission saved = submissionService.submitAssignment(submission);
        return EssaySubmissionResultDto.builder()
                .submissionId(saved.getId())
                .status(saved.getStatus().name())
                .isLate(saved.getIsLate())
                .build();
    }

    private Assignment resolveEssayAssignmentForStudent(Long assignmentId, StudentProfile profile) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài tập"));
        if (assignment.getType() != AssignmentType.TU_LUAN) {
            throw new RuntimeException("Bài tập này không phải dạng tự luận.");
        }
        if (profile.getClassRoom() == null || !assignment.getClassRoom().getId().equals(profile.getClassRoom().getId())) {
            throw new RuntimeException("Bạn không thuộc lớp được giao bài tập này.");
        }
        return assignment;
    }

    private StudentProfile resolveProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
        return studentProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ học sinh"));
    }

    private Assignment resolveH5PAssignmentForStudent(Long assignmentId, StudentProfile profile) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài tập"));
        if (assignment.getType() != AssignmentType.H5P) {
            throw new RuntimeException("Bài tập này không phải dạng H5P.");
        }
        if (profile.getClassRoom() == null || !assignment.getClassRoom().getId().equals(profile.getClassRoom().getId())) {
            throw new RuntimeException("Bạn không thuộc lớp được giao bài tập này.");
        }
        if (resolveH5pContentId(assignment) == null) {
            throw new RuntimeException("Bài tập chưa gắn nội dung H5P.");
        }
        return assignment;
    }

    // Bài H5P có thể nguồn từ HocLieu (kho học liệu GV tự soạn) hoặc ContentNode (cây SGK) — ưu tiên HocLieu.
    private String resolveH5pContentId(Assignment assignment) {
        if (assignment.getHocLieu() != null && assignment.getHocLieu().getH5pContentId() != null) {
            return assignment.getHocLieu().getH5pContentId();
        }
        return assignment.getContentNode() != null ? assignment.getContentNode().getH5pContentId() : null;
    }

    private Integer resolveXpReward(Assignment assignment) {
        if (assignment.getHocLieu() != null) {
            return assignment.getHocLieu().getXpReward();
        }
        return assignment.getContentNode() != null ? assignment.getContentNode().getXpReward() : null;
    }

    public List<Map<String, Object>> getNotifications(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
        StudentProfile profile = studentProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ học sinh"));

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        List<Notification> notifications = profile.getClassRoom() != null
                ? notificationRepository.findVisibleToClass(profile.getClassRoom().getId(), STUDENT_AUDIENCE)
                : notificationRepository.findGlobalOnly(STUDENT_AUDIENCE);

        return notifications.stream()
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
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
        markNotificationReadForUser(user, notificationId);
    }

    @Transactional
    public void markAllNotificationsRead(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
        StudentProfile profile = studentProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ học sinh"));

        List<Notification> notifications = profile.getClassRoom() != null
                ? notificationRepository.findVisibleToClass(profile.getClassRoom().getId(), STUDENT_AUDIENCE)
                : notificationRepository.findGlobalOnly(STUDENT_AUDIENCE);
        notifications.forEach(n -> markNotificationReadForUser(user, n.getId()));
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

    public Map<String, Object> getRewards(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
        StudentProfile profile = studentProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ học sinh"));

        return buildRewardsPayload(profile);
    }

    // Dùng chung cho cả HS xem của mình và PH xem của con — ghép danh mục huy hiệu
    // thật (huy_hieu) với những huy hiệu học sinh này đã thật sự được trao (khen_thuong_hoc_sinh).
    Map<String, Object> buildRewardsPayload(StudentProfile profile) {
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        List<StudentReward> earned = studentRewardRepository.findByStudent_IdOrderByAwardedAtDesc(profile.getId());
        Map<Integer, StudentReward> earnedByBadgeId = earned.stream()
                .collect(Collectors.toMap(r -> r.getBadge().getId(), r -> r, (a, b) -> a));

        List<Map<String, Object>> badges = badgeRepository.findAll().stream()
                .map(badge -> {
                    StudentReward reward = earnedByBadgeId.get(badge.getId());
                    Map<String, Object> map = new LinkedHashMap<>();
                    map.put("id", badge.getId());
                    map.put("name", badge.getName());
                    map.put("desc", badge.getDescription());
                    map.put("icon", badge.getIconUrl());
                    map.put("date", reward != null ? reward.getAwardedAt().format(fmt) : "");
                    map.put("unlocked", reward != null);
                    return map;
                })
                .collect(Collectors.toList());

        List<Map<String, Object>> letters = earned.stream()
                .filter(r -> r.getComplimentLetter() != null && !r.getComplimentLetter().isBlank())
                .map(r -> {
                    Map<String, Object> map = new LinkedHashMap<>();
                    map.put("id", r.getId());
                    map.put("teacher", r.getTeacher() != null ? r.getTeacher().getFullName() : "Giáo viên");
                    map.put("subject", r.getTeacher() != null ? r.getTeacher().getDepartment() : "");
                    map.put("content", r.getComplimentLetter());
                    map.put("date", r.getAwardedAt().format(fmt));
                    return map;
                })
                .collect(Collectors.toList());

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("badges", badges);
        result.put("letters", letters);
        return result;
    }

    // Mở khóa tuần tự: bài đầu tiên chưa hoàn thành trong toàn bộ môn là "current",
    // các bài sau đó "locked", các bài trước (đã hoàn thành) là "completed".
    public Map<String, Object> getSubjectTree(String username, Integer subjectId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
        StudentProfile profile = studentProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ học sinh"));

        if (profile.getClassRoom() == null || profile.getClassRoom().getGrade() == null || subjectId == null) {
            return Map.of("subjectName", "", "totalLessons", 0, "completedLessons", 0, "chapters", List.of());
        }
        Integer grade = profile.getClassRoom().getGrade().intValue();
        List<ContentNode> nodes = contentNodeRepository.findBySubjectAndGradeOrdered(subjectId, grade);
        if (nodes.isEmpty()) {
            return Map.of("subjectName", "", "totalLessons", 0, "completedLessons", 0, "chapters", List.of());
        }

        List<StudentProgress> progressList = studentProgressRepository
                .findByStudent_IdAndContentNode_Subject_Id(profile.getId(), subjectId);
        Map<Integer, StudentProgress> progressByNodeId = progressList.stream()
                .collect(Collectors.toMap(p -> p.getContentNode().getId(), p -> p, (a, b) -> a));

        java.util.LinkedHashMap<Integer, Map<String, Object>> chaptersByTopicId = new java.util.LinkedHashMap<>();
        boolean foundCurrent = false;
        int completedCount = 0;

        for (ContentNode node : nodes) {
            Topic topic = node.getLesson().getTopic();
            Map<String, Object> chapter = chaptersByTopicId.computeIfAbsent(topic.getId(), tid -> {
                Map<String, Object> c = new java.util.HashMap<>();
                c.put("id", tid);
                c.put("title", topic.getName());
                c.put("icon", "https://img.icons8.com/color/96/1-circle.png");
                c.put("lessons", new java.util.ArrayList<Map<String, Object>>());
                return c;
            });

            StudentProgress progress = progressByNodeId.get(node.getId());
            boolean completed = progress != null && Boolean.TRUE.equals(progress.getCompleted());
            String status;
            if (completed) {
                status = "completed";
                completedCount++;
            } else if (!foundCurrent) {
                status = "current";
                foundCurrent = true;
            } else {
                status = "locked";
            }

            Map<String, Object> lesson = new java.util.HashMap<>();
            lesson.put("id", node.getId());
            lesson.put("title", node.getName());
            lesson.put("type", node.getH5pContentId() != null ? "h5p" : "document");
            lesson.put("status", status);

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> lessons = (List<Map<String, Object>>) chapter.get("lessons");
            lessons.add(lesson);
        }

        Map<String, Object> result = new java.util.HashMap<>();
        result.put("subjectName", nodes.get(0).getSubject().getName());
        result.put("totalLessons", nodes.size());
        result.put("completedLessons", completedCount);
        result.put("chapters", new java.util.ArrayList<>(chaptersByTopicId.values()));
        return result;
    }

    public ContentNodeDetailDto getContentNodeDetail(String username, Integer contentNodeId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
        StudentProfile profile = studentProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ học sinh"));
        ContentNode contentNode = contentNodeRepository.findById(contentNodeId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nội dung bài học"));

        boolean completed = studentProgressRepository
                .findByStudent_IdAndContentNode_Id(profile.getId(), contentNodeId)
                .map(p -> Boolean.TRUE.equals(p.getCompleted()))
                .orElse(false);

        return ContentNodeDetailDto.builder()
                .id(contentNode.getId())
                .title(contentNode.getName())
                .h5pContentId(contentNode.getH5pContentId())
                .xpReward(contentNode.getXpReward())
                .completed(completed)
                .build();
    }

    // Chỉ cộng XP lần đầu hoàn thành, tránh cày XP qua việc gọi lại API nhiều lần.
    @Transactional
    public ContentNodeCompleteResultDto markContentNodeComplete(String username, Integer contentNodeId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
        StudentProfile profile = studentProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ học sinh"));
        ContentNode contentNode = contentNodeRepository.findById(contentNodeId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nội dung bài học"));

        StudentProgress progress = studentProgressRepository
                .findByStudent_IdAndContentNode_Id(profile.getId(), contentNodeId)
                .orElseGet(StudentProgress::new);

        boolean wasCompleted = Boolean.TRUE.equals(progress.getCompleted());

        if (progress.getId() == null) {
            progress.setStudent(profile);
            progress.setContentNode(contentNode);
            Semester semester = semesterRepository.findTopByOrderByIdDesc()
                    .orElseThrow(() -> new RuntimeException("Chưa cấu hình học kỳ nào trong hệ thống"));
            progress.setSemester(semester);
        }
        progress.setCompleted(true);
        progress.setCompletionPercent((short) 100);
        progress.setLastViewedAt(LocalDateTime.now());
        studentProgressRepository.save(progress);

        int xpEarned = 0;
        if (!wasCompleted) {
            xpEarned = contentNode.getXpReward() != null ? contentNode.getXpReward() : 0;
            if (xpEarned > 0) {
                profile.setTotalXp(profile.getTotalXp() + xpEarned);
                studentProfileRepository.save(profile);
            }
        }

        return ContentNodeCompleteResultDto.builder()
                .xpEarned(xpEarned)
                .totalXp(profile.getTotalXp())
                .alreadyCompleted(wasCompleted)
                .build();
    }
}
