package com.titkul.lms.service;

import com.titkul.lms.dto.EvaluateDTO;
import com.titkul.lms.dto.SubmissionDetailDto;
import com.titkul.lms.entity.*;
import com.titkul.lms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final AssignmentRepository assignmentRepository;
    private final EvaluationRepository evaluationRepository;
    private final TeacherProfileRepository teacherProfileRepository;

    public Submission submitAssignment(Submission submission) {
        com.titkul.lms.entity.Assignment assignment = assignmentRepository.findById(submission.getAssignment().getId())
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Không tìm thấy bài tập!"));

        java.time.LocalDateTime now = java.time.LocalDateTime.now();
        if (now.isAfter(assignment.getDeadline())) {
            submission.setIsLate(true);
            submission.setStatus(com.titkul.lms.entity.SubmissionStatus.NOP_TRE);
        } else {
            if (submission.getStatus() == null || submission.getStatus() == com.titkul.lms.entity.SubmissionStatus.CHUA_NOP) {
                submission.setStatus(com.titkul.lms.entity.SubmissionStatus.DA_NOP);
            }
        }

        submission.setSubmittedAt(now);
        return submissionRepository.save(submission);
    }

    public List<Submission> getSubmissionsByAssignment(Long assignmentId) {
        return submissionRepository.findByAssignmentId(assignmentId);
    }

    private static final DateTimeFormatter DETAIL_DATE_FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    public SubmissionDetailDto getSubmissionDetail(Long submissionId) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Không tìm thấy bài nộp!"));
        Evaluation evaluation = evaluationRepository.findBySubmission_Id(submissionId).orElse(null);

        return SubmissionDetailDto.builder()
                .id(submission.getId())
                .studentName(submission.getStudent().getFullName())
                .assignmentTitle(submission.getAssignment().getTitle())
                .textContent(submission.getTextContent())
                .attachmentUrl(submission.getAttachmentUrl())
                .autoScore(submission.getAutoScore())
                .xpEarned(submission.getXpEarned())
                .attemptNumber(submission.getAttemptNumber())
                .status(submission.getStatus().name())
                .isLate(submission.getIsLate())
                .submittedAt(submission.getSubmittedAt() != null ? submission.getSubmittedAt().format(DETAIL_DATE_FMT) : null)
                .evaluationScore(evaluation != null ? evaluation.getScore() : null)
                .evaluationGrade(evaluation != null && evaluation.getGrade() != null ? evaluation.getGrade().name() : null)
                .evaluationComment(evaluation != null ? evaluation.getComment() : null)
                .evaluationAction(evaluation != null ? evaluation.getAction().name() : null)
                .evaluatedAt(evaluation != null ? evaluation.getEvaluatedAt().format(DETAIL_DATE_FMT) : null)
                .build();
    }

    @Transactional
    public Evaluation evaluateSubmission(Long submissionId, EvaluateDTO dto) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Không tìm thấy bài nộp!"));

        if (submission.getAssignment().getClassRoom().getStatus() != ClassStatus.ACTIVE) {
            throw new IllegalArgumentException("Lớp học đã đóng băng (DONG_BANG), không thể chấm điểm bài mới.");
        }

        // Tìm Giáo viên chấm bài theo userId (nguoi_dung_id) từ JWT token
        TeacherProfile teacher = teacherProfileRepository.findByUserId(dto.getTeacherId())
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException(
                    "Không tìm thấy hồ sơ Giáo viên cho user ID: " + dto.getTeacherId() + ". Hãy kiểm tra bảng ho_so_giao_vien!"));

        // Tạo bản ghi Evaluation
        Evaluation evaluation = new Evaluation();
        evaluation.setSubmission(submission);
        evaluation.setTeacher(teacher);
        evaluation.setComment(dto.getComment());

        if (dto.getGrade() != null) {
            evaluation.setGrade(EvaluationGrade.valueOf(dto.getGrade()));
        }

        EvaluationAction action = EvaluationAction.valueOf(dto.getAction());
        evaluation.setAction(action);

        // Cập nhật trạng thái bài nộp
        if (action == EvaluationAction.YC_LAM_LAI) {
            submission.setStatus(SubmissionStatus.YC_LAM_LAI);
        } else {
            submission.setStatus(SubmissionStatus.DA_CHAM);
        }
        submissionRepository.save(submission);

        return evaluationRepository.save(evaluation);
    }
}
