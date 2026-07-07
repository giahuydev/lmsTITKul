package com.titkul.lms.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "ho_so_giao_vien")
@Data
@NoArgsConstructor
public class TeacherProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "giao_vien_id", columnDefinition = "BIGINT UNSIGNED")
    private Long id;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nguoi_dung_id", nullable = false, unique = true, columnDefinition = "BIGINT UNSIGNED")
    private User user;

    @Column(name = "ma_giao_vien", unique = true, length = 30)
    private String teacherCode;

    @Column(name = "ho_ten", nullable = false, length = 100)
    private String fullName;

    @Column(name = "bo_mon", length = 100)
    private String department;

    @Column(name = "ngay_sinh")
    private LocalDate dateOfBirth;

    public String getTeacherCode() {
        return teacherCode;
    }

    public void setTeacherCode(String teacherCode) {
        this.teacherCode = teacherCode;
    }
}
