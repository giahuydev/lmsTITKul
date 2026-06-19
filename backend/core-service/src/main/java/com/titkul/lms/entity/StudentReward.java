package com.titkul.lms.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "phan_thuong_hoc_sinh")
@Data
@NoArgsConstructor
public class StudentReward {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "phan_thuong_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hoc_sinh_id", nullable = false)
    private StudentProfile student;

    @Enumerated(EnumType.STRING)
    @Column(name = "loai_thuong", nullable = false, length = 20)
    private RewardType type;

    @Column(name = "ten_thuong", nullable = false, length = 100)
    private String name;

    @Column(name = "mo_ta", length = 500)
    private String description;

    @Column(name = "icon_url", length = 200)
    private String iconUrl;

    @Column(name = "ngay_dat_duoc")
    private LocalDate unlockedDate;

    // Các thông tin thêm dành cho Thư khen
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "giao_vien_tang_id")
    private TeacherProfile teacher;

    @Column(name = "mon_hoc", length = 100)
    private String subject;
}
