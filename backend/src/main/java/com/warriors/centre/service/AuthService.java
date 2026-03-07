package com.warriors.centre.service;

import com.warriors.centre.dto.LoginRequest;
import com.warriors.centre.dto.LoginResponse;
import com.warriors.centre.entity.User;
import com.warriors.centre.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthService {
    
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    
    public AuthService(UserRepository userRepository,
                      JwtService jwtService,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }
    
    public LoginResponse login(LoginRequest request) {
        try {
            // 1. Vérifier si l'utilisateur existe dans la base
            User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email ou mot de passe incorrect"));
            
            // 2. Vérifier le mot de passe
            boolean passwordMatches = passwordEncoder.matches(request.getPassword(), user.getPassword());
            
            if (!passwordMatches) {
                throw new RuntimeException("Email ou mot de passe incorrect");
            }
            
            // 3. Vérifier que le compte est actif
            if (!user.isEnabled()) {
                throw new RuntimeException("Compte désactivé");
            }
            
            // 4. Mettre à jour la dernière connexion
            user.setLastLogin(LocalDateTime.now());
            userRepository.save(user);
            
            // 5. Générer le token JWT
            String token = jwtService.generateToken(user);
            
            // 6. Retourner la réponse
            return new LoginResponse(
                token,
                user.getEmail(),
                user.getNom(),
                user.getPrenom(),
                user.getRole().toString(),
                "Connexion réussie"
            );
            
        } catch (Exception e) {
            throw new RuntimeException("Email ou mot de passe incorrect");
        }
    }
    
    public boolean validateToken(String token) {
        return jwtService.isTokenValid(token);
    }
}