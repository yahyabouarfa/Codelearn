package com.example.learningplatform.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UserDto {

    @NotBlank(message = "Le nom d'utilisateur est requis")
    @Size(max = 50, message = "Le nom d'utilisateur ne doit pas dépasser 50 caractères")
    private String username;

    @NotBlank(message = "L'email est requis")
    @Email(message = "L'email doit être une adresse valide")
    private String email;

    @NotBlank(message = "Le rôle est requis")
    private String role;

    @Size(min = 6, message = "Le mot de passe doit contenir au moins 6 caractères")
    private String motDePasse;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getMotDePasse() {
        return motDePasse;
    }

    public void setMotDePasse(String motDePasse) {
        this.motDePasse = motDePasse;
    }
}
