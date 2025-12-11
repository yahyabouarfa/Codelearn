package ma.fsa.codelearn.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "supportpedagogique")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class SupportPedagogique {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Enumerated(EnumType.STRING)
  @Column(name = "type_support")
  private ResourceType typeSupport; // PDF or Video

  @Column(name = "url", nullable = false)
  private String url;

  @ManyToOne
  @JoinColumn(name = "cours_id")
  private Course cours;
}
