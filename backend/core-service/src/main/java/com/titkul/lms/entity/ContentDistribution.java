package com.titkul.lms.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "phan_phoi_dang_bai", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"dang_bai_id", "lop_hoc_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContentDistribution {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "phan_phoi_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dang_bai_id", nullable = false)
    private ContentNode contentNode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lop_hoc_id", nullable = false)
    private ClassRoom classRoom;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "giao_vien_id", nullable = false)
    private TeacherProfile teacher;

    @Column(name = "ngay_chia_se", nullable = false)
    private LocalDateTime sharedAt = LocalDateTime.now();
}
