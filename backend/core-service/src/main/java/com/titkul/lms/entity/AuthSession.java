package com.titkul.lms.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "phien_xac_thuc")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "phien_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nguoi_dung_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "loai_xac_thuc", nullable = false)
    private AuthType type;

    @Column(name = "ma_otp", length = 10)
    private String otpCode;

    @Column(name = "het_han", nullable = false)
    private LocalDateTime expiresAt;

    @Column(name = "da_su_dung", nullable = false)
    private Boolean used = false;

    @Column(name = "thoi_diem_tao", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum AuthType {
        DOI_MAT_KHAU, QUEN_MAT_KHAU
    }
}
