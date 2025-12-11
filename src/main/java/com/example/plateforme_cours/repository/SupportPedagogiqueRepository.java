package com.example.plateforme_cours.repository;

import com.example.plateforme_cours.model.SupportPedagogique;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupportPedagogiqueRepository extends JpaRepository<SupportPedagogique, Long> {
    List<SupportPedagogique> findByCoursId(Long coursId);
}
