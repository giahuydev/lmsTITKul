package com.titkul.lms.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "danh_gia_bai_lam")
@Data
@NoArgsConstructor
public class Evaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "danh_gia_id")
    private Long id;

    @JsonIgnore
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bai_nop_id", referencedColumnName = "bai_nop_id", nullable = false, unique = true)
    private Submission submission;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "giao_vien_id", referencedColumnName = "giao_vien_id", nullable = false)
    private TeacherProfile teacher;

    @Column(name = "diem_so", precision = 4, scale = 1)
    private BigDecimal score;

    @Enumerated(EnumType.STRING)
    @Column(name = "xep_loai")
    private EvaluationGrade grade;

    @Column(name = "nhan_xet", columnDefinition = "TEXT")
    private String comment;

    @Enumerated(EnumType.STRING)
    @Column(name = "hanh_dong", nullable = false)
    private EvaluationAction action = EvaluationAction.DUYET;

    @Column(name = "thoi_diem_cham", nullable = false)
    private LocalDateTime evaluatedAt = LocalDateTime.now();
}
