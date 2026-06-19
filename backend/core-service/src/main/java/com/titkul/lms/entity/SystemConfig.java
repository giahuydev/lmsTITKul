package com.titkul.lms.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "cau_hinh_he_thong")
@Data
@NoArgsConstructor
public class SystemConfig {

    @Id
    @Column(name = "id")
    private Long id = 1L;

    @Column(name = "ten_truong", nullable = false)
    private String schoolName = "Trường Tiểu Học Titkul";

    @Column(name = "nam_hoc_hien_tai", nullable = false)
    private String academicYear = "2026-2027";

    // Dummy field để fix lỗi NOT NULL của cột nam_hoc cũ do Hibernate sinh ra
    @Column(name = "nam_hoc", nullable = false)
    private String academicYearLegacy = "2026-2027";

    @Column(name = "hoc_ky", nullable = false)
    private Integer currentSemester = 1;

    @Column(name = "logo_url")
    private String logoUrl;

    @Column(name = "danh_sach_khoi", length = 500)
    private String grades = "Khối 1,Khối 2,Khối 3,Khối 4,Khối 5";

    @Column(name = "danh_sach_mon", length = 1000)
    private String subjects = "Toán,Tiếng Việt,Đạo đức,Tự nhiên và Xã hội,Lịch sử,Địa lý,Âm nhạc,Mỹ thuật,Thể dục,Tin học,Tiếng Anh";
}
