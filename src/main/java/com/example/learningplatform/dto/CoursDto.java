package com.example.learningplatform.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CoursDto {

    @NotBlank(message = "Le titre du cours est requis")
    @Size(max = 150, message = "Le titre ne doit pas dépasser 150 caractères")
    private String titre;

    @NotBlank(message = "La description est requise")
    @Size(max = 5000, message = "La description est trop longue")
    private String description;

    public String getTitre() {
        return titre;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
