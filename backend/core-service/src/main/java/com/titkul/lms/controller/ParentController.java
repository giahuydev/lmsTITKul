package com.titkul.lms.controller;

import com.titkul.lms.dto.ParentDashboardDto;
import com.titkul.lms.service.ParentService;
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
@RequestMapping("/api/v1/parents")
@RequiredArgsConstructor
public class ParentController {

    private final ParentService parentService;

    @GetMapping("/me/dashboard")
    public ResponseEntity<?> getDashboard() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(java.util.Map.of("message", "Vui lòng đăng nhập"));
        }

        try {
            ParentDashboardDto dashboard = parentService.getDashboard(authentication.getName());
            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/me/children")
    public ResponseEntity<?> getChildren() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(java.util.Map.of("message", "Vui lòng đăng nhập"));
        }
        try {
            return ResponseEntity.ok(parentService.getChildren(authentication.getName()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/me/grades")
    public ResponseEntity<?> getGrades() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(java.util.Map.of("message", "Vui lòng đăng nhập"));
        }
        try {
            return ResponseEntity.ok(parentService.getGrades(authentication.getName()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }
}
