package com.titkul.lms.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.titkul.lms.constant.AppConstants;
import com.titkul.lms.dto.ImportRecordDTO;
import com.titkul.lms.dto.ImportResultDTO;
import com.titkul.lms.dto.ParsedStudentExcelRow;
import com.titkul.lms.dto.ParsedTeacherExcelRow;
import com.titkul.lms.entity.*;
import com.titkul.lms.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminService {

    private final ExcelImportService excelImportService;
    private final UserRepository userRepository;
    private final TeacherProfileRepository teacherProfileRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final ParentProfileRepository parentProfileRepository;
    private final ClassRoomRepository classRoomRepository;
    private final ImportBatchRepository importBatchRepository;
    private final AcademicYearRepository academicYearRepository;
    private final PasswordEncoder passwordEncoder;
    private final ObjectMapper objectMapper;

    @Transactional
    public ImportResultDTO importStudentsAndParents(MultipartFile file) {
        List<ParsedStudentExcelRow> parsedRows = excelImportService.parseStudentImportFile(file);

        String defaultPasswordHash = passwordEncoder.encode(AppConstants.DEFAULT_PASSWORD);
        Map<String, ClassRoom> classCache = new HashMap<>();
        Map<String, ParentProfile> parentCache = new HashMap<>();

        List<ImportRecordDTO> failures = new ArrayList<>();
        int successCount = 0;

        for (ParsedStudentExcelRow row : parsedRows) {
            if (!row.isValid()) {
                failures.add(toFailRecord(row.getRowNumber(), row.getStudentCode(), row.getStudentName(), row.getErrorMsg()));
                continue;
            }
            try {
                ClassRoom classRoom = resolveClassRoom(row.getClassName(), classCache);

                if (userRepository.existsByUsername(row.getStudentCode())) {
                    throw new RuntimeException("Mã học sinh (Username) đã tồn tại trong hệ thống.");
                }

                ParentProfile parentProfile = resolveOrCreateParent(row, parentCache, defaultPasswordHash);
                createStudent(row, classRoom, parentProfile, defaultPasswordHash);
                successCount++;
            } catch (Exception e) {
                failures.add(toFailRecord(row.getRowNumber(), row.getStudentCode(), row.getStudentName(), e.getMessage()));
            }
        }

        ImportResultDTO result = buildResult(parsedRows.size(), successCount, failures);
        saveImportBatch("TAI_KHOAN", file.getOriginalFilename(), result, failures);
        return result;
    }

    public ImportResultDTO importTeachers(MultipartFile file) {
        List<ParsedTeacherExcelRow> parsedRows = excelImportService.parseTeacherImportFile(file);
        String defaultPasswordHash = passwordEncoder.encode(AppConstants.DEFAULT_PASSWORD);

        List<ImportRecordDTO> failures = new ArrayList<>();
        int successCount = 0;

        for (ParsedTeacherExcelRow row : parsedRows) {
            if (!row.isValid()) {
                failures.add(toFailRecord(row.getRowNumber(), row.getTeacherCode(), row.getFullName(), row.getErrorMsg()));
                continue;
            }
            try {
                if (userRepository.existsByUsername(row.getTeacherCode())) {
                    throw new RuntimeException("Mã giáo viên đã tồn tại.");
                }
                createTeacher(row, defaultPasswordHash);
                successCount++;
            } catch (Exception e) {
                failures.add(toFailRecord(row.getRowNumber(), row.getTeacherCode(), row.getFullName(), e.getMessage()));
            }
        }

        return buildResult(parsedRows.size(), successCount, failures);
    }

    // ── Private helpers ───────────────────────────────────────────────────────────

    private ClassRoom resolveClassRoom(String rawName, Map<String, ClassRoom> cache) {
        return cache.computeIfAbsent(rawName.trim(), name -> {
            ClassRoom found = classRoomRepository.findByName(name).orElse(null);
            if (found == null && !name.toLowerCase().startsWith("lớp ")) {
                found = classRoomRepository.findByName("Lớp " + name).orElse(null);
            }
            if (found == null && name.toLowerCase().startsWith("lớp ")) {
                found = classRoomRepository.findByName(name.substring(4).trim()).orElse(null);
            }
            return found != null ? found : createClassRoom(name);
        });
    }

    private ClassRoom createClassRoom(String name) {
        ClassRoom cls = new ClassRoom();
        cls.setName(name);
        cls.setGrade(extractGrade(name));
        cls.setAcademicYear(resolveCurrentAcademicYear());
        cls.setMaxCapacity((short) 40);
        cls.setStatus(ClassStatus.ACTIVE);
        return classRoomRepository.save(cls);
    }

    private short extractGrade(String className) {
        for (char c : className.toCharArray()) {
            if (Character.isDigit(c)) return (short) Character.getNumericValue(c);
        }
        return 1;
    }

    private AcademicYear resolveCurrentAcademicYear() {
        return academicYearRepository.findByName("2026-2027").orElseGet(() -> {
            AcademicYear y = new AcademicYear();
            y.setName("2026-2027");
            y.setStartDate(java.time.LocalDate.of(2026, 9, 5));
            y.setEndDate(java.time.LocalDate.of(2027, 5, 31));
            return academicYearRepository.save(y);
        });
    }

    private ParentProfile resolveOrCreateParent(ParsedStudentExcelRow row, Map<String, ParentProfile> cache, String passwordHash) {
        String phone = row.getParentPhone();
        if (cache.containsKey(phone)) return cache.get(phone);

        Optional<User> existingUser = userRepository.findByUsername(phone);
        ParentProfile profile;

        if (existingUser.isPresent()) {
            profile = parentProfileRepository.findByUserId(existingUser.get().getId())
                    .orElseThrow(() -> new RuntimeException("Dữ liệu lỗi: SĐT đã tồn tại nhưng không phải phụ huynh."));
        } else {
            User pUser = new User();
            pUser.setUsername(phone);
            pUser.setPhone(phone);
            pUser.setPasswordHash(passwordHash);
            pUser.setRole(Role.PHU_HUYNH);
            pUser.setStatus(UserStatus.ACTIVE);
            pUser.setRequirePasswordChange(true);
            String email = row.getParentEmail();
            if (email != null && !email.trim().isEmpty()) pUser.setEmail(email.trim());
            pUser = userRepository.save(pUser);

            profile = new ParentProfile();
            profile.setUser(pUser);
            profile.setFullName(row.getParentName());
            profile.setNotificationEmail(row.getParentEmail());
            profile = parentProfileRepository.save(profile);
        }

        cache.put(phone, profile);
        return profile;
    }

    private void createStudent(ParsedStudentExcelRow row, ClassRoom cls, ParentProfile parent, String passwordHash) {
        User sUser = new User();
        sUser.setUsername(row.getStudentCode());
        sUser.setPasswordHash(passwordHash);
        sUser.setRole(Role.HOC_SINH);
        sUser.setStatus(UserStatus.ACTIVE);
        sUser.setRequirePasswordChange(true);
        sUser.setEmail("hs" + row.getStudentCode().toLowerCase() + "@titkul.edu.vn");
        sUser = userRepository.save(sUser);

        StudentProfile student = new StudentProfile();
        student.setUser(sUser);
        student.setStudentCode(row.getStudentCode());
        student.setFullName(row.getStudentName());
        student.setDateOfBirth(row.getStudentDob());
        student.setClassRoom(cls);
        student.setParent(parent);
        studentProfileRepository.save(student);
    }

    private void createTeacher(ParsedTeacherExcelRow row, String passwordHash) {
        User user = new User();
        user.setUsername(row.getTeacherCode());
        user.setPasswordHash(passwordHash);
        user.setRole(Role.GIAO_VIEN);
        user.setStatus(UserStatus.ACTIVE);
        user.setRequirePasswordChange(true);
        if (row.getPhone() != null && !row.getPhone().trim().isEmpty()) user.setPhone(row.getPhone());
        user = userRepository.save(user);

        TeacherProfile profile = new TeacherProfile();
        profile.setUser(user);
        profile.setTeacherCode(row.getTeacherCode());
        profile.setFullName(row.getFullName());
        profile.setDepartment(row.getDepartment());
        profile.setDateOfBirth(row.getDateOfBirth());
        teacherProfileRepository.save(profile);
    }

    private ImportResultDTO buildResult(int total, int successCount, List<ImportRecordDTO> failures) {
        ImportResultDTO result = new ImportResultDTO();
        result.setTotalRows(total);
        result.setSuccessCount(successCount);
        result.setFailureCount(failures.size());
        result.setFailures(failures);
        return result;
    }

    private ImportRecordDTO toFailRecord(int row, String code, String name, String msg) {
        return new ImportRecordDTO(row, code, name, msg);
    }

    private void saveImportBatch(String type, String fileName, ImportResultDTO result, List<ImportRecordDTO> failures) {
        try {
            ImportBatch batch = new ImportBatch();
            batch.setImportType(type);
            batch.setFileName(fileName);
            batch.setSuccessCount(result.getSuccessCount());
            batch.setStatus(resolveStatus(result.getSuccessCount(), result.getFailureCount()));
            batch.setErrorDetails(objectMapper.writeValueAsString(failures));
            batch.setSummary(objectMapper.writeValueAsString(Map.of(
                    "total", result.getTotalRows(),
                    "success", result.getSuccessCount(),
                    "failure", result.getFailureCount()
            )));
            userRepository.findByUsername("AD001").ifPresent(batch::setExecutedBy);
            importBatchRepository.save(batch);
        } catch (Exception ex) {
            log.warn("Failed to save import batch log", ex);
        }
    }

    private String resolveStatus(int success, int failure) {
        if (failure == 0) return "THANH_CONG";
        if (success == 0) return "THAT_BAI";
        return "DANG_XU_LY";
    }
}
