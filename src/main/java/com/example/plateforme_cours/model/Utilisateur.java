// src/main/java/com/codelearn/model/Utilisateur.java
package com.example.plateforme_cours.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "utilisateur") // Nom de la table en BDD
@Data
@SuperBuilder
@NoArgsConstructor
public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String prenom; // Assurez-vous d'ajouter cette colonne dans votre BDD si elle manque

    @Column(unique = true, name = "email")
    private String email;

    @Column(name = "mot_de_passe")
    private String motDePasse;

    // Ajout de la colonne de rôle directement dans la classe Utilisateur
    private String role; // Correspond à la colonne 'role' de votre DDL
}