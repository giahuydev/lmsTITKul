package com.titkul.lms.controller;

import com.titkul.lms.entity.Evaluation;
import com.titkul.lms.entity.Submission;
import com.titkul.lms.service.SubmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class SubmissionController {

    private final SubmissionService submissionService;

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

    @PostMapping("/submissions/{id}/evaluate")
    public ResponseEntity<Evaluation> evaluateSubmission(
            @PathVariable Long id, 
            @RequestBody Evaluation evaluation) {
        return ResponseEntity.ok(submissionService.evaluateSubmission(id, evaluation));
    }
}
