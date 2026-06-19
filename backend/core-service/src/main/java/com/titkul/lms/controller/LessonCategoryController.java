package com.titkul.lms.controller;

import com.titkul.lms.entity.LessonCategory;
import com.titkul.lms.service.LessonCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/lesson-categories")
@RequiredArgsConstructor
public class LessonCategoryController {

    private final LessonCategoryService lessonCategoryService;

    @GetMapping
    public ResponseEntity<List<LessonCategory>> getAllCategories() {
        return ResponseEntity.ok(lessonCategoryService.getAllCategories());
    }
}
