package com.titkul.lms.service.strategy;

import com.titkul.lms.dto.CreateUserDto;
import com.titkul.lms.entity.Role;
import com.titkul.lms.entity.TeacherProfile;
import com.titkul.lms.entity.User;
import com.titkul.lms.entity.UserStatus;
import com.titkul.lms.repository.TeacherProfileRepository;
import com.titkul.lms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class TeacherCreationStrategy implements UserCreationStrategy {

    private final UserRepository userRepository;
    private final TeacherProfileRepository teacherProfileRepository;

    @Override
    public boolean supports(String roleStr) {
        return "GIAO_VIEN".equals(roleStr);
    }

    @Override
    @Transactional
    public User createUser(CreateUserDto dto, String defaultPasswordHash) {
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setPasswordHash(defaultPasswordHash);
        user.setStatus(UserStatus.ACTIVE);
        user.setRequirePasswordChange(true);
        user.setRole(Role.GIAO_VIEN);

        if (dto.getPhone() != null) {
            user.setPhone(dto.getPhone());
        }
        
        user = userRepository.save(user);

        TeacherProfile tp = new TeacherProfile();
        tp.setUser(user);
        tp.setFullName(dto.getFullName());
        tp.setDepartment(dto.getDepartment());
        tp.setDateOfBirth(dto.getDateOfBirth());
        teacherProfileRepository.save(tp);

        return user;
    }
}
