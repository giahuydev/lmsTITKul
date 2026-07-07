package com.titkul.lms.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "phien_dang_nhap")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "phien_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nguoi_dung_id", nullable = false)
    private User user;

    @Column(name = "refresh_token", nullable = false, length = 512, unique = true)
    private String refreshToken;

    @Column(name = "ten_thiet_bi", length = 200)
    private String deviceName;

    @Column(name = "dia_chi_ip", length = 45)
    private String ipAddress;

    @Column(name = "het_han", nullable = false)
    private LocalDateTime expiresAt;

    @Column(name = "thoi_diem_tao", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "thoi_diem_su_dung_cuoi")
    private LocalDateTime lastUsedAt;

    @Column(name = "da_thu_hoi", nullable = false)
    private Boolean revoked = false;
}
