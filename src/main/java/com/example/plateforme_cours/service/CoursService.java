package com.example.plateforme_cours.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.util.Optional;
import java.util.List;

import com.example.plateforme_cours.model.Course;
import com.example.plateforme_cours.model.ResourceType;
import com.example.plateforme_cours.model.SupportPedagogique;
import com.example.plateforme_cours.model.Utilisateur;
import com.example.plateforme_cours.repository.CoursRepository;
import com.example.plateforme_cours.repository.SupportPedagogiqueRepository;
import com.example.plateforme_cours.repository.UtilisateurRepository;

@Service
public class CoursService {

    @Autowired
    private CoursRepository coursRepository;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private SupportPedagogiqueRepository supportPedagogiqueRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    //  publierCours
    public Course publierCours(Course cours, int createurId) {
        Optional<Utilisateur> createur = utilisateurRepository.findById((long) createurId);
        if (createur.isPresent()) {
            cours.setCreateur(createur.get());
            cours.setValideParAdmin(null); // Set to null on creation
            return coursRepository.save(cours);
        }
        return null;
    }

    //  mettreAJourCours
    public Course mettreAJourCours(int id, Course newCours) {
        Optional<Course> coursOpt = coursRepository.findById((long) id);
        if (coursOpt.isPresent()) {
            Course cours = coursOpt.get();
            cours.setTitre(newCours.getTitre());
            cours.setDescription(newCours.getDescription());
            cours.setValideParAdmin(null); // Reset to null on modification
            return coursRepository.save(cours);
        }
        return null;
    }

    //  gererSupports (ajouter un support)
    public SupportPedagogique ajouterSupport(Long coursId, SupportPedagogique support) {
        Optional<Course> coursOpt = coursRepository.findById(coursId);
        if (coursOpt.isPresent()) {
            support.setCours(coursOpt.get());
            return supportPedagogiqueRepository.save(support);
        }
        return null;
    }

    // Liste des cours pour affichage
    public List<Course> getAllCours() {
        return coursRepository.findAll();
    }

    // Upload file support to cloud
    public SupportPedagogique ajouterSupportAvecFichier(Long coursId, MultipartFile file, String typeSupport) {
        Optional<Course> coursOpt = coursRepository.findById(coursId);
        if (coursOpt.isPresent()) {
            // Upload file to Cloudinary
            String fileUrl = cloudinaryService.uploadFile(file);

            // Create support pedagogique
            SupportPedagogique support = new SupportPedagogique();
            support.setCours(coursOpt.get());
            support.setUrl(fileUrl);
            support.setFileName(file.getOriginalFilename());
            // Convert String to ResourceType enum
            support.setTypeSupport(ResourceType.valueOf(typeSupport.toUpperCase()));

            return supportPedagogiqueRepository.save(support);
        }
        return null;
    }

    // Publier un cours avec plusieurs fichiers
    public Course publierCoursAvecFichiers(
            int createurId,
            String titre,
            String description,
            MultipartFile[] files,
            String[] typesSupport) {

        // Create the course first
        Optional<Utilisateur> createur = utilisateurRepository.findById((long) createurId);
        if (!createur.isPresent()) {
            return null;
        }

        Course cours = new Course();
        cours.setTitre(titre);
        cours.setDescription(description);
        cours.setCreateur(createur.get());
        cours.setValideParAdmin(null);

        // Save course first to get ID
        Course savedCours = coursRepository.save(cours);

        // Upload files if provided
        if (files != null && files.length > 0) {
            for (int i = 0; i < files.length; i++) {
                MultipartFile file = files[i];
                if (file != null && !file.isEmpty()) {
                    String typeSupport = (typesSupport != null && i < typesSupport.length)
                        ? typesSupport[i]
                        : "PDF"; // Default to PDF

                    // Upload to Cloudinary
                    String fileUrl = cloudinaryService.uploadFile(file);

                    // Create support
                    SupportPedagogique support = new SupportPedagogique();
                    support.setCours(savedCours);
                    support.setUrl(fileUrl);
                    support.setFileName(file.getOriginalFilename());
                    support.setTypeSupport(ResourceType.valueOf(typeSupport.toUpperCase()));

                    supportPedagogiqueRepository.save(support);
                }
            }
        }

        // Reload course with supports
        return coursRepository.findById(savedCours.getId()).orElse(savedCours);
    }

    // Ajouter plusieurs fichiers à un cours existant
    public Course ajouterFichiersAuCours(
            int coursId,
            MultipartFile[] files,
            String[] typesSupport) {

        Optional<Course> coursOpt = coursRepository.findById((long) coursId);
        if (!coursOpt.isPresent()) {
            return null;
        }

        Course cours = coursOpt.get();

        // Reset validation status when modifying course
        cours.setValideParAdmin(null);

        // Upload files if provided
        if (files != null && files.length > 0) {
            for (int i = 0; i < files.length; i++) {
                MultipartFile file = files[i];
                if (file != null && !file.isEmpty()) {
                    String typeSupport = (typesSupport != null && i < typesSupport.length)
                        ? typesSupport[i]
                        : "PDF"; // Default to PDF

                    // Upload to Cloudinary
                    String fileUrl = cloudinaryService.uploadFile(file);

                    // Create support
                    SupportPedagogique support = new SupportPedagogique();
                    support.setCours(cours);
                    support.setUrl(fileUrl);
                    support.setFileName(file.getOriginalFilename());
                    support.setTypeSupport(ResourceType.valueOf(typeSupport.toUpperCase()));

                    supportPedagogiqueRepository.save(support);
                }
            }
        }

        // Reload course with updated supports
        return coursRepository.findById((long) coursId).orElse(cours);
    }

    // Test method to verify Cloudinary upload
    public String testCloudinaryUpload(MultipartFile file) {
        return cloudinaryService.uploadFile(file);
    }

    // Get courses by creator ID (currently hardcoded to 3)
    public List<Course> getCoursByCreateurId(Long createurId) {
        // Temporarily hardcoded to ID = 3
        return coursRepository.findByCreateurId(3L);
    }

    // Get course by ID without filters
    public Optional<Course> getCoursById(Long id) {
        return coursRepository.findById(id);
    }

    // Get course by ID and creator ID (for verifying ownership)
    public Optional<Course> getCoursByIdAndCreateurId(Long id, Long createurId) {
        // Temporarily hardcoded to ID = 3
        return coursRepository.findByIdAndCreateurId(id, 3L);
    }

    // Get supports by course ID
    public List<SupportPedagogique> getSupportsByCoursId(Long coursId) {
        return supportPedagogiqueRepository.findByCoursId(coursId);
    }
}
