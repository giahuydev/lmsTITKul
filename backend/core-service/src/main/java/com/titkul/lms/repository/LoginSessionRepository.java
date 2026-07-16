package com.titkul.lms.repository;

import com.titkul.lms.entity.LoginSession;
import com.titkul.lms.entity.NguoiDung;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LoginSessionRepository extends JpaRepository<LoginSession, Long> {
    void deleteByUser(NguoiDung user);
}

