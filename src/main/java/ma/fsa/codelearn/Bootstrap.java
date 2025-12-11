package ma.fsa.codelearn;

import ma.fsa.codelearn.domain.*;
import ma.fsa.codelearn.repo.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class Bootstrap implements CommandLineRunner {
    private final UserRepo users;
    private final LanguageRepo languages;
    private final CourseRepo courses;

    public Bootstrap(UserRepo users, LanguageRepo languages, CourseRepo courses) {
        this.users = users;
        this.languages = languages;
        this.courses = courses;
    }

    @Override @Transactional
    public void run(String... args) {
        if (users.count() > 0) return; // already seeded

        User salma = new User();
        salma.setNom("Salma");
        salma.setEmail("salma@example.com");
        salma.setMotDePasse("hashed");
        salma.setRole(Role.CreateurDeCours);
        users.save(salma);

        Language java = new Language();
        java.setNom("Java");
        languages.save(java);

        Course intro = new Course();
        intro.setTitre("Introduction à Java");
        intro.setCreateur(salma);
        courses.save(intro);
    }
}
