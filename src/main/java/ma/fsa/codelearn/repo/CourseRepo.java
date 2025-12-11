package ma.fsa.codelearn.repo;

import ma.fsa.codelearn.domain.Course;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CourseRepo extends JpaRepository<Course, Long> {

  @Query(
      value = """
          select c.*
          from cours c
          where c.valide_par_admin = true
            and (:query is null
                 or cast(c.titre as text) ilike concat('%', :query, '%'))
          """,
      countQuery = """
          select count(*)
          from cours c
          where c.valide_par_admin = true
            and (:query is null
                 or cast(c.titre as text) ilike concat('%', :query, '%'))
          """,
      nativeQuery = true
  )
  Page<Course> search(@Param("query") String query, Pageable pageable);

  Optional<Course> findById(Long id);

  Optional<Course> findByIdAndValideParAdminTrue(Long id);
}
