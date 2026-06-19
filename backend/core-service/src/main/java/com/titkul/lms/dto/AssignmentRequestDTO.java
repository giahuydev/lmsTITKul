package com.titkul.lms.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AssignmentRequestDTO {
    private String title;
    private String description;
    private Long classId;
    private Long teacherId;
    private String type;
    private LocalDateTime deadline;
    private Boolean isHardLock;
}
