package com.example.plateforme_cours.repository;

import com.example.plateforme_cours.model.Language;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LangageDeProgrammationRepository extends JpaRepository<Language, Long> {
}
