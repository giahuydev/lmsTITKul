package com.titkul.lms.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;

@Entity
@Table(name = "dang_bai")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContentNode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "dang_bai_id", columnDefinition = "INT UNSIGNED")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bai_hoc_id", nullable = false)
    private Lesson lesson;

    @Column(name = "book_index_id_ngoai")
    private Integer externalBookIndexId;

    @Column(name = "ten_dang_bai", nullable = false, length = 200)
    private String name;

    @Column(name = "slug", length = 200)
    private String slug;

    @Column(name = "so_trang")
    private Integer pageNo;

    @Column(name = "so_thu_tu", nullable = false)
    private Integer orderNo = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mon_hoc_id", nullable = false)
    private Subject subject;

    @Enumerated(EnumType.STRING)
    @Column(name = "loai_noi_dung", nullable = false)
    private ContentType contentType = ContentType.JSON_TEXT;

    @Enumerated(EnumType.STRING)
    @Column(name = "nguon_goc", nullable = false)
    private Origin origin = Origin.HE_THONG;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "giao_vien_id")
    private TeacherProfile teacher;

    @Column(name = "h5p_noi_dung_id", length = 36)
    private String h5pContentId;

    @Column(name = "xp_thuong", nullable = false)
    private Integer xpReward = 0;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "cau_hinh")
    private String configuration;

    @Column(name = "ngay_tao", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum ContentType {
        H5P, FILE, NATIVE, JSON_TEXT
    }

    public enum Origin {
        HE_THONG, GIAO_VIEN_BO_SUNG
    }
}
