package com.titkul.lms.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class CreateUserDto {
    private String role; // GIAO_VIEN, HOC_SINH
    
    // Common
    private String username;
    private String fullName;
    private LocalDate dateOfBirth;
    
    // Teacher specific
    private String department;
    private String phone; // used for teacher phone or parent phone
    
    // Student specific
    private Long classId;
    
    // Parent info (if creating Student)
    private String parentName;
    private String parentPhone;
}
