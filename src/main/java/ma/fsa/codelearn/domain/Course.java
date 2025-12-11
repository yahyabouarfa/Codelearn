package ma.fsa.codelearn.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cours")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Course {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "titre", nullable = false)
  private String titre;

  @Column(name = "description")
  private String description;

  @Column(name = "valide_par_admin")
  private Boolean valideParAdmin;

  @ManyToOne
  @JoinColumn(name = "createur_id")
  private User createur;
}
