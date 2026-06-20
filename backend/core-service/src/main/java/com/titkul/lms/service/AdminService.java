package com.titkul.lms.service;

import com.titkul.lms.constant.AppConstants;

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
        
        String defaultPasswordHash = passwordEncoder.encode(AppConstants.DEFAULT_PASSWORD);

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
        
        String defaultPasswordHash = passwordEncoder.encode(AppConstants.DEFAULT_PASSWORD);

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

}
