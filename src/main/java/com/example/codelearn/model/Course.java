package com.example.codelearn.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cours")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Course {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @Column(name = "titre", nullable = false)
  private String titre;  @Column(name = "description")
  private String description;  @ManyToOne  @JoinColumn(name = "createur_id")
  private Utilisateur createur;}
