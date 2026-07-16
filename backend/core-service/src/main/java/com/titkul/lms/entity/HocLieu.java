package com.titkul.lms.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "hoc_lieu")
@Data
@NoArgsConstructor
public class HocLieu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "hoc_lieu_id")
    private Long id;

    @Column(name = "tieu_de", nullable = false, length = 300)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(name = "loai_hoc_lieu", nullable = false, columnDefinition = "VARCHAR(50)")
    private LoaiHocLieu type;

    @Enumerated(EnumType.STRING)
    @Column(name = "nguon_goc", nullable = false, columnDefinition = "VARCHAR(50)")
    private NguonGocHocLieu origin;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bai_hoc_id")
    private Lesson lesson;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "giao_vien_id", referencedColumnName = "giao_vien_id")
    private TeacherProfile teacher;

    // Phân loại Khối/Môn do GV tự gán sau khi soạn — hoc_lieu không nằm trong cây SGK
    // (Book/Topic/Lesson) nên không suy ra được tự động như ContentNode.
    @Column(name = "khoi_lop")
    private Short grade;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mon_hoc_id")
    private Subject subject;

    @Column(name = "file_url", length = 500)
    private String fileUrl;

    // Content id bên h5p-service, dùng để upsert khi GV lưu lại bài.
    @Column(name = "h5p_content_id", length = 100)
    private String h5pContentId;

    @Column(name = "xp_thuong", nullable = false)
    private Integer xpReward = 0;

    @Column(name = "cho_lam_lai", nullable = false)
    private Boolean allowRetry = false;

    @Column(name = "so_lan_lam_toi_da")
    private Integer maxRetryCount;

    @Column(name = "ngay_tao", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // teacher bị @JsonIgnore (lazy) nên expose riêng id qua đây cho FE.
    public Long getTeacherUserId() {
        return teacher != null && teacher.getUser() != null ? teacher.getUser().getId() : null;
    }

    // subject bị @JsonIgnore (lazy) nên expose riêng id/tên qua đây cho FE.
    public Integer getSubjectId() {
        return subject != null ? subject.getId() : null;
    }

    public String getSubjectName() {
        return subject != null ? subject.getName() : null;
    }
}
