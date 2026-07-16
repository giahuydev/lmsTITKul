package com.titkul.lms.service;

import com.titkul.lms.constant.AppConstants;
import com.titkul.lms.dto.AdminUserDto;
import com.titkul.lms.dto.CreateUserDto;
import com.titkul.lms.entity.*;
import com.titkul.lms.repository.*;
import com.titkul.lms.service.strategy.UserCreationStrategy;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserManagementService {

    private final UserRepository userRepository;
    private final TeacherProfileRepository teacherProfileRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final ParentProfileRepository parentProfileRepository;
    private final ClassRoomRepository classRoomRepository;
    private final com.titkul.lms.repository.ClassTransferHistoryRepository classTransferHistoryRepository;
    private final PasswordEncoder passwordEncoder;
    private final List<UserCreationStrategy> userCreationStrategies;

    @Transactional
    public User createUser(CreateUserDto dto) {
        // Username giờ được tự sinh bên trong từng UserCreationStrategy (GV+SĐT / HS+Mã HS)
        // và được kiểm tra trùng ngay tại đó, nên không cần check dto.getUsername() ở đây nữa.
        String defaultPasswordHash = passwordEncoder.encode(AppConstants.DEFAULT_PASSWORD);

        UserCreationStrategy strategy = userCreationStrategies.stream()
                .filter(s -> s.supports(dto.getRole()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Vai trò không hợp lệ hoặc không được hỗ trợ: " + dto.getRole()));

        return strategy.createUser(dto, defaultPasswordHash);
    }

    @Transactional(readOnly = true)
    public List<AdminUserDto> getAllUsers() {
        return userRepository.findAll().stream().map(user -> {
            AdminUserDto dto = new AdminUserDto();
            dto.setId(user.getId());
            dto.setUsername(user.getUsername());
            dto.setEmail(user.getEmail());
            dto.setPhone(user.getPhone());
            dto.setRole(user.getRole().name());
            dto.setStatus(user.getStatus().name());
            dto.setRequirePasswordChange(user.getRequirePasswordChange());
            dto.setLastLogin(user.getLastLogin());
            dto.setCreatedAt(user.getCreatedAt());

            if (user.getRole() == Role.HOC_SINH) {
                studentProfileRepository.findByUserId(user.getId()).ifPresent(p -> {
                    dto.setFullName(p.getFullName());
                    if (p.getClassRoom() != null) {
                        dto.setClassName(p.getClassRoom().getName());
                        dto.setClassId(p.getClassRoom().getId());
                        dto.getClassIds().add(p.getClassRoom().getId());
                    }
                });
            } else if (user.getRole() == Role.GIAO_VIEN) {
                teacherProfileRepository.findByUserId(user.getId()).ifPresent(p -> {
                    dto.setFullName(p.getFullName());
                });
            } else if (user.getRole() == Role.PHU_HUYNH) {
                parentProfileRepository.findByUserId(user.getId()).ifPresent(p -> {
                    dto.setFullName(p.getFullName());
                    List<StudentProfile> children = studentProfileRepository.findByParentId(p.getId());
                    if (children != null) {
                        children.forEach(child -> {
                            if (child.getClassRoom() != null) {
                                dto.getClassIds().add(child.getClassRoom().getId());
                            }
                        });
                    }
                });
            }
            return dto;
        }).toList();
    }

    @Transactional
    public User toggleUserStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại"));

        if (user.getStatus() == UserStatus.ACTIVE) {
            user.setStatus(UserStatus.LOCKED);
        } else {
            user.setStatus(UserStatus.ACTIVE);
        }
        return userRepository.save(user);
    }
    
    @Transactional
    public User updateUser(Long userId, User updateDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại"));
        
        if (updateDto.getPhone() != null && !updateDto.getPhone().isEmpty()) {
            user.setPhone(updateDto.getPhone());
        }
        if (updateDto.getStatus() != null) {
            user.setStatus(updateDto.getStatus());
        }
        return userRepository.save(user);
    }
    
    @Transactional
    public void transferClass(Long userId, Long newClassId, String adminUsername, TransferReason reason, String note) {
        StudentProfile profile = studentProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ học sinh"));
        ClassRoom newClass = classRoomRepository.findById(newClassId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp học"));
        User admin = userRepository.findByUsername(adminUsername)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người thực hiện"));

        ClassRoom oldClass = profile.getClassRoom();
        if (oldClass != null && oldClass.getId().equals(newClass.getId())) {
            throw new RuntimeException("Học sinh đã thuộc lớp này rồi.");
        }

        ClassTransferHistory history = new ClassTransferHistory();
        history.setStudent(profile);
        history.setOldClass(oldClass);
        history.setNewClass(newClass);
        history.setOldAcademicYear(oldClass != null ? oldClass.getAcademicYear().getName() : null);
        history.setNewAcademicYear(newClass.getAcademicYear().getName());
        history.setReason(reason != null ? reason : TransferReason.DOI_LOP);
        history.setNote(note);
        history.setPerformedBy(admin);
        classTransferHistoryRepository.save(history);

        profile.setClassRoom(newClass);
        studentProfileRepository.save(profile);
    }
}
