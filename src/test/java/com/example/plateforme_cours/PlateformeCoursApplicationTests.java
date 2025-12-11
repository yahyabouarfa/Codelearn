package com.example.plateforme_cours;

import com.example.plateforme_cours.model.Course;
import com.example.plateforme_cours.model.Utilisateur;
import com.example.plateforme_cours.model.SupportPedagogique;
import com.example.plateforme_cours.model.ResourceType;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestPropertySource(properties = {
	"spring.datasource.url=jdbc:h2:mem:testdb",
	"spring.datasource.driver-class-name=org.h2.Driver",
	"spring.jpa.hibernate.ddl-auto=create-drop"
})
class PlateformeCoursApplicationTests {

	@Test
	void contextLoads() {
		// Test that the Spring context loads successfully
		assertDoesNotThrow(() -> {
			// Context loaded successfully
		});
	}

	@Test
	void testCourseModelCreation() {
		// Test creating a Course object
		Course course = new Course();
		course.setTitre("Introduction à Java");
		course.setDescription("Cours complet sur Java");

		assertNotNull(course);
		assertEquals("Introduction à Java", course.getTitre());
		assertEquals("Cours complet sur Java", course.getDescription());
	}

	@Test
	void testUtilisateurModelCreation() {
		// Test creating an Utilisateur object
		Utilisateur user = Utilisateur.builder()
			.nom("Doe")
			.prenom("John")
			.email("john.doe@example.com")
			.motDePasse("password123")
			.role("CreateurDeCours")
			.build();

		assertNotNull(user);
		assertEquals("Doe", user.getNom());
		assertEquals("John", user.getPrenom());
		assertEquals("john.doe@example.com", user.getEmail());
		assertEquals("CreateurDeCours", user.getRole());
	}

	@Test
	void testSupportPedagogiqueModelCreation() {
		// Test creating a SupportPedagogique object
		SupportPedagogique support = new SupportPedagogique();
		support.setTypeSupport(ResourceType.PDF);
		support.setUrl("https://example.com/document.pdf");

		assertNotNull(support);
		assertEquals(ResourceType.PDF, support.getTypeSupport());
		assertEquals("https://example.com/document.pdf", support.getUrl());
	}

	@Test
	void testCourseWithUtilisateur() {
		// Test relationship between Course and Utilisateur
		Utilisateur creator = Utilisateur.builder()
			.nom("Smith")
			.prenom("Jane")
			.email("jane.smith@example.com")
			.role("CreateurDeCours")
			.build();

		Course course = new Course();
		course.setTitre("Spring Boot Avancé");
		course.setDescription("Maîtrisez Spring Boot");
		course.setCreateur(creator);

		assertNotNull(course.getCreateur());
		assertEquals("Smith", course.getCreateur().getNom());
		assertEquals("Jane", course.getCreateur().getPrenom());
	}

	@Test
	void testSupportPedagogiqueWithCourse() {
		// Test relationship between SupportPedagogique and Course
		Course course = new Course();
		course.setTitre("Test Course");

		SupportPedagogique support = new SupportPedagogique();
		support.setTypeSupport(ResourceType.VIDEO);
		support.setUrl("https://cloudinary.com/video.mp4");
		support.setCours(course);

		assertNotNull(support.getCours());
		assertEquals("Test Course", support.getCours().getTitre());
		assertEquals(ResourceType.VIDEO, support.getTypeSupport());
	}
}
