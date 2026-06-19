package com.titkul.lms.dto;

import lombok.Data;

@Data
public class SupportTicketRequest {
    private Long studentId;
    private String type;
    private String description;
}
