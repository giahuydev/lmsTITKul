package com.titkul.lms.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "khen_thuong_hoc_sinh")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentReward {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "khen_thuong_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hoc_sinh_id", nullable = false)
    private StudentProfile student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "huy_hieu_id", nullable = false)
    private Badge badge;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "giao_vien_id")
    private TeacherProfile teacher;

    @Column(name = "thu_khen", columnDefinition = "TEXT")
    private String complimentLetter;

    @Enumerated(EnumType.STRING)
    @Column(name = "nguon_cap", nullable = false)
    private Source source = Source.THU_CONG;

    @Column(name = "thoi_diem_trao", nullable = false, updatable = false)
    private LocalDateTime awardedAt = LocalDateTime.now();

    @Column(name = "da_gui_email", nullable = false)
    private Boolean emailSent = false;

    public enum Source {
        THU_CONG, HE_THONG
    }
}
