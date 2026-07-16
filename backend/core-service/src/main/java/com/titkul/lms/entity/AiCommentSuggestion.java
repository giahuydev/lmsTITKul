package com.titkul.lms.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;

// Gợi ý nhận xét dựa quy tắc (rule-based) từ dữ liệu bài nộp thật — KHÔNG gọi API AI
// ngoài (dự án chưa có credentials cho dịch vụ AI trả phí).
@Entity
@Table(name = "goi_y_ai_nhan_xet")
@Data
@NoArgsConstructor
public class AiCommentSuggestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "goi_y_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bai_nop_id", nullable = false)
    private Submission submission;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "du_lieu_dau_vao", nullable = false)
    private String inputData;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "ket_qua_goi_y")
    private String suggestionResult;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai", nullable = false)
    private AiSuggestionStatus status = AiSuggestionStatus.NHAP;

    @Column(name = "thoi_diem_goi", nullable = false)
    private LocalDateTime generatedAt = LocalDateTime.now();
}
