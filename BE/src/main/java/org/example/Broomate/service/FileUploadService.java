package org.example.Broomate.service;

import com.google.cloud.storage.Acl;
import com.google.cloud.storage.Blob;
import com.google.cloud.storage.Bucket;
import com.google.firebase.cloud.StorageClient;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
public class FileUploadService {

    /**
     * Upload single file to Firebase Storage
     */
    public String uploadFile(MultipartFile file, String folder) throws IOException {
        if (file == null || file.isEmpty()) {
            return null;
        }

        // Validate file size (10MB limit per file)
        long maxSize = 10 * 1024 * 1024;
        if (file.getSize() > maxSize) {
            throw new IllegalArgumentException("File size exceeds 10MB limit");
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String fileName = folder + "/" + UUID.randomUUID() + extension;

        // Get Firebase Storage bucket
        Bucket bucket = StorageClient.getInstance().bucket();

        // Upload file
        Blob blob = bucket.create(
                fileName,
                file.getBytes(),
                file.getContentType()
        );

        // Make file publicly accessible
        blob.createAcl(Acl.of(Acl.User.ofAllUsers(), Acl.Role.READER));

        // Generate public URL
        String publicUrl = String.format(
                "https://firebasestorage.googleapis.com/v0/b/%s/o/%s?alt=media",
                bucket.getName(),
                fileName.replace("/", "%2F")
        );

        log.info("File uploaded successfully: {}", publicUrl);
        return publicUrl;
    }

    /**
     * Upload multiple files
     */
    public List<String> uploadFiles(List<MultipartFile> files, String folder) throws IOException {
        List<String> urls = new ArrayList<>();

        if (files == null || files.isEmpty()) {
            return urls;
        }

        for (MultipartFile file : files) {
            if (file != null && !file.isEmpty()) {
                try {
                    String url = uploadFile(file, folder);
                    if (url != null) {
                        urls.add(url);
                    }
                } catch (Exception e) {
                    log.error("Failed to upload file: {}", file.getOriginalFilename(), e);
                    // Continue with other files
                }
            }
        }

        return urls;
    }

    /**
     * Delete file from Firebase Storage
     */
    public boolean deleteFile(String fileUrl) {
        try {
            if (fileUrl == null || !fileUrl.contains("firebasestorage.googleapis.com")) {
                return false;
            }

            String[] parts = fileUrl.split("/o/");
            if (parts.length < 2) {
                return false;
            }

            String fileName = parts[1].split("\\?")[0];
            fileName = fileName.replace("%2F", "/");

            Bucket bucket = StorageClient.getInstance().bucket();
            Blob blob = bucket.get(fileName);

            if (blob != null) {
                boolean deleted = blob.delete();
                log.info("File deleted from Firebase Storage: {}", fileName);
                return deleted;
            }

            return false;
        } catch (Exception e) {
            log.error("Error deleting file: {}", fileUrl, e);
            return false;
        }
    }

    /**
     * Delete multiple files
     */
    public void deleteFiles(List<String> fileUrls) {
        if (fileUrls == null || fileUrls.isEmpty()) {
            return;
        }

        for (String url : fileUrls) {
            deleteFile(url);
        }
    }
}