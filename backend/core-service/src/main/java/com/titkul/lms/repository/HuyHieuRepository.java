package com.titkul.lms.repository;

import com.titkul.lms.entity.HuyHieu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HuyHieuRepository extends JpaRepository<HuyHieu, Integer> {
}
