package com.titkul.lms.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDateTime;

// 1 dòng = 1 thông báo đăng cho cả lớp (hoặc toàn trường nếu classRoom=null) —
// trạng thái đọc riêng của từng người nằm ở bảng NotificationReadStatus.
@Entity
@Table(name = "thong_bao")
@Data
@NoArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "thong_bao_id")
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nguoi_gui_id", nullable = false)
    private User sender;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lop_hoc_id")
    private ClassRoom classRoom;

    @Column(name = "tieu_de", nullable = false, length = 300)
    private String title;

    @Column(name = "noi_dung", columnDefinition = "TEXT")
    private String content;

    @Column(name = "file_dinh_kem", length = 500)
    private String attachmentUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "loai_thong_bao", nullable = false, length = 50)
    private NotificationType type = NotificationType.NOI_BO;

    @Column(name = "la_ghim", nullable = false)
    private boolean pinned = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "doi_tuong_nhan", nullable = false, length = 20)
    private NotificationAudience audience = NotificationAudience.TAT_CA;

    @Column(name = "ngay_dang", nullable = false)
    private LocalDateTime postedAt = LocalDateTime.now();
}
