package com.titkul.lms.config;

import com.titkul.lms.entity.*;
import com.titkul.lms.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

@Configuration
public class DataSeederConfig {

    @Bean
    public CommandLineRunner autoSeedTeacher(
            UserRepository userRepo,
            TeacherProfileRepository teacherRepo,
            ClassRoomRepository classRepo,
            PasswordEncoder encoder) {
        return args -> {
            try {
                User gvUser = userRepo.findByUsername("GV001").orElse(null);
                if (gvUser == null) {
                    gvUser = new User();
                    gvUser.setUsername("GV001");
                    gvUser.setPasswordHash(encoder.encode("Password123!"));
                    gvUser.setRole(Role.GIAO_VIEN);
                    gvUser.setStatus(UserStatus.ACTIVE);
                    gvUser = userRepo.save(gvUser);
                    System.out.println("Auto-Seeder: Created User GV001");
                }

                TeacherProfile profile = teacherRepo.findByUserId(gvUser.getId()).orElse(null);
                if (profile == null) {
                    profile = new TeacherProfile();
                    profile.setUser(gvUser);
                    profile.setFullName("Nguyễn Thị Lan (Giáo viên)");
                    profile.setDepartment("Toán, Tiếng Việt");
                    profile = teacherRepo.save(profile);
                    System.out.println("Auto-Seeder: Created TeacherProfile for GV001");
                }

                Optional<ClassRoom> clsOpt = classRepo.findByName("5A1");
                if (clsOpt.isPresent()) {
                    ClassRoom cls = clsOpt.get();
                    if (cls.getHomeroomTeacher() == null || !cls.getHomeroomTeacher().getId().equals(profile.getId())) {
                        cls.setHomeroomTeacher(profile);
                        classRepo.save(cls);
                        System.out.println("Auto-Seeder: Assigned GV001 to class 5A1");
                    }
                }
            } catch (Exception e) {
                System.out.println("Auto-Seeder encountered an error: " + e.getMessage());
            }
        };
    }
}
