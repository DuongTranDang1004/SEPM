package org.example.Broomate.service;

import com.google.cloud.storage.Acl;
import com.google.cloud.storage.Blob;
import com.google.cloud.storage.Bucket;
import com.google.firebase.cloud.StorageClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
@Slf4j
@Service
@RequiredArgsConstructor
public class FileUploadService {

    private final FileValidationService fileValidationService;

    /**
     * Upload single file with validation
     */
    public String uploadFile(MultipartFile file, String folder) throws IOException {
        if (file == null || file.isEmpty()) {
            return null;
        }

        // Validate based on folder type
        switch (folder) {
            case "thumbnails":
            case "images":
                fileValidationService.validateImage(file);
                break;
            case "videos":
                fileValidationService.validateVideo(file);
                break;
            case "documents":
                fileValidationService.validateDocument(file);
                break;
            default:
                throw new IllegalArgumentException("Invalid folder type: " + folder);
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String fileName = folder + "/" + UUID.randomUUID() + extension;

        // Upload to Firebase Storage
        Bucket bucket = StorageClient.getInstance().bucket();
        Blob blob = bucket.create(fileName, file.getBytes(), file.getContentType());
        blob.createAcl(Acl.of(Acl.User.ofAllUsers(), Acl.Role.READER));

        String publicUrl = String.format(
                "https://firebasestorage.googleapis.com/v0/b/%s/o/%s?alt=media",
                bucket.getName(),
                fileName.replace("/", "%2F")
        );

        log.info("File uploaded successfully: {}", publicUrl);
        return publicUrl;
    }

    // ... rest of the methods
}