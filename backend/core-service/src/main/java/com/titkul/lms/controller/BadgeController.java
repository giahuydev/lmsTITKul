package com.titkul.lms.controller;

import com.titkul.lms.entity.Badge;
import com.titkul.lms.repository.BadgeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class BadgeController {

    private final BadgeRepository badgeRepository;

    @GetMapping("/api/v1/badges")
    public ResponseEntity<List<Badge>> list() {
        return ResponseEntity.ok(badgeRepository.findAll());
    }
}
