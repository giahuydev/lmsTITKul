package com.titkul.lms.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ContentNodeCompleteResultDto {
    private Integer xpEarned;
    private Integer totalXp;
    private Boolean alreadyCompleted;
}
