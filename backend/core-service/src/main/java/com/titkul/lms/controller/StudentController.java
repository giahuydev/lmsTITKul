package com.titkul.lms.controller;

import com.titkul.lms.dto.StudentDashboardDto;
import com.titkul.lms.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @GetMapping("/me/dashboard")
    public ResponseEntity<?> getDashboard() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(java.util.Map.of("message", "Vui lòng đăng nhập"));
        }

        try {
            StudentDashboardDto dashboard = studentService.getDashboard(authentication.getName());
            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/me/assignments")
    public ResponseEntity<?> getAssignments() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(java.util.Map.of("message", "Vui lòng đăng nhập"));
        }

        try {
            return ResponseEntity.ok(studentService.getAssignments(authentication.getName()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/me/notifications")
    public ResponseEntity<?> getNotifications() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(java.util.Map.of("message", "Vui lòng đăng nhập"));
        }

        try {
            return ResponseEntity.ok(studentService.getNotifications(authentication.getName()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/me/rewards")
    public ResponseEntity<?> getRewards() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(java.util.Map.of("message", "Vui lòng đăng nhập"));
        }

        try {
            return ResponseEntity.ok(studentService.getRewards(authentication.getName()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/me/subject-tree")
    public ResponseEntity<?> getSubjectTree() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(java.util.Map.of("message", "Vui lòng đăng nhập"));
        }

        try {
            return ResponseEntity.ok(studentService.getSubjectTree(authentication.getName()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }
}
