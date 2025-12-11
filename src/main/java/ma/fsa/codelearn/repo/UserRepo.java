package ma.fsa.codelearn.repo;

import ma.fsa.codelearn.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepo extends JpaRepository<User, Long> {}
