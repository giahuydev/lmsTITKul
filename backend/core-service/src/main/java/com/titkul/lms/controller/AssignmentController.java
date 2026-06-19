package com.titkul.lms.controller;

import com.titkul.lms.entity.Assignment;
import com.titkul.lms.service.AssignmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/assignments")
@RequiredArgsConstructor
public class AssignmentController {

    private final AssignmentService assignmentService;

    @org.springframework.security.access.prepost.PreAuthorize("hasRole('GIAO_VIEN') or hasRole('QUAN_TRI_VIEN')")
    @PostMapping
    public ResponseEntity<Assignment> createAssignment(@RequestBody com.titkul.lms.dto.AssignmentRequestDTO dto) {
        return ResponseEntity.ok(assignmentService.createAssignment(dto));
    }

    @GetMapping
    public ResponseEntity<org.springframework.data.domain.Page<Assignment>> getAssignments(
            @RequestParam Long classId,
            @org.springframework.data.web.PageableDefault(size = 20) org.springframework.data.domain.Pageable pageable) {
        return ResponseEntity.ok(assignmentService.getAssignmentsByClassId(classId, pageable));
    }
}
