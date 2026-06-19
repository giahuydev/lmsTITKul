package com.titkul.lms.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "danh_muc_bai_hoc")
@Data
@NoArgsConstructor
public class LessonCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bai_hoc_id", columnDefinition = "INT UNSIGNED")
    private Long id;

    @Column(name = "bo_sach", nullable = false, length = 100)
    private String bookSeries;

    @Column(name = "khoi_lop", nullable = false, columnDefinition = "TINYINT UNSIGNED")
    private Short grade;

    @Column(name = "mon_hoc", nullable = false, length = 100)
    private String subject;

    @Column(name = "ten_bai", nullable = false, length = 200)
    private String lessonName;

    @Column(name = "so_bai", columnDefinition = "SMALLINT UNSIGNED")
    private Integer lessonNumber;

    @Column(name = "hoc_ky", columnDefinition = "TINYINT UNSIGNED")
    private Short semester;
}
