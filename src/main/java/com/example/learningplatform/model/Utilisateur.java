package com.example.learningplatform.model;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "utilisateur")
@Data
@SuperBuilder
@NoArgsConstructor
public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String prenom;

    @Column(name = "actif")
    private Boolean actif;

    @Column(unique = true, name = "email")
    private String email;

    @Column(name = "mot_de_passe")
    private String motDePasse;

    // Ajout de la colonne de rôle directement dans la classe Utilisateur
    private String role; // Correspond à la colonne 'role' de votre DDL
}