package com.titkul.lms.service.strategy;

import com.titkul.lms.dto.CreateUserDto;
import com.titkul.lms.entity.Role;
import com.titkul.lms.entity.HoSoGiaoVien;
import com.titkul.lms.entity.User;
import com.titkul.lms.entity.UserStatus;
import com.titkul.lms.repository.HoSoGiaoVienRepository;
import com.titkul.lms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class TeacherCreationStrategy implements UserCreationStrategy {

    private final UserRepository userRepository;
    private final HoSoGiaoVienRepository teacherProfileRepository;

    @Override
    public boolean supports(String roleStr) {
        return "GIAO_VIEN".equals(roleStr);
    }

    @Override
    @Transactional
    public User createUser(CreateUserDto dto, String defaultPasswordHash) {
        if (dto.getPhone() == null || dto.getPhone().isBlank()) {
            throw new IllegalArgumentException("Số điện thoại là bắt buộc để tạo tài khoản Giáo viên.");
        }

        String username = "GV" + dto.getPhone();
        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Đã tồn tại tài khoản Giáo viên với số điện thoại này.");
        }

        User user = new User();
        user.setUsername(username);
        user.setPasswordHash(defaultPasswordHash);
        user.setStatus(UserStatus.ACTIVE);
        user.setRequirePasswordChange(true);
        user.setRole(Role.GIAO_VIEN);
        user.setPhone(dto.getPhone());

        user = userRepository.save(user);

        HoSoGiaoVien tp = new HoSoGiaoVien();
        tp.setNguoiDung(user);
        tp.setHoTen(dto.getFullName());
        tp.setBoMon(dto.getDepartment());
        tp.setNgaySinh(dto.getDateOfBirth());
        teacherProfileRepository.save(tp);

        return user;
    }
}
