package com.example.plateforme_cours.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cours")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Course {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "titre", nullable = false)
  private String titre;

  @Column(name = "description")
  private String description;

  @ManyToOne
  @JoinColumn(name = "createur_id")
  private Utilisateur createur;

  @JsonIgnore
  @OneToMany(mappedBy = "cours", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<SupportPedagogique> supports = new ArrayList<>();

  @Column(name = "valide_par_admin", nullable = true)
  private Boolean valideParAdmin = null;

  @Column(name = "date_creation", nullable = false)
  private LocalDateTime dateCreation;

  @Column(name = "date_modification")
  private LocalDateTime dateModification;

  @PrePersist
  protected void onCreate() {
    dateCreation = LocalDateTime.now();
    // Keep valideParAdmin as null on creation
  }

  @PreUpdate
  protected void onUpdate() {
    dateModification = LocalDateTime.now();
  }
}
