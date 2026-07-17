package com.titkul.lms.controller;

import com.titkul.lms.dto.ProcessTicketRequest;
import com.titkul.lms.dto.SupportTicketDto;
import com.titkul.lms.entity.NguoiDung;
import com.titkul.lms.service.PhieuHoTroService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/tickets")
@RequiredArgsConstructor
public class QuanTriVienPhieuHoTroController {

    private final PhieuHoTroService ticketService;

    @GetMapping
    public ResponseEntity<List<SupportTicketDto>> getPendingTickets() {
        return ResponseEntity.ok(ticketService.getPendingTickets());
    }

    @PostMapping("/{ticketId}/process")
    public ResponseEntity<SupportTicketDto> processTicket(
            @PathVariable Long ticketId,
            Authentication authentication,
            @RequestBody ProcessTicketRequest request) {
        return ResponseEntity.ok(ticketService.processTicket(ticketId, authentication.getName(), request));
    }
}
