package com.titkul.lms.dto;

import com.titkul.lms.entity.SupportTicketStatus;
import lombok.Data;

@Data
public class ProcessTicketRequest {
    private SupportTicketStatus status;
    private String adminNote;
}
