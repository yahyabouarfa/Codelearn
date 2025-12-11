package com.example.learningplatform.controller;

import com.example.learningplatform.model.Cours;
import com.example.learningplatform.model.Utilisateur;
import com.example.learningplatform.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.sql.DataSource;
import java.sql.Connection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;
    private final DataSource dataSource;

    public AdminController(AdminService adminService, DataSource dataSource) {
        this.adminService = adminService;
        this.dataSource = dataSource;
    }

    // Test database connection
    @GetMapping("/db-test")
    public ResponseEntity<Map<String, Object>> testDatabaseConnection() {
        Map<String, Object> response = new HashMap<>();
        try (Connection connection = dataSource.getConnection()) {
            response.put("status", "SUCCESS");
            response.put("connected", true);
            response.put("databaseProductName", connection.getMetaData().getDatabaseProductName());
            response.put("databaseProductVersion", connection.getMetaData().getDatabaseProductVersion());
            response.put("driverName", connection.getMetaData().getDriverName());
            response.put("driverVersion", connection.getMetaData().getDriverVersion());
            response.put("url", connection.getMetaData().getURL());
            response.put("username", connection.getMetaData().getUserName());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "ERROR");
            response.put("connected", false);
            response.put("error", e.getMessage());
            response.put("errorType", e.getClass().getSimpleName());
            return ResponseEntity.status(500).body(response);
        }
    }

    // Manage users
    @GetMapping("/users")
    public List<Utilisateur> listUsers() {
        return adminService.listerUtilisateurs();
    }


    @PutMapping("/users/{id}/deactivate")
    public ResponseEntity<Utilisateur> deactivateUser(@PathVariable Long id) {
        return adminService.desactiverUtilisateur(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    // Supervise courses
    @GetMapping("/cours")
    public List<Cours> listCours() {
        return adminService.superviserCours();
    }


    // List courses by validation status
    @GetMapping("/cours/pending")
    public List<Cours> listPendingCours() {
        return adminService.listerCoursEnAttente();  // null = pending
    }

    @GetMapping("/cours/rejected")
    public List<Cours> listRejectedCours() {
        return adminService.listerCoursRejetes();  // false = rejected
    }

    @GetMapping("/cours/approved")
    public List<Cours> listApprovedCours() {
        return adminService.listerCoursValides();  // true = approved
    }

    // Moderate content
    @PostMapping("/cours/{id}/approve")
    public ResponseEntity<Cours> approveCours(@PathVariable Long id) {
        return adminService.approuverCours(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/cours/{id}/reject")
    public ResponseEntity<Cours> rejectCours(@PathVariable Long id) {
        return adminService.rejeterCours(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


}
