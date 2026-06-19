package com.titkul.lms.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "hoc_lieu")
@Data
@NoArgsConstructor
public class Material {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "hoc_lieu_id")
    private Long id;

    @Column(name = "tieu_de", nullable = false, length = 300)
    private String title;

    @Column(name = "loai_hoc_lieu", nullable = false)
    private String materialType;

    @Column(name = "nguon_goc", nullable = false)
    private String origin;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bai_hoc_id", referencedColumnName = "bai_hoc_id")
    private LessonCategory lessonCategory;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "giao_vien_id", referencedColumnName = "giao_vien_id")
    private TeacherProfile teacher;

    @Column(name = "file_url", length = 500)
    private String fileUrl;

    @Column(name = "noi_dung_h5p", columnDefinition = "JSON")
    private String h5pContent;

    @Column(name = "xp_thuong", nullable = false, columnDefinition = "SMALLINT UNSIGNED")
    private Integer xpReward = 0;

    @Column(name = "cho_lam_lai", nullable = false)
    private Boolean allowRetry = false;

    @Column(name = "so_lan_lam_toi_da", columnDefinition = "TINYINT UNSIGNED")
    private Short maxAttempts;
}
