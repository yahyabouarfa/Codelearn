package com.example.learningplatform.controller;

import com.example.learningplatform.model.Cours;
import com.example.learningplatform.model.Utilisateur;
import com.example.learningplatform.repository.CoursRepository;
import com.example.learningplatform.repository.UtilisateurRepository;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.*;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class AdminControllerIT {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private CoursRepository coursRepository;

    private String baseUrl(String path) {
        return "http://localhost:" + port + path;
    }

    @BeforeEach
    void setUp() {
        // Clean up test data before each test
        coursRepository.deleteAll();
        utilisateurRepository.deleteAll();
    }

    @Test
    @Order(1)
    void shouldTestDatabaseConnection() {
        ResponseEntity<String> response = restTemplate.getForEntity(
                baseUrl("/api/admin/db-test"), String.class);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().contains("SUCCESS") || response.getBody().contains("connected"));
    }

    @Test
    @Order(2)
    void shouldListUsers() {
        // Create test user
        Utilisateur user = Utilisateur.builder()
                .nom("Test")
                .prenom("User")
                .email("test@example.com")
                .role("STUDENT")
                .actif(true)
                .motDePasse("password123")
                .build();
        utilisateurRepository.save(user);

        ResponseEntity<Utilisateur[]> listResp = restTemplate.getForEntity(
                baseUrl("/api/admin/users"), Utilisateur[].class);

        assertEquals(HttpStatus.OK, listResp.getStatusCode());
        assertNotNull(listResp.getBody());
        assertTrue(listResp.getBody().length >= 1);
    }

    @Test
    @Order(3)
    void shouldDeactivateUser() {
        // Create test user
        Utilisateur user = Utilisateur.builder()
                .nom("Alice")
                .prenom("Smith")
                .email("alice@example.com")
                .role("TEACHER")
                .actif(true)
                .motDePasse("password123")
                .build();
        user = utilisateurRepository.save(user);

        ResponseEntity<Utilisateur> deactivateResp = restTemplate.exchange(
                baseUrl("/api/admin/users/" + user.getId() + "/deactivate"),
                HttpMethod.PUT,
                null,
                Utilisateur.class);

        assertEquals(HttpStatus.OK, deactivateResp.getStatusCode());
        assertNotNull(deactivateResp.getBody());
        assertFalse(deactivateResp.getBody().getActif());

        // Verify in database
        Utilisateur refreshed = utilisateurRepository.findById(user.getId()).orElseThrow();
        assertFalse(refreshed.getActif());
    }

    @Test
    @Order(4)
    void shouldDeactivateUserReturns404WhenNotFound() {
        ResponseEntity<Utilisateur> response = restTemplate.exchange(
                baseUrl("/api/admin/users/999999/deactivate"),
                HttpMethod.PUT,
                null,
                Utilisateur.class);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    @Order(5)
    void shouldListAllCourses() {
        // Create test course
        Utilisateur creator = Utilisateur.builder()
                .nom("Teacher")
                .prenom("John")
                .email("teacher@example.com")
                .role("TEACHER")
                .actif(true)
                .motDePasse("password123")
                .build();
        creator = utilisateurRepository.save(creator);

        Cours course = Cours.builder()
                .titre("Test Course")
                .description("Test Description")
                .createur(creator)
                .valideParAdmin(null)
                .build();
        coursRepository.save(course);

        ResponseEntity<Cours[]> response = restTemplate.getForEntity(
                baseUrl("/api/admin/cours"), Cours[].class);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().length >= 1);
    }

    @Test
    @Order(6)
    void shouldApproveCours() {
        // Create test course
        Cours course = Cours.builder()
                .titre("Java 101")
                .description("Introduction au Java")
                .valideParAdmin(null)
                .build();
        course = coursRepository.save(course);

        ResponseEntity<Cours> approveResp = restTemplate.postForEntity(
                baseUrl("/api/admin/cours/" + course.getId() + "/approve"),
                null,
                Cours.class);

        assertEquals(HttpStatus.OK, approveResp.getStatusCode());
        assertNotNull(approveResp.getBody());
        assertTrue(approveResp.getBody().getValideParAdmin());

        // Verify in database
        Cours refreshed = coursRepository.findById(course.getId()).orElseThrow();
        assertTrue(refreshed.getValideParAdmin());
    }

    @Test
    @Order(7)
    void shouldRejectCours() {
        // Create test course
        Cours course = Cours.builder()
                .titre("Bad Course")
                .description("This should be rejected")
                .valideParAdmin(null)
                .build();
        course = coursRepository.save(course);

        ResponseEntity<Cours> rejectResp = restTemplate.postForEntity(
                baseUrl("/api/admin/cours/" + course.getId() + "/reject"),
                null,
                Cours.class);

        assertEquals(HttpStatus.OK, rejectResp.getStatusCode());
        assertNotNull(rejectResp.getBody());
        assertFalse(rejectResp.getBody().getValideParAdmin());

        // Verify in database
        Cours refreshed = coursRepository.findById(course.getId()).orElseThrow();
        assertFalse(refreshed.getValideParAdmin());
    }

    @Test
    @Order(8)
    void shouldListPendingCourses() {
        // Create pending course
        Cours pendingCourse = Cours.builder()
                .titre("Pending Course")
                .description("Awaiting approval")
                .valideParAdmin(null)
                .build();
        coursRepository.save(pendingCourse);

        ResponseEntity<Cours[]> response = restTemplate.getForEntity(
                baseUrl("/api/admin/cours/pending"), Cours[].class);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().length >= 1);
        assertNull(response.getBody()[0].getValideParAdmin());
    }

    @Test
    @Order(9)
    void shouldListApprovedCourses() {
        // Create approved course
        Cours approvedCourse = Cours.builder()
                .titre("Approved Course")
                .description("Already approved")
                .valideParAdmin(true)
                .build();
        coursRepository.save(approvedCourse);

        ResponseEntity<Cours[]> response = restTemplate.getForEntity(
                baseUrl("/api/admin/cours/approved"), Cours[].class);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().length >= 1);
        assertTrue(response.getBody()[0].getValideParAdmin());
    }

    @Test
    @Order(10)
    void shouldListRejectedCourses() {
        // Create rejected course
        Cours rejectedCourse = Cours.builder()
                .titre("Rejected Course")
                .description("Already rejected")
                .valideParAdmin(false)
                .build();
        coursRepository.save(rejectedCourse);

        ResponseEntity<Cours[]> response = restTemplate.getForEntity(
                baseUrl("/api/admin/cours/rejected"), Cours[].class);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().length >= 1);
        assertFalse(response.getBody()[0].getValideParAdmin());
    }

    @Test
    @Order(11)
    void shouldReturn404WhenApprovingNonExistentCourse() {
        ResponseEntity<Cours> response = restTemplate.postForEntity(
                baseUrl("/api/admin/cours/999999/approve"),
                null,
                Cours.class);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    @Order(12)
    void shouldReturn404WhenRejectingNonExistentCourse() {
        ResponseEntity<Cours> response = restTemplate.postForEntity(
                baseUrl("/api/admin/cours/999999/reject"),
                null,
                Cours.class);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }
}
