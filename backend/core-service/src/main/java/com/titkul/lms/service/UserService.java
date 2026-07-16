package com.titkul.lms.service;

import com.titkul.lms.dto.UserProfileDto;
import com.titkul.lms.entity.User;
import com.titkul.lms.repository.HoSoPhuHuynhRepository;
import com.titkul.lms.repository.HoSoHocSinhRepository;
import com.titkul.lms.repository.HoSoGiaoVienRepository;
import com.titkul.lms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final HoSoHocSinhRepository studentProfileRepository;
    private final HoSoGiaoVienRepository teacherProfileRepository;
    private final HoSoPhuHuynhRepository parentProfileRepository;

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
                studentProfileRepository.findByNguoiDungId(user.getId()).ifPresent(profile -> {
                    dto.setFullName(profile.getHoTen());
                });
                break;
            case GIAO_VIEN:
                teacherProfileRepository.findByNguoiDungId(user.getId()).ifPresent(profile -> {
                    dto.setFullName(profile.getHoTen());
                });
                break;
            case PHU_HUYNH:
                parentProfileRepository.findByNguoiDungId(user.getId()).ifPresent(profile -> {
                    dto.setFullName(profile.getHoTen());
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
