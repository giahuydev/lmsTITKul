package com.titkul.lms.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "bai_nop")
@Data
@NoArgsConstructor
public class Submission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bai_nop_id")
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bai_tap_id", referencedColumnName = "bai_tap_id", nullable = false)
    private Assignment assignment;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hoc_sinh_id", referencedColumnName = "hoc_sinh_id", nullable = false)
    private StudentProfile student;

    @Column(name = "noi_dung_text", columnDefinition = "TEXT")
    private String textContent;

    @Column(name = "file_dinh_kem", length = 500)
    private String attachmentUrl;

    @Column(name = "diem_h5p", precision = 5, scale = 2)
    private BigDecimal h5pScore;

    @Column(name = "xp_nhan_duoc", nullable = false, columnDefinition = "SMALLINT UNSIGNED")
    private Integer xpEarned = 0;

    @Column(name = "so_lan_lam", nullable = false, columnDefinition = "TINYINT UNSIGNED")
    private Short attemptNumber = 1;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai", nullable = false)
    private SubmissionStatus status = SubmissionStatus.CHUA_NOP;

    @Column(name = "la_nop_tre", nullable = false)
    private Boolean isLate = false;

    @Column(name = "thoi_diem_nop")
    private LocalDateTime submittedAt;
}
