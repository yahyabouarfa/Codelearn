package com.example.plateforme_cours.repository;

import com.example.plateforme_cours.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CoursRepository extends JpaRepository<Course, Long> {
    List<Course> findByCreateurId(Long createurId);
    Optional<Course> findByIdAndCreateurId(Long id, Long createurId);
}
