package com.example.plateforme_cours.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
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

  @Column(name = "url", nullable = false, length = 500)
  private String url;

  @Column(name = "file_name")
  private String fileName; // Original file name

  @JsonIgnore
  @ManyToOne
  @JoinColumn(name = "cours_id")
  private Course cours;
}
