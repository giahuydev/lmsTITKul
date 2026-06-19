package com.titkul.lms.controller;

import com.titkul.lms.dto.TeacherDashboardDto;
import com.titkul.lms.service.TeacherService;
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
@RequestMapping("/api/v1/teachers")
@RequiredArgsConstructor
public class TeacherController {

    private final TeacherService teacherService;

    @GetMapping("/me/dashboard")
    public ResponseEntity<?> getDashboard() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(java.util.Map.of("message", "Vui lòng đăng nhập"));
        }

        try {
            TeacherDashboardDto dashboard = teacherService.getDashboard(authentication.getName());
            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }
    @GetMapping
    public ResponseEntity<?> getAllTeachers() {
        return ResponseEntity.ok(teacherService.getAllTeachers());
    }

    @GetMapping("/me/classes")
    public ResponseEntity<?> getClasses() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(java.util.Map.of("message", "Vui lòng đăng nhập"));
        }
        try {
            return ResponseEntity.ok(teacherService.getClasses(authentication.getName()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/me/classes/{classId}")
    public ResponseEntity<?> getClassDetails(@org.springframework.web.bind.annotation.PathVariable Long classId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(java.util.Map.of("message", "Vui lòng đăng nhập"));
        }
        try {
            return ResponseEntity.ok(teacherService.getClassDetails(authentication.getName(), classId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/me/reports")
    public ResponseEntity<?> getReports() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(java.util.Map.of("message", "Vui lòng đăng nhập"));
        }
        try {
            return ResponseEntity.ok(teacherService.getReports(authentication.getName()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }
}
