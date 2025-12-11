package ma.fsa.codelearn.repo;

import java.util.List;
import ma.fsa.codelearn.domain.SupportPedagogique;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SupportPedagogiqueRepo extends JpaRepository<SupportPedagogique, Long> {

  @Query(
      "select s from SupportPedagogique s join fetch s.cours c where c.id = :coursId order by s.id asc")
  List<SupportPedagogique> findByCoursIdOrderByIdAsc(@Param("coursId") Long coursId);

  @Query("select count(s) from SupportPedagogique s where s.cours.id = :coursId")
  long countByCoursId(@Param("coursId") Long coursId);
}
