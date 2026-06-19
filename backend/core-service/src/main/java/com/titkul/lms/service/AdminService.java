package com.titkul.lms.service;

import com.titkul.lms.dto.ImportRecordDTO;
import com.titkul.lms.dto.ImportResultDTO;
import com.titkul.lms.dto.ParsedStudentExcelRow;
import com.titkul.lms.entity.*;
import com.titkul.lms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final ExcelImportService excelImportService;
    private final UserRepository userRepository;
    private final TeacherProfileRepository teacherProfileRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final ParentProfileRepository parentProfileRepository;
    private final ClassRoomRepository classRoomRepository;
    private final ImportBatchRepository importBatchRepository;
    private final SystemConfigRepository systemConfigRepository;
    private final PasswordEncoder passwordEncoder;
    private final ObjectMapper objectMapper;

    @Transactional
    public ImportResultDTO importStudentsAndParents(MultipartFile file) {
        List<ParsedStudentExcelRow> parsedRows = excelImportService.parseStudentImportFile(file);
        
        ImportResultDTO result = new ImportResultDTO();
        result.setTotalRows(parsedRows.size());
        
        List<ImportRecordDTO> failures = new ArrayList<>();
        int successCount = 0;
        int failureCount = 0;
        
        String defaultPasswordHash = passwordEncoder.encode("Password123!");

        Map<String, ClassRoom> classCache = new HashMap<>();
        Map<String, ParentProfile> parentCache = new HashMap<>();

        for (ParsedStudentExcelRow row : parsedRows) {
            if (!row.isValid()) {
                failures.add(new ImportRecordDTO(row.getRowNumber(), row.getStudentCode(), row.getStudentName(), row.getErrorMsg()));
                failureCount++;
                continue;
            }

            try {
                String rawName = row.getClassName().trim();
                
                ClassRoom classRoom = classCache.computeIfAbsent(rawName, name -> {
                    // 1. Thử tìm chính xác
                    ClassRoom found = classRoomRepository.findByName(name).orElse(null);
                    
                    // 2. Nếu không thấy, và tên chưa có chữ "Lớp", thử thêm chữ "Lớp "
                    if (found == null && !name.toLowerCase().startsWith("lớp ")) {
                        found = classRoomRepository.findByName("Lớp " + name).orElse(null);
                    }
                    
                    // 3. Nếu không thấy, và tên có chữ "Lớp ", thử bỏ chữ "Lớp "
                    if (found == null && name.toLowerCase().startsWith("lớp ")) {
                        found = classRoomRepository.findByName(name.substring(4).trim()).orElse(null);
                    }
                    
                    return found;
                });
                
                if (classRoom == null) {
                    classRoom = new ClassRoom();
                    classRoom.setName(row.getClassName());
                    
                    short grade = 1;
                    for (char c : row.getClassName().toCharArray()) {
                        if (Character.isDigit(c)) {
                            grade = (short) Character.getNumericValue(c);
                            break;
                        }
                    }
                    classRoom.setGrade(grade);
                    classRoom.setAcademicYear("2026-2027"); // TODO: Lấy từ config hệ thống
                    classRoom.setMaxCapacity((short) 40);
                    classRoom.setStatus(ClassStatus.ACTIVE);
                    
                    classRoom = classRoomRepository.save(classRoom);
                    classCache.put(rawName, classRoom);
                }
                
                // Check if student exists
                if (userRepository.existsByUsername(row.getStudentCode())) {
                    throw new RuntimeException("Mã học sinh (Username) đã tồn tại trong hệ thống.");
                }

                // 2. Process Parent
                String parentPhone = row.getParentPhone(); 
                ParentProfile parentProfile = parentCache.get(parentPhone);
                
                if (parentProfile == null) {
                    Optional<User> existingParentUser = userRepository.findByUsername(parentPhone);
                    if (existingParentUser.isPresent()) {
                        parentProfile = parentProfileRepository.findByUserId(existingParentUser.get().getId())
                            .orElseThrow(() -> new RuntimeException("Dữ liệu lỗi: SĐT đã tồn tại nhưng không phải phụ huynh."));
                    } else {
                        // Create new Parent User
                        User pUser = new User();
                        pUser.setUsername(parentPhone);
                        pUser.setPhone(parentPhone);
                        pUser.setPasswordHash(defaultPasswordHash);
                        pUser.setRole(Role.PHU_HUYNH);
                        pUser.setStatus(UserStatus.ACTIVE);
                        pUser.setRequirePasswordChange(true);
                        
                        String pEmail = row.getParentEmail();
                        if (pEmail != null && !pEmail.trim().isEmpty()) {
                            pUser.setEmail(pEmail.trim());
                        }

                        pUser = userRepository.save(pUser);
                        
                        parentProfile = new ParentProfile();
                        parentProfile.setUser(pUser);
                        parentProfile.setFullName(row.getParentName());
                        parentProfile.setNotificationEmail(row.getParentEmail());
                        parentProfile = parentProfileRepository.save(parentProfile);
                    }
                    parentCache.put(parentPhone, parentProfile);
                }

                // 3. Process Student
                User sUser = new User();
                sUser.setUsername(row.getStudentCode());
                sUser.setPasswordHash(defaultPasswordHash);
                sUser.setRole(Role.HOC_SINH);
                sUser.setStatus(UserStatus.ACTIVE);
                sUser.setRequirePasswordChange(true);
                
                // Gán email mẫu cho Học sinh theo yêu cầu của nhà trường
                sUser.setEmail("hs" + row.getStudentCode().toLowerCase() + "@titkul.edu.vn");

                sUser = userRepository.save(sUser);
                
                StudentProfile studentProfile = new StudentProfile();
                studentProfile.setUser(sUser);
                studentProfile.setStudentCode(row.getStudentCode());
                studentProfile.setFullName(row.getStudentName());
                studentProfile.setDateOfBirth(row.getStudentDob());
                studentProfile.setClassRoom(classRoom);
                studentProfile.setParent(parentProfile);
                studentProfileRepository.save(studentProfile);
                
                successCount++;

            } catch (Exception e) {
                failures.add(new ImportRecordDTO(row.getRowNumber(), row.getStudentCode(), row.getStudentName(), e.getMessage()));
                failureCount++;
            }
        }
        
        result.setSuccessCount(successCount);
        result.setFailureCount(failureCount);
        result.setFailures(failures);

        // Lưu lịch sử Import
        try {
            ImportBatch batch = new ImportBatch();
            batch.setImportType("TAI_KHOAN");
            batch.setFileName(file.getOriginalFilename());
            batch.setSuccessCount(successCount);
            if (failureCount > 0) {
                batch.setStatus(successCount == 0 ? "THAT_BAI" : "DANG_XU_LY");
            } else {
                batch.setStatus("THANH_CONG");
            }
            batch.setErrorDetails(objectMapper.writeValueAsString(failures));
            
            Map<String, Object> summary = new HashMap<>();
            summary.put("total", parsedRows.size());
            summary.put("success", successCount);
            summary.put("failure", failureCount);
            batch.setSummary(objectMapper.writeValueAsString(summary));
            
            // Giả lập lấy User Admin đang thao tác (Vì chưa có lấy từ token JWT)
            userRepository.findByUsername("AD001").ifPresent(batch::setExecutedBy);
            
            importBatchRepository.save(batch);
        } catch (Exception ex) {
            ex.printStackTrace();
        }

        return result;
    }

    public ImportResultDTO importTeachers(MultipartFile file) {
        List<com.titkul.lms.dto.ParsedTeacherExcelRow> parsedRows = excelImportService.parseTeacherImportFile(file);
        
        ImportResultDTO result = new ImportResultDTO();
        result.setTotalRows(parsedRows.size());
        
        List<ImportRecordDTO> failures = new ArrayList<>();
        int successCount = 0;
        int failureCount = 0;
        
        String defaultPasswordHash = passwordEncoder.encode("Password123!");

        for (com.titkul.lms.dto.ParsedTeacherExcelRow row : parsedRows) {
            if (!row.isValid()) {
                failures.add(new ImportRecordDTO(row.getRowNumber(), row.getTeacherCode(), row.getFullName(), row.getErrorMsg()));
                failureCount++;
                continue;
            }

            try {
                if (userRepository.existsByUsername(row.getTeacherCode())) {
                    throw new RuntimeException("Mã giáo viên đã tồn tại.");
                }

                User user = new User();
                user.setUsername(row.getTeacherCode());
                user.setPasswordHash(defaultPasswordHash);
                user.setRole(Role.GIAO_VIEN);
                user.setStatus(UserStatus.ACTIVE);
                user.setRequirePasswordChange(true);
                if (row.getPhone() != null && !row.getPhone().trim().isEmpty()) {
                    user.setPhone(row.getPhone());
                }
                user = userRepository.save(user);

                TeacherProfile profile = new TeacherProfile();
                profile.setUser(user);
                profile.setFullName(row.getFullName());
                profile.setDepartment(row.getDepartment());
                profile.setDateOfBirth(row.getDateOfBirth());
                teacherProfileRepository.save(profile);

                successCount++;
            } catch (Exception e) {
                failures.add(new ImportRecordDTO(row.getRowNumber(), row.getTeacherCode(), row.getFullName(), e.getMessage()));
                failureCount++;
            }
        }
        
        result.setSuccessCount(successCount);
        result.setFailureCount(failureCount);
        result.setFailures(failures);
        return result;
    }

    @Transactional
    public User createUser(com.titkul.lms.dto.CreateUserDto dto) {
        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new RuntimeException("Tên đăng nhập (Username) đã tồn tại.");
        }

        String defaultPasswordHash = passwordEncoder.encode("Password123!");
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setPasswordHash(defaultPasswordHash);
        user.setStatus(UserStatus.ACTIVE);
        user.setRequirePasswordChange(true);

        if (dto.getRole().equals("GIAO_VIEN")) {
            user.setRole(Role.GIAO_VIEN);
            if (dto.getPhone() != null) user.setPhone(dto.getPhone());
            user = userRepository.save(user);

            TeacherProfile tp = new TeacherProfile();
            tp.setUser(user);
            tp.setFullName(dto.getFullName());
            tp.setDepartment(dto.getDepartment());
            tp.setDateOfBirth(dto.getDateOfBirth());
            teacherProfileRepository.save(tp);
        } else if (dto.getRole().equals("HOC_SINH")) {
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
        } else {
            throw new RuntimeException("Vai trò không hợp lệ: " + dto.getRole());
        }

        return user;
    }

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public List<com.titkul.lms.dto.AdminUserDto> getAllUsers() {
        return userRepository.findAll().stream().map(user -> {
            com.titkul.lms.dto.AdminUserDto dto = new com.titkul.lms.dto.AdminUserDto();
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
                    java.util.List<StudentProfile> children = studentProfileRepository.findByParentId(p.getId());
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
    
    public User updateUser(Long userId, com.titkul.lms.entity.User updateDto) {
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
    
    public void transferClass(Long userId, Long newClassId) {
        StudentProfile profile = studentProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ học sinh"));
        ClassRoom newClass = classRoomRepository.findById(newClassId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp học"));
        profile.setClassRoom(newClass);
        studentProfileRepository.save(profile);
    }

    public SystemConfig getSystemConfig() {
        return systemConfigRepository.findAll().stream().findFirst().orElseGet(() -> {
            SystemConfig config = new SystemConfig();
            config.setId(1L);
            return config;
        });
    }

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

    public com.titkul.lms.dto.AdminDashboardDto getDashboardStats() {
        long totalStudents = studentProfileRepository.count();
        long totalTeachers = teacherProfileRepository.count();
        long totalParents = parentProfileRepository.count();
        long totalClasses = classRoomRepository.count();
        long activeClasses = classRoomRepository.countByStatus(com.titkul.lms.entity.ClassStatus.ACTIVE);

        java.util.List<String> warnings = new ArrayList<>();
        // Đếm số lượng học sinh chưa có lớp
        long studentsWithoutClass = studentProfileRepository.findAll().stream()
                .filter(s -> s.getClassRoom() == null).count();
        if (studentsWithoutClass > 0) {
            warnings.add(studentsWithoutClass + " Học sinh chưa được phân lớp. Vui lòng phân bổ học sinh mới import vào lớp học.");
        }
        
        // Đếm số lượng lớp học chưa có GVCN
        long classesWithoutTeacher = classRoomRepository.findAll().stream()
                .filter(c -> c.getHomeroomTeacher() == null).count();
        if (classesWithoutTeacher > 0) {
            warnings.add(classesWithoutTeacher + " Lớp học chưa có Giáo viên chủ nhiệm.");
        }
        
        if (warnings.isEmpty()) {
            warnings.add("Hệ thống hoạt động ổn định, không có cảnh báo nào.");
        }

        // Mock Traffic Data (Trong thực tế sẽ query từ Log Database hoặc Redis)
        java.util.List<Integer> mockTraffic = java.util.Arrays.asList(120, 200, 150, 300, 250, 400, 380);

        return com.titkul.lms.dto.AdminDashboardDto.builder()
                .totalStudents(totalStudents)
                .totalTeachers(totalTeachers)
                .totalParents(totalParents)
                .totalClasses(totalClasses)
                .activeClasses(activeClasses)
                .trafficData(mockTraffic)
                .systemWarnings(warnings)
                .build();
    }
}
