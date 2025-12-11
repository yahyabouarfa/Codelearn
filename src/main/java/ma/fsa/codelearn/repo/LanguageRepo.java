package ma.fsa.codelearn.repo;

import ma.fsa.codelearn.domain.Language;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LanguageRepo extends JpaRepository<Language, Long> {}