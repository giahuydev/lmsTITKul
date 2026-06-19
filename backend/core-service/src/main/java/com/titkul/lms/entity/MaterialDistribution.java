package com.titkul.lms.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "phan_phoi_hoc_lieu")
@Data
@NoArgsConstructor
public class MaterialDistribution {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "phan_phoi_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hoc_lieu_id", referencedColumnName = "hoc_lieu_id", nullable = false)
    private Material material;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lop_hoc_id", referencedColumnName = "lop_hoc_id", nullable = false)
    private ClassRoom classRoom;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "giao_vien_id", referencedColumnName = "giao_vien_id", nullable = false)
    private TeacherProfile teacher;

    @Column(name = "ngay_chia_se", nullable = false)
    private LocalDateTime sharedAt = LocalDateTime.now();
}
