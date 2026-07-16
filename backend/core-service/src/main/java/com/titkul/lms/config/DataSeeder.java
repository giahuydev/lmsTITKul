package com.titkul.lms.config;

import com.titkul.lms.entity.LopHoc;
import com.titkul.lms.entity.Role;
import com.titkul.lms.entity.HoSoGiaoVien;
import com.titkul.lms.entity.User;
import com.titkul.lms.entity.UserStatus;
import com.titkul.lms.entity.NamHoc;
import com.titkul.lms.repository.NamHocRepository;
import com.titkul.lms.repository.LopHocRepository;
import com.titkul.lms.repository.HoSoGiaoVienRepository;
import com.titkul.lms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final HoSoGiaoVienRepository teacherProfileRepository;
    private final LopHocRepository classRoomRepository;
    private final NamHocRepository academicYearRepository;

    @Override
    public void run(String... args) throws Exception {
        if (!userRepository.existsByUsername("HS001")) {
            User user = new User();
            user.setUsername("HS001");
            user.setPasswordHash(passwordEncoder.encode("Password123!"));
            user.setRole(Role.HOC_SINH);
            user.setStatus(UserStatus.ACTIVE);
            user.setRequirePasswordChange(false);
            userRepository.save(user);
            System.out.println("====== SEEDED TEST USER: HS001 / Password123! ======");
        }

        if (!userRepository.existsByUsername("GV001")) {
            User teacherUser = new User();
            teacherUser.setUsername("GV001");
            teacherUser.setPasswordHash(passwordEncoder.encode("Password123!"));
            teacherUser.setRole(Role.GIAO_VIEN);
            teacherUser.setStatus(UserStatus.ACTIVE);
            teacherUser.setRequirePasswordChange(false);
            userRepository.save(teacherUser);
        }

        if (!userRepository.existsByUsername("AD001")) {
            User adminUser = new User();
            adminUser.setUsername("AD001");
            adminUser.setPasswordHash(passwordEncoder.encode("Password123!"));
            adminUser.setRole(Role.ADMIN);
            adminUser.setStatus(UserStatus.ACTIVE);
            adminUser.setRequirePasswordChange(false);
            userRepository.save(adminUser);
            System.out.println("====== SEEDED TEST ADMIN: AD001 / Password123! ======");
        }

        if (!userRepository.existsByUsername("PH001")) {
            User parentUser = new User();
            parentUser.setUsername("PH001");
            parentUser.setPasswordHash(passwordEncoder.encode("Password123!"));
            parentUser.setRole(Role.PHU_HUYNH);
            parentUser.setStatus(UserStatus.ACTIVE);
            parentUser.setRequirePasswordChange(false);
            userRepository.save(parentUser);
            System.out.println("====== SEEDED TEST PARENT: PH001 / Password123! ======");
        }

        // Ensure GV001 always has a HoSoGiaoVien, regardless of classroom count
        User teacherUser = userRepository.findByUsername("GV001").orElseThrow();
        HoSoGiaoVien teacherProfile = teacherProfileRepository.findByNguoiDungId(teacherUser.getId())
                .orElseGet(() -> {
                    HoSoGiaoVien p = new HoSoGiaoVien();
                    p.setNguoiDung(teacherUser);
                    p.setMaGiaoVien("GV001");
                    p.setHoTen("Nguyễn Văn GV");
                    p.setBoMon("Toán");
                    return teacherProfileRepository.save(p);
                });

        if (classRoomRepository.count() == 0) {
            NamHoc academicYear = academicYearRepository.findByTenNamHoc("2026-2027")
                    .orElseGet(() -> {
                        NamHoc newYear = new NamHoc();
                        newYear.setTenNamHoc("2026-2027");
                        newYear.setNgayBatDau(java.time.LocalDate.of(2026, 9, 5));
                        newYear.setNgayKetThuc(java.time.LocalDate.of(2027, 5, 31));
                        return academicYearRepository.save(newYear);
                    });

            LopHoc classRoom = new LopHoc();
            classRoom.setTenLop("Lớp 5A");
            classRoom.setKhoiLop((short) 5);
            classRoom.setNamHoc(academicYear);
            classRoom.setGiaoVienChuNhiem(teacherProfile);
            classRoom.setSiSoToiDa((short) 40);
            classRoomRepository.save(classRoom);

            System.out.println("====== SEEDED TEST CLASSROOM: Lớp 5A ======");
        }

        System.out.println("====== SEEDED TEST TEACHER: GV001 / Password123! ======");
    }
}
