package ma.fsa.codelearn.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "langagedeprogrammation")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Language {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "nom", nullable = false)
  private String nom;
}
