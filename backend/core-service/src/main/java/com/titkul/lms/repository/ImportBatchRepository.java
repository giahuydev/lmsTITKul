package com.titkul.lms.repository;

import com.titkul.lms.entity.ImportBatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ImportBatchRepository extends JpaRepository<ImportBatch, Long> {
}
