package com.titkul.lms.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ho_so_phu_huynh")
@Data
@NoArgsConstructor
public class ParentProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "phu_huynh_id", columnDefinition = "BIGINT UNSIGNED")
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nguoi_dung_id", nullable = false, unique = true, columnDefinition = "BIGINT UNSIGNED")
    private User user;

    @Column(name = "ho_ten", nullable = false, length = 100)
    private String fullName;

    @Column(name = "email_nhan_thong_bao", length = 150)
    private String notificationEmail;

    @OneToMany(mappedBy = "parent", fetch = FetchType.LAZY)
    private java.util.List<StudentProfile> children;
}
