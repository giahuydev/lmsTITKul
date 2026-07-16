package com.titkul.lms.service.strategy;

import com.titkul.lms.dto.CreateUserDto;
import com.titkul.lms.entity.*;
import com.titkul.lms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class StudentCreationStrategy implements UserCreationStrategy {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final ParentProfileRepository parentProfileRepository;
    private final ClassRoomRepository classRoomRepository;

    @Override
    public boolean supports(String roleStr) {
        return "HOC_SINH".equals(roleStr);
    }

    @Override
    @Transactional
    public User createUser(CreateUserDto dto, String defaultPasswordHash) {
        if (dto.getStudentCode() == null || dto.getStudentCode().isBlank()) {
            throw new IllegalArgumentException("Mã học sinh là bắt buộc để tạo tài khoản Học sinh.");
        }
        if (studentProfileRepository.findByStudentCode(dto.getStudentCode()).isPresent()) {
            throw new RuntimeException("Mã học sinh này đã tồn tại.");
        }
        if (dto.getClassId() == null) {
            throw new IllegalArgumentException("Học sinh bắt buộc phải được gắn vào một lớp học.");
        }

        ClassRoom classRoom = classRoomRepository.findById(dto.getClassId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Lớp học"));
        if (classRoom.getStatus() != ClassStatus.ACTIVE) {
            throw new IllegalArgumentException("Chỉ được gắn học sinh vào lớp đang ACTIVE.");
        }

        String username = "HS" + dto.getStudentCode();
        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Đã tồn tại tài khoản Học sinh với mã này.");
        }

        User user = new User();
        user.setUsername(username);
        user.setPasswordHash(defaultPasswordHash);
        user.setStatus(UserStatus.ACTIVE);
        user.setRequirePasswordChange(true);
        user.setRole(Role.HOC_SINH);

        user = userRepository.save(user);

        ParentProfile parentProfile = null;
        if (dto.getParentPhone() != null && !dto.getParentPhone().trim().isEmpty()) {
            Optional<User> existingParent = userRepository.findByUsername(dto.getParentPhone());
            if (existingParent.isPresent()) {
                parentProfile = parentProfileRepository.findByUserId(existingParent.get().getId())
                    .orElseThrow(() -> new RuntimeException("SĐT đã dùng nhưng không phải Phụ huynh."));
            } else {
                User pUser = new User();
                pUser.setUsername(dto.getParentPhone());
                pUser.setPhone(dto.getParentPhone());
                pUser.setPasswordHash(defaultPasswordHash);
                pUser.setRole(Role.PHU_HUYNH);
                pUser.setStatus(UserStatus.ACTIVE);
                pUser.setRequirePasswordChange(true);
                pUser = userRepository.save(pUser);
                
                parentProfile = new ParentProfile();
                parentProfile.setUser(pUser);
                parentProfile.setFullName(dto.getParentName() != null ? dto.getParentName() : "Phụ huynh của " + dto.getFullName());
                parentProfile = parentProfileRepository.save(parentProfile);
            }
        }

        StudentProfile sp = new StudentProfile();
        sp.setUser(user);
        sp.setStudentCode(dto.getStudentCode());
        sp.setFullName(dto.getFullName());
        sp.setDateOfBirth(dto.getDateOfBirth());
        sp.setClassRoom(classRoom);
        sp.setParent(parentProfile);
        studentProfileRepository.save(sp);
        
        return user;
    }
}
