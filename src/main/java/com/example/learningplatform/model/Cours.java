package com.example.learningplatform.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cours")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Cours {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  
  @Column(name = "titre", nullable = false)
  private String titre;
  
  @Column(name = "description")
  private String description;
  
  @ManyToOne
  @JoinColumn(name = "createur_id")
  private Utilisateur createur;
  
  @Column(name = "valide_par_admin")
  private Boolean valideParAdmin; // null = pending, false = rejected, true = approved
}
