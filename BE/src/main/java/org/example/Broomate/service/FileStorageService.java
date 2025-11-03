package org.example.Broomate.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.hc.client5.http.classic.methods.HttpDelete;
import org.apache.hc.client5.http.classic.methods.HttpPost;
import org.apache.hc.client5.http.entity.mime.MultipartEntityBuilder;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.CloseableHttpResponse;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.http.ContentType;
import org.apache.hc.core5.http.HttpEntity;
import org.apache.hc.core5.http.ParseException;
import org.apache.hc.core5.http.io.entity.EntityUtils;
import org.example.Broomate.config.SupabaseConfig;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class FileStorageService {

    private final SupabaseConfig supabaseConfig;
    private final FileValidationService fileValidationService;

    /**
     * Upload single file to Supabase Storage
     */
    public String uploadFile(MultipartFile file, String folder) throws IOException {
        if (file == null || file.isEmpty()) {
            return null;
        }

        // Validate file based on folder type
        validateFileByFolder(file, folder);

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String fileName = folder + "/" + UUID.randomUUID() + extension;

        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            // Build upload URL
            String uploadUrl = String.format("%s/storage/v1/object/%s/%s",
                    supabaseConfig.getSupabaseUrl(),
                    supabaseConfig.getBucket(),
                    fileName);

            HttpPost uploadRequest = new HttpPost(uploadUrl);

            // Set headers with access key
            uploadRequest.setHeader("Authorization", "Bearer " + supabaseConfig.getApiKey());
            uploadRequest.setHeader("apikey", supabaseConfig.getApiKey());

            // Build multipart entity
            HttpEntity entity = MultipartEntityBuilder.create()
                    .addBinaryBody("file", file.getBytes(),
                            ContentType.create(Objects.requireNonNull(file.getContentType())),
                            originalFilename)
                    .build();

            uploadRequest.setEntity(entity);

            // Execute upload
            try (CloseableHttpResponse response = httpClient.execute(uploadRequest)) {
                int statusCode = response.getCode();

                if (statusCode >= 200 && statusCode < 300) {
                    // Get public URL
                    String publicUrl = supabaseConfig.getPublicUrl(fileName);
                    log.info("File uploaded successfully to Supabase: {} -> {}", originalFilename, publicUrl);
                    return publicUrl;
                } else {
                    String responseBody = EntityUtils.toString(response.getEntity());
                    log.error("Failed to upload file. Status: {}, Response: {}", statusCode, responseBody);
                    throw new IOException("Failed to upload file to Supabase. Status: " + statusCode);
                }
            } catch (ParseException e) {
                throw new RuntimeException(e);
            }
        }
    }

    /**
     * Upload multiple files
     */
    public List<String> uploadFiles(List<MultipartFile> files, String folder) throws IOException {
        List<String> urls = new ArrayList<>();

        if (files == null || files.isEmpty()) {
            return urls;
        }

        // Validate all files first
        validateFilesByFolder(files, folder);

        for (MultipartFile file : files) {
            if (file != null && !file.isEmpty()) {
                try {
                    String url = uploadFile(file, folder);
                    if (url != null) {
                        urls.add(url);
                    }
                } catch (Exception e) {
                    log.error("Failed to upload file: {}", file.getOriginalFilename(), e);
                    // Re-throw to maintain atomicity
                    throw new IOException("Failed to upload file: " + file.getOriginalFilename(), e);
                }
            }
        }

        return urls;
    }

    /**
     * Delete file from Supabase Storage
     */
    public boolean deleteFile(String fileUrl) {
        try {
            if (fileUrl == null || fileUrl.isEmpty() || !fileUrl.contains("supabase")) {
                log.warn("Invalid file URL for deletion: {}", fileUrl);
                return false;
            }

            // Extract file path from URL
            // URL format: https://dzysmnulhfhvownkvoct.supabase.co/storage/v1/object/public/SEPM/folder/filename.ext
            String[] parts = fileUrl.split("/object/public/" + supabaseConfig.getBucket() + "/");
            if (parts.length < 2) {
                log.warn("Cannot parse file path from URL: {}", fileUrl);
                return false;
            }

            String filePath = parts[1];

            try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
                String deleteUrl = String.format("%s/storage/v1/object/%s/%s",
                        supabaseConfig.getSupabaseUrl(),
                        supabaseConfig.getBucket(),
                        filePath);

                HttpDelete deleteRequest = new HttpDelete(deleteUrl);

                // Set headers with access key
//                deleteRequest.setHeader("Authorization", "Bearer " + supabaseConfig.getAccessKeyId());
//                deleteRequest.setHeader("apikey", supabaseConfig.getAccessKeyId());

                deleteRequest.setHeader("Authorization", "Bearer " + supabaseConfig.getApiKey());
                deleteRequest.setHeader("apikey", supabaseConfig.getApiKey());

                try (CloseableHttpResponse response = httpClient.execute(deleteRequest)) {
                    int statusCode = response.getCode();

                    if (statusCode >= 200 && statusCode < 300) {
                        log.info("File deleted from Supabase Storage: {}", filePath);
                        return true;
                    } else {
                        String responseBody = EntityUtils.toString(response.getEntity());
                        log.warn("Failed to delete file. Status: {}, Response: {}", statusCode, responseBody);
                        return false;
                    }
                }
            }
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

        int deletedCount = 0;
        for (String url : fileUrls) {
            if (deleteFile(url)) {
                deletedCount++;
            }
        }
        log.info("Deleted {}/{} files from Supabase Storage", deletedCount, fileUrls.size());
    }

    /**
     * Validate file based on folder type
     */
    private void validateFileByFolder(MultipartFile file, String folder) {
        switch (folder) {
            case "avatars":
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
    }

    /**
     * Validate multiple files based on folder type
     */
    private void validateFilesByFolder(List<MultipartFile> files, String folder) {
        if (files == null || files.isEmpty()) {
            return;
        }

        switch (folder) {
            case "avatars":
            case "thumbnails":
            case "images":
                fileValidationService.validateImages(files);
                break;
            case "videos":
                fileValidationService.validateVideos(files);
                break;
            case "documents":
                fileValidationService.validateDocuments(files);
                break;
            default:
                throw new IllegalArgumentException("Invalid folder type: " + folder);
        }
    }
}