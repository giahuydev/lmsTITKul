package com.titkul.lms.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ContentNodeDetailDto {
    private Integer id;
    private String title;
    private String h5pContentId;
    private Integer xpReward;
    private Boolean completed;
}
