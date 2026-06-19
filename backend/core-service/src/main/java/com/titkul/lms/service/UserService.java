package com.titkul.lms.service;

import com.titkul.lms.dto.UserProfileDto;
import com.titkul.lms.entity.User;
import com.titkul.lms.repository.ParentProfileRepository;
import com.titkul.lms.repository.StudentProfileRepository;
import com.titkul.lms.repository.TeacherProfileRepository;
import com.titkul.lms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final TeacherProfileRepository teacherProfileRepository;
    private final ParentProfileRepository parentProfileRepository;

    public UserProfileDto getMyProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        UserProfileDto dto = UserProfileDto.builder()
                .username(user.getUsername())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole().name())
                .build();

        switch (user.getRole()) {
            case HOC_SINH:
                studentProfileRepository.findByUserId(user.getId()).ifPresent(profile -> {
                    dto.setFullName(profile.getFullName());
                });
                break;
            case GIAO_VIEN:
                teacherProfileRepository.findByUserId(user.getId()).ifPresent(profile -> {
                    dto.setFullName(profile.getFullName());
                });
                break;
            case PHU_HUYNH:
                parentProfileRepository.findByUserId(user.getId()).ifPresent(profile -> {
                    dto.setFullName(profile.getFullName());
                });
                break;
            case ADMIN:
                dto.setFullName("Quản trị viên");
                break;
        }

        // Set default name if not found
        if (dto.getFullName() == null || dto.getFullName().isEmpty()) {
            dto.setFullName(user.getUsername());
        }

        return dto;
    }
}
