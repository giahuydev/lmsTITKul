package com.titkul.lms.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "bai_tap")
@Data
@NoArgsConstructor
public class Assignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bai_tap_id")
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "giao_vien_id", referencedColumnName = "giao_vien_id", nullable = false)
    private TeacherProfile teacher;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lop_hoc_id", referencedColumnName = "lop_hoc_id", nullable = false)
    private ClassRoom classRoom;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bai_hoc_id")
    private Lesson lesson;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dang_bai_id")
    private ContentNode contentNode;

    // Học liệu GV tự soạn ở Kho Học Liệu (hoc_lieu) — độc lập với cây SGK (ContentNode).
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hoc_lieu_id")
    private HocLieu hocLieu;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hoc_ky_id", nullable = false)
    private Semester semester;

    @Column(name = "tieu_de", nullable = false, length = 300)
    private String title;

    @Column(name = "mo_ta", columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "loai_bai_tap", nullable = false, columnDefinition = "VARCHAR(20)")
    private AssignmentType type;

    @Column(name = "thoi_diem_bat_dau")
    private LocalDateTime startTime;

    @Column(name = "deadline", nullable = false)
    private LocalDateTime deadline;

    @Column(name = "cho_nop_lai", nullable = false)
    private Boolean allowResubmit = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai", nullable = false)
    private AssignmentStatus status = AssignmentStatus.CHO_DANG;

    @Column(name = "so_lan_nop_lai_toi_da", nullable = false)
    private Integer maxResubmitCount = 1;

    @Column(name = "ngay_tao", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();


}
