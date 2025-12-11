package com.example.learningplatform.service;

import com.example.learningplatform.model.Cours;
import com.example.learningplatform.model.Utilisateur;
import com.example.learningplatform.repository.CoursRepository;
import com.example.learningplatform.repository.UtilisateurRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdminService {

    private final UtilisateurRepository utilisateurRepository;
    private final CoursRepository coursRepository;

    public AdminService(UtilisateurRepository utilisateurRepository, CoursRepository coursRepository) {
        this.utilisateurRepository = utilisateurRepository;
        this.coursRepository = coursRepository;
    }

    // gererUtilisateurs : création / mise à jour d'un utilisateur
    public Utilisateur gererUtilisateur(Utilisateur user) {
        return utilisateurRepository.save(user);
    }

    // trouver un utilisateur par id
    public Optional<Utilisateur> trouverUtilisateur(Long id) { return utilisateurRepository.findById(id); }

    // désactiver un utilisateur (soft delete)
    public Optional<Utilisateur> desactiverUtilisateur(Long id) {
        return utilisateurRepository.findById(id).map(user -> {
            user.setActif(false);
            return utilisateurRepository.save(user);
        });
    }

    // lister tous les utilisateurs
    public List<Utilisateur> listerUtilisateurs() { return utilisateurRepository.findAll(); }

    // superviserCours : lister tous les cours
    public List<Cours> superviserCours() { return coursRepository.findAll(); }

    // créer un nouveau cours
    public Cours creerCours(Cours cours) {
        return coursRepository.save(cours);
    }

    // modererContenu : approuver un cours
    public Optional<Cours> approuverCours(Long coursId) {
        Optional<Cours> c = coursRepository.findById(coursId);
        c.ifPresent(co -> { co.setValideParAdmin(true); coursRepository.save(co); });
        return c;
    }

    // modererContenu : rejeter un cours
    public Optional<Cours> rejeterCours(Long coursId) {
        Optional<Cours> c = coursRepository.findById(coursId);
        c.ifPresent(co -> { co.setValideParAdmin(false); coursRepository.save(co); });
        return c;
    }

    // modifier un utilisateur existant
    public Optional<Utilisateur> modifierUtilisateur(Long id, Utilisateur user) {
        return utilisateurRepository.findById(id).map(existing -> {
            existing.setEmail(user.getEmail());
            existing.setRole(user.getRole());
            // Update password only if provided
            if (user.getMotDePasse() != null && !user.getMotDePasse().isEmpty()) {
                existing.setMotDePasse(user.getMotDePasse());
            }
            return utilisateurRepository.save(existing);
        });
    }

    // modifier un cours existant (ne change pas le statut de modération)
    public Optional<Cours> modifierCours(Long id, Cours cours) {
        return coursRepository.findById(id).map(existing -> {
            existing.setTitre(cours.getTitre());
            existing.setDescription(cours.getDescription());
            return coursRepository.save(existing);
        });
    }

    // lister les cours en attente de validation (null = pending)
    public List<Cours> listerCoursEnAttente() {
        return coursRepository.findByValideParAdminIsNull();
    }

    // lister les cours rejetés (false)
    public List<Cours> listerCoursRejetes() {
        return coursRepository.findByValideParAdmin(false);
    }

    // lister les cours validés (true)
    public List<Cours> listerCoursValides() {
        return coursRepository.findByValideParAdmin(true);
    }
}
