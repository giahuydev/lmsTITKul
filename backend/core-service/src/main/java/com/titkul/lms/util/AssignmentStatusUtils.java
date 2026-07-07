package com.titkul.lms.util;

import com.titkul.lms.dto.AssignmentResponseDto;
import com.titkul.lms.entity.Assignment;
import com.titkul.lms.entity.Submission;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public final class AssignmentStatusUtils {

    private static final DateTimeFormatter DEADLINE_FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    private AssignmentStatusUtils() {}

    public static AssignmentResponseDto toDto(Assignment assignment, Submission sub) {
        boolean isLate = false;
        String status;

        if (sub != null) {
            status = "DA_NOP";
        } else if (assignment.getDeadline() != null && assignment.getDeadline().isBefore(LocalDateTime.now())) {
            isLate = true;
            status = "QUA_HAN";
        } else {
            status = "CHUA_NOP";
        }

        return AssignmentResponseDto.builder()
                .id(assignment.getId())
                .title(assignment.getTitle())
                .subject("Bài tập")
                .type(assignment.getType().name())
                .status(status)
                .deadline(assignment.getDeadline() != null
                        ? assignment.getDeadline().format(DEADLINE_FMT)
                        : "Không thời hạn")
                .timeRemaining(calcTimeRemaining(assignment, sub, isLate))
                .isLate(isLate)
                .build();
    }

    private static String calcTimeRemaining(Assignment assignment, Submission sub, boolean isLate) {
        if (isLate || assignment.getDeadline() == null || sub != null) return "-";
        Duration d = Duration.between(LocalDateTime.now(), assignment.getDeadline());
        if (d.toDays() > 0) return d.toDays() + " ngày";
        if (d.toHours() > 0) return d.toHours() + " giờ";
        return d.toMinutes() + " phút";
    }
}
