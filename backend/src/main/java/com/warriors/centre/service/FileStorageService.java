package com.warriors.centre.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {
    
    @Value("${file.upload-dir:uploads/professors}")
    private String uploadDir;
    
    @Value("${file.base-url:http://localhost:8080}")
    private String baseUrl;
    
    public String storeFile(MultipartFile file, String professorId) throws IOException {
        // Créer le répertoire s'il n'existe pas
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        // Valider le fichier
        validateFile(file);
        
        // Générer un nom de fichier unique
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String filename = "prof_" + professorId + "_" + UUID.randomUUID().toString() + extension;
        
        // Copier le fichier
        Path targetLocation = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
        
        // Retourner l'URL complète
        return baseUrl + "/uploads/professors/" + filename;
    }
    
    public void deleteFile(String fileUrl) {
        try {
            if (fileUrl != null && fileUrl.startsWith(baseUrl)) {
                String filename = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
                Path filePath = Paths.get(uploadDir).resolve(filename);
                Files.deleteIfExists(filePath);
            }
        } catch (IOException e) {
            // Log l'erreur mais ne pas bloquer
            System.err.println("Erreur lors de la suppression du fichier: " + e.getMessage());
        }
    }
    
    private void validateFile(MultipartFile file) throws IOException {
        // Vérifier que le fichier n'est pas vide
        if (file.isEmpty()) {
            throw new IOException("Le fichier est vide");
        }
        
        // Vérifier la taille (max 5MB)
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new IOException("Le fichier est trop volumineux (max 5MB)");
        }
        
        // Vérifier le type MIME
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IOException("Le fichier doit être une image");
        }
        
        // Vérifier l'extension
        String filename = file.getOriginalFilename();
        String extension = filename.substring(filename.lastIndexOf(".")).toLowerCase();
        if (!extension.matches("\\.(jpg|jpeg|png|gif|webp)$")) {
            throw new IOException("Format de fichier non supporté. Utilisez JPG, PNG, GIF ou WebP");
        }
    }
}