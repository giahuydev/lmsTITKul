package com.titkul.lms.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "thong_bao")
@Data
@NoArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "thong_bao_id", columnDefinition = "BIGINT UNSIGNED")
    private Long id;

    @Column(name = "tieu_de", nullable = false, length = 200)
    private String title;

    @Column(name = "noi_dung", columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(name = "loai_thong_bao", nullable = false, length = 50)
    private NotificationType type;

    @Column(name = "ngay_gui", nullable = false)
    private LocalDateTime date = LocalDateTime.now();

    @Column(name = "da_doc", nullable = false)
    private boolean read = false;

    @Column(name = "da_ghim", nullable = false)
    private boolean pinned = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nguoi_nhan_id", nullable = false, columnDefinition = "BIGINT UNSIGNED")
    private User recipient;
}
