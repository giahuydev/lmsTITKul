package com.titkul.lms.repository;

import com.titkul.lms.entity.MaterialDistribution;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaterialDistributionRepository extends JpaRepository<MaterialDistribution, Long> {
    List<MaterialDistribution> findByClassRoomId(Long classRoomId);
}
