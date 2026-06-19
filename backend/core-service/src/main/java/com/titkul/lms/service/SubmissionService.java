package com.titkul.lms.service;

import com.titkul.lms.entity.Evaluation;
import com.titkul.lms.entity.Submission;
import com.titkul.lms.repository.EvaluationRepository;
import com.titkul.lms.repository.SubmissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final com.titkul.lms.repository.AssignmentRepository assignmentRepository;
    private final com.titkul.lms.repository.EvaluationRepository evaluationRepository;

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
    public Evaluation evaluateSubmission(Long submissionId, Evaluation evaluation) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Không tìm thấy bài nộp"));
        
        evaluation.setSubmission(submission);

        if (evaluation.getAction() == com.titkul.lms.entity.EvaluationAction.YC_LAM_LAI) {
            submission.setStatus(com.titkul.lms.entity.SubmissionStatus.YC_LAM_LAI);
        } else {
            submission.setStatus(com.titkul.lms.entity.SubmissionStatus.DA_CHAM);
        }
        submissionRepository.save(submission);

        return evaluationRepository.save(evaluation);
    }
}
