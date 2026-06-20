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
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setPasswordHash(defaultPasswordHash);
        user.setStatus(UserStatus.ACTIVE);
        user.setRequirePasswordChange(true);
        user.setRole(Role.HOC_SINH);
        
        user = userRepository.save(user);

        ClassRoom classRoom = null;
        if (dto.getClassId() != null) {
            classRoom = classRoomRepository.findById(dto.getClassId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Lớp học"));
        }

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
        sp.setStudentCode(dto.getUsername());
        sp.setFullName(dto.getFullName());
        sp.setDateOfBirth(dto.getDateOfBirth());
        sp.setClassRoom(classRoom);
        sp.setParent(parentProfile);
        studentProfileRepository.save(sp);
        
        return user;
    }
}
