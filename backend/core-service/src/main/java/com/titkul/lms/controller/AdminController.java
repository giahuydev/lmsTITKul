package com.titkul.lms.controller;

import com.titkul.lms.dto.ImportResultDTO;
import com.titkul.lms.service.AdminService;
import com.titkul.lms.service.AdminDashboardService;
import com.titkul.lms.service.SystemConfigService;
import com.titkul.lms.service.UserManagementService;
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
    private final UserManagementService userManagementService;
    private final SystemConfigService systemConfigService;
    private final AdminDashboardService adminDashboardService;
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
            return ResponseEntity.ok(userManagementService.createUser(dto));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userManagementService.getAllUsers());
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<?> toggleUserStatus(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(userManagementService.toggleUserStatus(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody com.titkul.lms.entity.NguoiDung updateDto) {
        try {
            return ResponseEntity.ok(userManagementService.updateUser(id, updateDto));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/users/{id}/transfer-class")
    public ResponseEntity<?> transferClass(
            @PathVariable Long id,
            @RequestParam Long newClassId,
            @RequestParam(required = false) String reason,
            @RequestParam(required = false) String note) {
        org.springframework.security.core.Authentication authentication =
                org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(java.util.Map.of("message", "Vui lòng đăng nhập"));
        }
        try {
            com.titkul.lms.entity.TransferReason transferReason = reason != null
                    ? com.titkul.lms.entity.TransferReason.valueOf(reason)
                    : null;
            userManagementService.transferClass(id, newClassId, authentication.getName(), transferReason, note);
            return ResponseEntity.ok(java.util.Map.of("message", "Chuyển lớp thành công"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/config")
    public ResponseEntity<?> getSystemConfig() {
        return ResponseEntity.ok(systemConfigService.getSystemConfig());
    }

    @PutMapping("/config")
    public ResponseEntity<?> updateSystemConfig(@RequestBody com.titkul.lms.entity.SystemConfig config) {
        return ResponseEntity.ok(systemConfigService.updateSystemConfig(config));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardStats() {
        return ResponseEntity.ok(adminDashboardService.getDashboardStats());
    }
}
