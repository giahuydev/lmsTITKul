package com.titkul.lms.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;

@Entity
@Table(name = "sach")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "sach_id", columnDefinition = "INT UNSIGNED")
    private Integer id;

    @Column(name = "book_id_ngoai")
    private Integer externalBookId;

    @Enumerated(EnumType.STRING)
    @Column(name = "loai_sach", nullable = false)
    private BookType type = BookType.SACH_GIAO_KHOA;

    @Column(name = "bo_sach", nullable = false, length = 150)
    private String bookSeries;

    @Column(name = "khoi_lop", nullable = false)
    private Integer gradeLevel;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mon_hoc_id", nullable = false)
    private Subject subject;

    @Column(name = "hoc_ky")
    private Integer semester;

    @Column(name = "ten_sach", nullable = false, length = 300)
    private String name;

    @Column(name = "slug", length = 300)
    private String slug;

    @Column(name = "mo_ta", columnDefinition = "TEXT")
    private String description;

    @Column(name = "anh_bia_url", length = 500)
    private String coverUrl;

    @Column(name = "tong_so_trang")
    private Integer totalPages;

    @Column(name = "nam_xuat_ban")
    private Integer publishYear;

    @Column(name = "ban_quyen", length = 200)
    private String copyright;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "ban_bien_soan")
    private String editors; // Using String for JSON for now to keep it simple, or List<Map<String, Object>> if Jackson is properly configured

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai", nullable = false)
    private Status status = Status.ACTIVE;

    @Column(name = "ngay_tao", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "ngay_cap_nhat", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum BookType {
        SACH_GIAO_KHOA, SACH_BAI_TAP
    }

    public enum Status {
        ACTIVE, AN
    }
}
