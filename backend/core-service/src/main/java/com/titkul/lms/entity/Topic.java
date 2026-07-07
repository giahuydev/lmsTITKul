package com.titkul.lms.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "chu_de")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Topic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "chu_de_id", columnDefinition = "INT UNSIGNED")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sach_id", nullable = false)
    private Book book;

    @Column(name = "book_index_id_ngoai")
    private Integer externalBookIndexId;

    @Column(name = "ten_chu_de", nullable = false, length = 300)
    private String name;

    @Column(name = "tieu_de", length = 100)
    private String title;

    @Column(name = "slug", length = 300)
    private String slug;

    @Column(name = "so_trang")
    private Integer pageNo;

    @Column(name = "so_thu_tu", nullable = false)
    private Integer orderNo = 0;

    @Column(name = "ngay_tao", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
