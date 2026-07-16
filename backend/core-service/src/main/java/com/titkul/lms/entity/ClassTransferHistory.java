package com.titkul.lms.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "lich_su_chuyen_lop")
@Data
@NoArgsConstructor
public class ClassTransferHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "chuyen_lop_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hoc_sinh_id", nullable = false)
    private StudentProfile student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lop_cu_id")
    private ClassRoom oldClass;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lop_moi_id", nullable = false)
    private ClassRoom newClass;

    @Column(name = "nam_hoc_cu", length = 10)
    private String oldAcademicYear;

    @Column(name = "nam_hoc_moi", nullable = false, length = 10)
    private String newAcademicYear;

    @Enumerated(EnumType.STRING)
    @Column(name = "ly_do", nullable = false)
    private TransferReason reason = TransferReason.DOI_LOP;

    @Column(name = "ghi_chu", columnDefinition = "TEXT")
    private String note;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nguoi_thuc_hien_id", nullable = false)
    private User performedBy;

    @Column(name = "thoi_diem_chuyen", nullable = false, updatable = false)
    private LocalDateTime transferredAt = LocalDateTime.now();
}
