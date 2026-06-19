package com.titkul.lms.controller;

import com.titkul.lms.dto.SupportTicketDto;
import com.titkul.lms.dto.SupportTicketRequest;
import com.titkul.lms.entity.User;
import com.titkul.lms.service.SupportTicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/teacher/tickets")
@RequiredArgsConstructor
public class TeacherTicketController {

    private final SupportTicketService ticketService;

    @GetMapping
    public ResponseEntity<List<SupportTicketDto>> getMyTickets(Authentication authentication) {
        return ResponseEntity.ok(ticketService.getTicketsByTeacherUsername(authentication.getName()));
    }

    @PostMapping
    public ResponseEntity<SupportTicketDto> createTicket(
            Authentication authentication,
            @RequestBody SupportTicketRequest request) {
        return ResponseEntity.ok(ticketService.createTicket(authentication.getName(), request));
    }
}
