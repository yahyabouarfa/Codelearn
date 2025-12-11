package com.example.plateforme_cours.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    @Autowired
    public CloudinaryService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    public String uploadFile(MultipartFile file) {
        try {
            System.out.println("=== UPLOADING FILE TO CLOUDINARY ===");
            System.out.println("File name: " + file.getOriginalFilename());
            System.out.println("File size: " + file.getSize() + " bytes");
            System.out.println("Content type: " + file.getContentType());

            // Upload file to Cloudinary with auto resource type detection
            Map uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                    "resource_type", "auto",
                    "folder", "cours-supports",
                    "use_filename", true,
                    "unique_filename", true
                )
            );

            // Log the full response for debugging
            System.out.println("\n=== CLOUDINARY UPLOAD RESPONSE ===");
            uploadResult.forEach((key, value) ->
                System.out.println(key + ": " + value)
            );
            System.out.println("==================================\n");

            // Extract secure_url (this is the HTTPS URL where file is stored)
            String secureUrl = (String) uploadResult.get("secure_url");

            // Also try url as fallback
            if (secureUrl == null || secureUrl.isEmpty()) {
                secureUrl = (String) uploadResult.get("url");
            }

            if (secureUrl == null || secureUrl.isEmpty()) {
                throw new RuntimeException("Cloudinary did not return a valid URL");
            }

            System.out.println("✓ File uploaded successfully!");
            System.out.println("✓ Accessible URL: " + secureUrl);
            System.out.println("✓ Public ID: " + uploadResult.get("public_id"));
            System.out.println("=====================================\n");

            return secureUrl;

        } catch (IOException e) {
            System.err.println("✗ Cloudinary upload failed: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Cloudinary upload failed: " + e.getMessage(), e);
        } catch (Exception e) {
            System.err.println("✗ Unexpected error during upload: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Upload failed: " + e.getMessage(), e);
        }
    }

    public void deleteFile(String publicId) throws IOException {
        try {
            Map result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            System.out.println("File deleted from Cloudinary: " + publicId);
            System.out.println("Delete result: " + result);
        } catch (Exception e) {
            System.err.println("Failed to delete file from Cloudinary: " + e.getMessage());
            throw new IOException("Failed to delete file: " + e.getMessage(), e);
        }
    }
}


