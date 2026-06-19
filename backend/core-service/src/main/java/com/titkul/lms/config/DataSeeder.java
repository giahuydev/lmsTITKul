package com.titkul.lms.config;

import com.titkul.lms.entity.ClassRoom;
import com.titkul.lms.entity.Role;
import com.titkul.lms.entity.TeacherProfile;
import com.titkul.lms.entity.User;
import com.titkul.lms.entity.UserStatus;
import com.titkul.lms.repository.ClassRoomRepository;
import com.titkul.lms.repository.TeacherProfileRepository;
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
    private final TeacherProfileRepository teacherProfileRepository;
    private final ClassRoomRepository classRoomRepository;

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
            parentUser = userRepository.save(parentUser);
            System.out.println("====== SEEDED TEST PARENT: PH001 / Password123! ======");
        }

        if (classRoomRepository.count() == 0) {
            User teacherUser = userRepository.findByUsername("GV001").orElseThrow();
            
            TeacherProfile teacherProfile = new TeacherProfile();
            teacherProfile.setUser(teacherUser);
            teacherProfile.setFullName("Nguyễn Văn GV");
            teacherProfile.setDepartment("Toán");
            teacherProfile = teacherProfileRepository.save(teacherProfile);

            ClassRoom classRoom = new ClassRoom();
            classRoom.setName("Lớp 5A");
            classRoom.setGrade((short) 5);
            classRoom.setAcademicYear("2026-2027");
            classRoom.setHomeroomTeacher(teacherProfile);
            classRoom.setMaxCapacity((short) 40);
            classRoomRepository.save(classRoom);
            
            System.out.println("====== SEEDED TEST TEACHER: GV001 / Password123! ======");
            System.out.println("====== SEEDED TEST CLASSROOM ID: " + classRoom.getId() + " ======");
            System.out.println("====== SEEDED TEST TEACHER ID: " + teacherProfile.getId() + " ======");
        }
    }
}
