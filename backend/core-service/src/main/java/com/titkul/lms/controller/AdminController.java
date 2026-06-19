package com.titkul.lms.controller;

import com.titkul.lms.dto.ImportResultDTO;
import com.titkul.lms.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.jdbc.core.JdbcTemplate;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final JdbcTemplate jdbcTemplate;

    @GetMapping("/db-debug")
    public ResponseEntity<?> getDbDebug() {
        return ResponseEntity.ok(jdbcTemplate.queryForList("SHOW TRIGGERS LIKE 'phieu_ho_tro'"));
    }

    @PostMapping("/import/users")
    public ResponseEntity<?> importUsers(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        ImportResultDTO result = adminService.importStudentsAndParents(file);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/import/teachers")
    public ResponseEntity<?> importTeachers(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        ImportResultDTO result = adminService.importTeachers(file);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/users")
    public ResponseEntity<?> createUser(@RequestBody com.titkul.lms.dto.CreateUserDto dto) {
        try {
            return ResponseEntity.ok(adminService.createUser(dto));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<?> toggleUserStatus(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(adminService.toggleUserStatus(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody com.titkul.lms.entity.User updateDto) {
        try {
            return ResponseEntity.ok(adminService.updateUser(id, updateDto));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/users/{id}/transfer-class")
    public ResponseEntity<?> transferClass(@PathVariable Long id, @RequestParam Long newClassId) {
        try {
            adminService.transferClass(id, newClassId);
            return ResponseEntity.ok(java.util.Map.of("message", "Chuyển lớp thành công"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/config")
    public ResponseEntity<?> getSystemConfig() {
        return ResponseEntity.ok(adminService.getSystemConfig());
    }

    @PutMapping("/config")
    public ResponseEntity<?> updateSystemConfig(@RequestBody com.titkul.lms.entity.SystemConfig config) {
        return ResponseEntity.ok(adminService.updateSystemConfig(config));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }
}
