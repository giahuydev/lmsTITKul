package com.titkul.lms.controller;

import com.titkul.lms.repository.SemesterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
public class SemesterController {

    private final SemesterRepository semesterRepository;

    @GetMapping("/api/v1/semesters")
    @Transactional(readOnly = true)
    public ResponseEntity<List<Map<String, Object>>> list() {
        List<Map<String, Object>> semesters = semesterRepository.findAll().stream()
                .map(s -> {
                    String yearName = s.getAcademicYear() != null ? s.getAcademicYear().getName() : "";
                    return Map.<String, Object>of(
                            "id", s.getId(),
                            "label", "Học kỳ " + s.getSemesterNumber() + " (" + yearName + ")"
                    );
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(semesters);
    }
}
