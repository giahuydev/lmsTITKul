package com.titkul.lms.repository;

import com.titkul.lms.entity.ParentProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ParentProfileRepository extends JpaRepository<ParentProfile, Long> {
    java.util.Optional<ParentProfile> findByUserId(Long userId);
}
