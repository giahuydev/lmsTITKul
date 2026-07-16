package com.titkul.lms.service;

import com.titkul.lms.dto.ProcessTicketRequest;
import com.titkul.lms.dto.SupportTicketDto;
import com.titkul.lms.dto.SupportTicketRequest;
import com.titkul.lms.entity.SupportTicket;
import com.titkul.lms.entity.SupportTicketStatus;
import com.titkul.lms.entity.NguoiDung;
import com.titkul.lms.repository.SupportTicketRepository;
import com.titkul.lms.repository.NguoiDungRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SupportTicketService {

    private final SupportTicketRepository ticketRepository;
    private final NguoiDungRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public SupportTicketDto createTicket(String teacherUsername, SupportTicketRequest request) {
        NguoiDung teacher = userRepository.findByTenDangNhap(teacherUsername)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy giáo viên"));
        NguoiDung student = userRepository.findById(request.getStudentId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy học sinh"));

        SupportTicket ticket = new SupportTicket();
        ticket.setTeacher(teacher);
        ticket.setStudent(student);
        ticket.setType(request.getType() != null ? request.getType() : "RESET_MAT_KHAU");
        ticket.setDescription(request.getDescription());
        ticket.setStatus(SupportTicketStatus.CHO_DUYET);

        ticket = ticketRepository.save(ticket);
        return mapToDto(ticket);
    }

    @Transactional(readOnly = true)
    public List<SupportTicketDto> getTicketsByTeacherUsername(String teacherUsername) {
        NguoiDung teacher = userRepository.findByTenDangNhap(teacherUsername)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy giáo viên"));
        return ticketRepository.findByTeacher_NguoiDungIdOrderByCreatedAtDesc(teacher.getNguoiDungId())
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SupportTicketDto> getPendingTickets() {
        return ticketRepository.findByStatusOrderByCreatedAtAsc(SupportTicketStatus.CHO_DUYET)
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional
    public SupportTicketDto processTicket(Long ticketId, String adminUsername, ProcessTicketRequest request) {
        SupportTicket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phiếu hỗ trợ"));
        NguoiDung admin = userRepository.findByTenDangNhap(adminUsername)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Admin"));

        if (ticket.getStatus() != SupportTicketStatus.CHO_DUYET) {
            throw new RuntimeException("Phiếu này đã được xử lý");
        }

        ticket.setStatus(request.getStatus());
        ticket.setAdmin(admin);
        ticket.setAdminNote(request.getAdminNote());
        ticket.setProcessedAt(LocalDateTime.now());

        if (request.getStatus() == SupportTicketStatus.DA_DUYET && "RESET_MAT_KHAU".equals(ticket.getType())) {
            NguoiDung student = ticket.getStudent();
            // Reset mật khẩu về mặc định (ví dụ: số điện thoại hoặc mã học sinh, hoặc chuỗi cố định)
            // Lấy username của học sinh làm mật khẩu mặc định luôn
            student.setMatKhauHash(passwordEncoder.encode(student.getTenDangNhap()));
            student.setBatBuocDoiMk(true);
            userRepository.save(student);
        }

        ticket = ticketRepository.save(ticket);
        return mapToDto(ticket);
    }

    private SupportTicketDto mapToDto(SupportTicket ticket) {
        SupportTicketDto dto = new SupportTicketDto();
        dto.setId(ticket.getId());
        dto.setTeacherId(ticket.getTeacher().getNguoiDungId());
        dto.setTeacherName(ticket.getTeacher().getTenDangNhap()); // Should map to profile name if available
        dto.setStudentId(ticket.getStudent().getNguoiDungId());
        dto.setStudentName(ticket.getStudent().getTenDangNhap()); // Should map to profile name if available
        dto.setType(ticket.getType());
        dto.setDescription(ticket.getDescription());
        dto.setStatus(ticket.getStatus().name());
        dto.setAdminNote(ticket.getAdminNote());
        dto.setCreatedAt(ticket.getCreatedAt());
        dto.setProcessedAt(ticket.getProcessedAt());
        return dto;
    }
}
