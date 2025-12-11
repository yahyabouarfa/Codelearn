package com.example.plateforme_cours.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.plateforme_cours.model.Course;
import com.example.plateforme_cours.model.SupportPedagogique;
import com.example.plateforme_cours.service.CoursService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/cours")
public class CoursController {

    @Autowired
    private CoursService coursService;

    // Publier un nouveau cours (JSON only, no files)
    @PostMapping("/publier")
    public ResponseEntity<Course> publierCours(@RequestBody Course cours) {
        int createurId = 3; // Hardcoded createur_id
        Course createdCours = coursService.publierCours(cours, createurId);
        if (createdCours != null) {
            return ResponseEntity.ok(createdCours);
        }
        return ResponseEntity.badRequest().build();
    }

    // Publier un nouveau cours avec plusieurs fichiers
    @PostMapping("/publier/with-files")
    public ResponseEntity<Course> publierCoursAvecFichiers(
            @RequestParam("titre") String titre,
            @RequestParam("description") String description,
            @RequestParam(value = "files", required = false) MultipartFile[] files,
            @RequestParam(value = "typesSupport", required = false) String[] typesSupport) {
        try {
            int createurId = 3; // Hardcoded createur_id
            Course createdCours = coursService.publierCoursAvecFichiers(
                createurId, titre, description, files, typesSupport
            );
            if (createdCours != null) {
                return ResponseEntity.ok(createdCours);
            }
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    // Mettre à jour un cours (JSON only, no files)
    @PutMapping("/modifier/{id}")
    public ResponseEntity<Course> mettreAJourCours(@PathVariable int id, @RequestBody Course newCours) {
        Course updatedCours = coursService.mettreAJourCours(id, newCours);
        if (updatedCours != null) {
            return ResponseEntity.ok(updatedCours);
        }
        return ResponseEntity.notFound().build();
    }

    // Mettre à jour un cours avec ajout de plusieurs nouveaux fichiers
    @PutMapping("/modifier/{id}/add-files")
    public ResponseEntity<Course> ajouterFichiersAuCours(
            @PathVariable int id,
            @RequestParam(value = "files", required = false) MultipartFile[] files,
            @RequestParam(value = "typesSupport", required = false) String[] typesSupport) {
        try {
            Course updatedCours = coursService.ajouterFichiersAuCours(id, files, typesSupport);
            if (updatedCours != null) {
                return ResponseEntity.ok(updatedCours);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    // Gérer les supports (ajouter avec JSON)
    @PostMapping("/{coursId}/supports")
    public ResponseEntity<SupportPedagogique> ajouterSupport(@PathVariable Long coursId, @RequestBody SupportPedagogique support) {
        SupportPedagogique createdSupport = coursService.ajouterSupport(coursId, support);
        if (createdSupport != null) {
            return ResponseEntity.ok(createdSupport);
        }
        return ResponseEntity.badRequest().build();
    }

    // Ajouter un support avec fichier (upload to cloud)
    @PostMapping("/{coursId}/supports/upload")
    public ResponseEntity<SupportPedagogique> ajouterSupportAvecFichier(
            @PathVariable Long coursId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("typeSupport") String typeSupport) {
        try {
            SupportPedagogique createdSupport = coursService.ajouterSupportAvecFichier(coursId, file, typeSupport);
            if (createdSupport != null) {
                return ResponseEntity.ok(createdSupport);
            }
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    // Lister tous les cours (sans filtrage par créateur)
    @GetMapping("/liste")
    public ResponseEntity<List<Course>> getAllCours() {
        return ResponseEntity.ok(coursService.getAllCours());
    }

    // Obtenir un cours par ID (vérifie que le créateur est 3)
    @GetMapping("/{id}")
    public ResponseEntity<Course> getCoursById(@PathVariable Long id) {
        Optional<Course> cours = coursService.getCoursByIdAndCreateurId(id, 3L);
        return cours.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Obtenir les supports d'un cours par son ID
    @GetMapping("/{coursId}/supports")
    public ResponseEntity<List<SupportPedagogique>> getSupportsByCoursId(@PathVariable Long coursId) {
        List<SupportPedagogique> supports = coursService.getSupportsByCoursId(coursId);
        return ResponseEntity.ok(supports);
    }

    // Test endpoint to verify file upload and URL
    @PostMapping("/test-upload")
    public ResponseEntity<Map<String, String>> testUpload(@RequestParam("file") MultipartFile file) {
        try {
            String url = coursService.testCloudinaryUpload(file);
            Map<String, String> response = new HashMap<>();
            response.put("uploadedUrl", url);
            response.put("fileName", file.getOriginalFilename());
            response.put("fileSize", String.valueOf(file.getSize()));
            response.put("contentType", file.getContentType());
            response.put("message", "File uploaded successfully. Try accessing this URL in your browser.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
}
