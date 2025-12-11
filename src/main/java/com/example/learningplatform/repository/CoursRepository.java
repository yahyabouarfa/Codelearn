package com.example.learningplatform.repository;

import com.example.learningplatform.model.Cours;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CoursRepository extends JpaRepository<Cours, Long> {
    // Find courses by validation status
    List<Cours> findByValideParAdminIsNull();  // Pending validation
    List<Cours> findByValideParAdmin(Boolean status);  // Rejected (false) or Approved (true)
}
