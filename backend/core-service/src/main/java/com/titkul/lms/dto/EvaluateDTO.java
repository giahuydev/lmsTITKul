package com.titkul.lms.dto;

import lombok.Data;

@Data
public class EvaluateDTO {
    private Long teacherId;     // ID của giáo viên chấm bài
    private String grade;       // EvaluationGrade: HOAN_THANH_TOT, HOAN_THANH, CHUA_HOAN_THANH
    private String comment;     // Nhận xét
    private String action;      // EvaluationAction: DUYET, YC_LAM_LAI
    private String reason;      // Lý do (khi yêu cầu làm lại)
}
