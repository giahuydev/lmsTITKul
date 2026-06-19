package com.titkul.lms.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "lop_hoc")
@Data
@NoArgsConstructor
public class ClassRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "lop_hoc_id")
    private Long id;

    @Column(name = "ten_lop", nullable = false, length = 20)
    private String name;

    @Column(name = "khoi_lop", nullable = false, columnDefinition = "TINYINT UNSIGNED")
    private Short grade;

    @Column(name = "nam_hoc", nullable = false, length = 10)
    private String academicYear;

    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "giao_vien_chu_nhiem_id")
    private TeacherProfile homeroomTeacher;

    @Column(name = "si_so_toi_da", nullable = false, columnDefinition = "TINYINT UNSIGNED")
    private Short maxCapacity = 40;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai", nullable = false)
    private ClassStatus status = ClassStatus.ACTIVE;

    @Transient
    private Integer currentStudentCount = 0;
}
