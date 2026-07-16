package com.titkul.lms.controller;

import com.titkul.lms.entity.Subject;
import com.titkul.lms.repository.SubjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
public class SubjectController {

    private final SubjectRepository subjectRepository;

    @GetMapping("/api/v1/subjects")
    public ResponseEntity<List<Subject>> list() {
        List<Subject> subjects = subjectRepository.findAll().stream()
                .filter(s -> s.getStatus() == Subject.Status.ACTIVE)
                .collect(Collectors.toList());
        return ResponseEntity.ok(subjects);
    }
}
