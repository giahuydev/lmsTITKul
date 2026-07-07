package com.titkul.lms.repository;

import com.titkul.lms.entity.ContentDistribution;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContentDistributionRepository extends JpaRepository<ContentDistribution, Long> {
}

