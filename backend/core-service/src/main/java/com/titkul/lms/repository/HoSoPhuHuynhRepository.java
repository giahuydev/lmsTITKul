package com.titkul.lms.repository;

import com.titkul.lms.entity.HoSoPhuHuynh;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HoSoPhuHuynhRepository extends JpaRepository<HoSoPhuHuynh, Long> {
    java.util.Optional<HoSoPhuHuynh> findByNguoiDungId(Long nguoiDungId);
}
