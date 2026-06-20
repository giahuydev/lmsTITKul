package com.titkul.lms.service;

import com.titkul.lms.entity.SystemConfig;
import com.titkul.lms.repository.SystemConfigRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SystemConfigService {

    private final SystemConfigRepository systemConfigRepository;

    @Transactional(readOnly = true)
    public SystemConfig getSystemConfig() {
        return systemConfigRepository.findAll().stream().findFirst().orElseGet(() -> {
            SystemConfig config = new SystemConfig();
            config.setId(1L);
            return config;
        });
    }

    @Transactional
    public SystemConfig updateSystemConfig(SystemConfig newConfig) {
        SystemConfig config = getSystemConfig();
        config.setSchoolName(newConfig.getSchoolName());
        config.setAcademicYear(newConfig.getAcademicYear());
        config.setAcademicYearLegacy(newConfig.getAcademicYear());
        config.setCurrentSemester(newConfig.getCurrentSemester());
        config.setLogoUrl(newConfig.getLogoUrl());
        
        if (newConfig.getGrades() != null) {
            config.setGrades(newConfig.getGrades());
        }
        if (newConfig.getSubjects() != null) {
            config.setSubjects(newConfig.getSubjects());
        }
        
        return systemConfigRepository.save(config);
    }
}
