package com.titkul.lms.service;

import com.titkul.lms.dto.EvaluateDTO;
import com.titkul.lms.entity.*;
import com.titkul.lms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
            if (assignment.getIsHardLock()) {
                throw new IllegalArgumentException("Bài tập này đã quá hạn và bị khóa (Hard Lock). Không thể nộp bài!");
            }
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

    @Transactional
    public Evaluation evaluateSubmission(Long submissionId, EvaluateDTO dto) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Không tìm thấy bài nộp!"));

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
