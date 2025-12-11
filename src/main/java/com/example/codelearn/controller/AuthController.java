package com.example.codelearn.controller;

import com.example.codelearn.dto.AuthResponse;
import com.example.codelearn.dto.LoginRequest;
import com.example.codelearn.dto.SignupRequest;
import com.example.codelearn.service.UtilisateurService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UtilisateurService utilisateurService;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest request) {
        AuthResponse response = utilisateurService.signup(request);
        if (response.getToken() == null) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = utilisateurService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<AuthResponse> logout() {
        // With JWT, logout is handled client-side by removing the token
        // Optionally, you can implement token blacklisting here
        return ResponseEntity.ok(AuthResponse.builder()
                .message("Déconnexion réussie")
                .build());
    }
}

