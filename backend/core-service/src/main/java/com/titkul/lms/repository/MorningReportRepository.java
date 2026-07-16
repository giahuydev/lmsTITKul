package com.titkul.lms.repository;

import com.titkul.lms.entity.MorningReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface MorningReportRepository extends JpaRepository<MorningReport, Long> {
    Optional<MorningReport> findByTeacher_GiaoVienIdAndClassRoom_LopHocIdAndReportDate(Long teacherId, Long classRoomId, LocalDate reportDate);
}
