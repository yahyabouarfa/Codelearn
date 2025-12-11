package ma.fsa.codelearn.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "utilisateur")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class User {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "nom")
  private String nom;

  @Column(name = "prenom")
  private String prenom;

  @Column(name = "email", nullable = false, unique = true)
  private String email;

  @Column(name = "mot_de_passe", nullable = false)
  private String motDePasse;

  @Enumerated(EnumType.STRING)
  @Column(name = "role")
  private Role role;
}
