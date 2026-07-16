package com.titkul.lms.controller;

import com.titkul.lms.dto.EvaluateDTO;
import com.titkul.lms.dto.SubmissionDetailDto;
import com.titkul.lms.entity.Evaluation;
import com.titkul.lms.entity.Submission;
import com.titkul.lms.service.AiSuggestionService;
import com.titkul.lms.service.SubmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class SubmissionController {

    private final SubmissionService submissionService;
    private final AiSuggestionService aiSuggestionService;

    @PostMapping("/submissions")
    public ResponseEntity<Submission> submitAssignment(@RequestBody Submission submission) {
        return ResponseEntity.ok(submissionService.submitAssignment(submission));
    }

    @GetMapping("/assignments/{id}/submissions")
    public ResponseEntity<List<Submission>> getSubmissions(@PathVariable Long id) {
        List<Submission> submissions = submissionService.getSubmissionsByAssignment(id);
        List<Submission> filtered = submissions.stream()
                .filter(s -> s.getStatus() != com.titkul.lms.entity.SubmissionStatus.LUU_NHAP)
                .collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(filtered);
    }

    @GetMapping("/submissions/{id}")
    public ResponseEntity<SubmissionDetailDto> getSubmissionDetail(@PathVariable Long id) {
        return ResponseEntity.ok(submissionService.getSubmissionDetail(id));
    }

    @PostMapping("/submissions/{id}/evaluate")
    public ResponseEntity<Evaluation> evaluateSubmission(
            @PathVariable Long id,
            @RequestBody EvaluateDTO dto) {
        return ResponseEntity.ok(submissionService.evaluateSubmission(id, dto));
    }

    @PostMapping("/submissions/{id}/comment-suggestions")
    public ResponseEntity<?> generateCommentSuggestions(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(aiSuggestionService.generateCommentSuggestions(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/submissions/comment-suggestions/{suggestionId}/choose")
    public ResponseEntity<?> chooseCommentSuggestion(@PathVariable Long suggestionId) {
        try {
            aiSuggestionService.chooseSuggestion(suggestionId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
