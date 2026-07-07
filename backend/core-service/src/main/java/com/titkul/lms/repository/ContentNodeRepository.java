package com.titkul.lms.repository;

import com.titkul.lms.entity.ContentNode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContentNodeRepository extends JpaRepository<ContentNode, Integer> {
}

