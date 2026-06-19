package com.titkul.lms.service;

import com.titkul.lms.dto.ParentDashboardDto;
import com.titkul.lms.entity.*;
import com.titkul.lms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ParentService {

    private final UserRepository userRepository;
    private final ParentProfileRepository parentProfileRepository;
    private final EvaluationRepository evaluationRepository;
    private final AssignmentRepository assignmentRepository;
    private final NotificationRepository notificationRepository;

    @Transactional(readOnly = true)
    public ParentDashboardDto getDashboard(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        ParentProfile profile = parentProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ phụ huynh"));

        List<StudentProfile> children = profile.getChildren() != null ? profile.getChildren() : Collections.emptyList();
        
        List<ParentDashboardDto.ChildDto> childDtos = children.stream().map(c -> 
            ParentDashboardDto.ChildDto.builder()
                .id(c.getId())
                .studentName(c.getFullName())
                .className(c.getClassRoom() != null ? c.getClassRoom().getName() : "Chưa có lớp")
                .build()
        ).collect(Collectors.toList());

        List<Long> childIds = children.stream().map(StudentProfile::getId).collect(Collectors.toList());
        
        // 1. Recent Activities
        List<Evaluation> recentEvals = childIds.isEmpty() ? Collections.emptyList() :
                evaluationRepository.findBySubmission_Student_IdInOrderByEvaluatedAtDesc(childIds, PageRequest.of(0, 5));
        
        List<ParentDashboardDto.ActivityDto> activities = recentEvals.stream().map(eval ->
            ParentDashboardDto.ActivityDto.builder()
                .title(eval.getSubmission().getAssignment().getSubject() + " - " + eval.getSubmission().getAssignment().getTitle())
                .type(eval.getSubmission().getAssignment().getType() == AssignmentType.H5P ? "Bài tập H5P" : "Bài tự luận")
                .badge(eval.getGrade() != null ? eval.getGrade().name() : "Đã chấm điểm")
                .build()
        ).collect(Collectors.toList());

        // 2. Reminders / Alerts (Assignments not submitted or past due)
        // For simplicity, we just fetch upcoming assignments for the classrooms the children are in
        List<Long> classRoomIds = children.stream()
                .filter(c -> c.getClassRoom() != null)
                .map(c -> c.getClassRoom().getId())
                .distinct().collect(Collectors.toList());

        List<Assignment> assignments = classRoomIds.isEmpty() ? Collections.emptyList() :
                assignmentRepository.findByClassRoom_IdInOrderByDeadlineAsc(classRoomIds);
        
        List<ParentDashboardDto.AlertDto> alerts = assignments.stream()
                .filter(a -> a.getDeadline() != null && a.getDeadline().isAfter(LocalDateTime.now()))
                .limit(3)
                .map(a -> ParentDashboardDto.AlertDto.builder()
                    .title("Sắp đến hạn nộp bài!")
                    .description("Bài tập \"" + a.getTitle() + "\" (" + a.getSubject() + ") sẽ hết hạn vào " + a.getDeadline().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")) + ".")
                    .build()
                ).collect(Collectors.toList());

        // 3. Announcements (Notifications for Parent)
        List<Notification> notifs = notificationRepository.findByRecipientIdOrderByDateDesc(user.getId());
        List<ParentDashboardDto.AnnouncementDto> announcements = notifs.stream()
                .limit(3)
                .map(n -> ParentDashboardDto.AnnouncementDto.builder()
                    .title(n.getTitle())
                    .content(n.getContent())
                    .date(n.getDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")))
                    .tag(n.isPinned() ? "Ghim" : "Thông báo")
                    .build()
                ).collect(Collectors.toList());

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
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        ParentProfile profile = parentProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ phụ huynh"));

        if (profile.getChildren() == null) return Collections.emptyList();

        return profile.getChildren().stream().map(child -> {
            Map<String, Object> map = new HashMap<>();
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
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        ParentProfile profile = parentProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ phụ huynh"));

        List<Long> childIds = profile.getChildren() != null ? 
                profile.getChildren().stream().map(StudentProfile::getId).collect(Collectors.toList()) : 
                Collections.emptyList();

        if (childIds.isEmpty()) return Collections.emptyList();

        List<Evaluation> evals = evaluationRepository.findBySubmission_Student_IdInOrderByEvaluatedAtDesc(childIds);

        return evals.stream().map(eval -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", eval.getId());
            map.put("subject", eval.getSubmission().getAssignment().getSubject());
            map.put("assignment", eval.getSubmission().getAssignment().getTitle());
            map.put("score", eval.getGrade() != null ? eval.getGrade().name() : (eval.getScore() != null ? eval.getScore().toString() : "Đã chấm"));
            map.put("type", eval.getSubmission().getAssignment().getType().name());
            map.put("date", eval.getEvaluatedAt() != null ? eval.getEvaluatedAt().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) : "");
            map.put("studentName", eval.getSubmission().getStudent().getFullName());
            return map;
        }).collect(Collectors.toList());
    }
}
