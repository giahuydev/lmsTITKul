package com.titkul.lms.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "nguoi_dung")
@Data
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "nguoi_dung_id")
    private Long id;

    @Column(name = "ten_dang_nhap", nullable = false, unique = true, length = 100)
    private String username;

    @Column(name = "mat_khau_hash", nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(name = "vai_tro", nullable = false)
    private Role role;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai", nullable = false)
    private UserStatus status;

    @Column(name = "email", unique = true, length = 150)
    private String email;

    @Column(name = "so_dien_thoai", unique = true, length = 15)
    private String phone;

    @Column(name = "bat_buoc_doi_mk", nullable = false)
    private Boolean requirePasswordChange = false;

    @Column(name = "lan_dang_nhap_cuoi")
    private LocalDateTime lastLogin;

    @Column(name = "ngay_tao", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "ngay_cap_nhat", insertable = false, updatable = false)
    private LocalDateTime updatedAt;
}
