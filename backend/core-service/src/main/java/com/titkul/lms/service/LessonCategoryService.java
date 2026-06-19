package com.titkul.lms.service;

import com.titkul.lms.entity.LessonCategory;
import com.titkul.lms.repository.LessonCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LessonCategoryService {

    private final LessonCategoryRepository lessonCategoryRepository;

    public List<LessonCategory> getAllCategories() {
        return lessonCategoryRepository.findAll();
    }
}
