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
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;


@Slf4j
@Service
@RequiredArgsConstructor
public class FileStorageService {

    private final SupabaseConfig supabaseConfig;
    private final FileValidationService fileValidationService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Get a signed URL for a file
     */
    public String getSignedUrl(String filePath, int expiresInSeconds) throws IOException {
        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            String signUrl = String.format("%s/storage/v1/object/sign/%s/%s",
                    supabaseConfig.getSupabaseUrl(),
                    supabaseConfig.getBucket(),
                    filePath);

            HttpPost signRequest = new HttpPost(signUrl);

            // Set headers
            signRequest.setHeader("Authorization", "Bearer " + supabaseConfig.getServiceRoleKey());
            signRequest.setHeader("apikey", supabaseConfig.getServiceRoleKey());
            signRequest.setHeader("Content-Type", "application/json");

            // Set expiration time in request body
            String jsonBody = String.format("{\"expiresIn\":%d}", expiresInSeconds);
            signRequest.setEntity(new org.apache.hc.core5.http.io.entity.StringEntity(jsonBody));

            try (CloseableHttpResponse response = httpClient.execute(signRequest)) {
                int statusCode = response.getCode();
                String responseBody = EntityUtils.toString(response.getEntity());

                if (statusCode >= 200 && statusCode < 300) {
                    // Parse the signed URL from response
                    // Response format: {"signedURL": "https://..."}
                    String signedUrl = parseSignedUrlFromResponse(responseBody);
                    log.info("Generated signed URL for: {}", filePath);
                    return signedUrl;
                } else {
                    log.error("Failed to generate signed URL. Status: {}, Response: {}", statusCode, responseBody);
                    throw new IOException("Failed to generate signed URL");
                }
            }
        } catch (Exception e) {
            log.error("Error generating signed URL for: {}", filePath, e);
            throw new IOException("Error generating signed URL", e);
        }
    }


    /**
     * Parse signed URL from Supabase response
     */
    private String parseSignedUrlFromResponse(String responseBody) {
        // Response format: {"signedURL":"/object/sign/SEPM/...?token=..."}
        int startIndex = responseBody.indexOf("\"signedURL\":\"") + 13;
        int endIndex = responseBody.lastIndexOf("\"");

        String signedPath = responseBody.substring(startIndex, endIndex);

        // Supabase returns path without /storage/v1, so we need to add it
        if (!signedPath.startsWith("/storage/v1")) {
            signedPath = "/storage/v1" + signedPath;
        }

        return supabaseConfig.getSupabaseUrl() + signedPath;
    }

    /**
     * Extract file path from either signed or public URL
     */
    private String extractFilePathFromUrl(String fileUrl) {
        try {
            // Try signed URL format first: /storage/v1/object/sign/SEPM/folder/file.ext?token=...
            if (fileUrl.contains("/object/sign/")) {
                String[] parts = fileUrl.split("/object/sign/" + supabaseConfig.getBucket() + "/");
                if (parts.length >= 2) {
                    // Remove query parameters (token)
                    String pathWithToken = parts[1];
                    int tokenIndex = pathWithToken.indexOf("?token=");
                    if (tokenIndex > 0) {
                        return pathWithToken.substring(0, tokenIndex);
                    }
                    return pathWithToken;
                }
            }

            // Try public URL format: /storage/v1/object/public/SEPM/folder/file.ext
            if (fileUrl.contains("/object/public/")) {
                String[] parts = fileUrl.split("/object/public/" + supabaseConfig.getBucket() + "/");
                if (parts.length >= 2) {
                    return parts[1];
                }
            }

            return null;
        } catch (Exception e) {
            log.error("Error extracting file path from URL: {}", fileUrl, e);
            return null;
        }
    }
    /**
     * Upload single file to Supabase Storage
     */
    public String uploadFile(MultipartFile file, String folder) throws IOException {
        if (file == null || file.isEmpty()) {
            return null;
        }

        validateFileByFolder(file, folder);

        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String fileName = folder + "/" + UUID.randomUUID() + extension;

        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            String uploadUrl = String.format("%s/storage/v1/object/%s/%s",
                    supabaseConfig.getSupabaseUrl(),
                    supabaseConfig.getBucket(),
                    fileName);

            HttpPost uploadRequest = new HttpPost(uploadUrl);
            uploadRequest.setHeader("Authorization", "Bearer " + supabaseConfig.getServiceRoleKey());
            uploadRequest.setHeader("apikey", supabaseConfig.getServiceRoleKey());
            uploadRequest.setHeader("Content-Type", file.getContentType());

            uploadRequest.setEntity(new org.apache.hc.core5.http.io.entity.ByteArrayEntity(
                    file.getBytes(),
                    ContentType.create(file.getContentType())
            ));

            try (CloseableHttpResponse response = httpClient.execute(uploadRequest)) {
                int statusCode = response.getCode();

                if (statusCode >= 200 && statusCode < 300) {
                    // Generate signed URL instead of public URL
                    String signedUrl = getSignedUrl(fileName, 31536000); // 1 year expiration
                    log.info("File uploaded successfully: {} -> {}", originalFilename, signedUrl);
                    return signedUrl;
                } else {
                    String responseBody = EntityUtils.toString(response.getEntity());
                    log.error("Failed to upload file. Status: {}, Response: {}", statusCode, responseBody);
                    throw new IOException("Failed to upload file to Supabase");
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

            // Extract file path from signed URL
            // Signed URL format: https://dzysmnulhfhvownkvoct.supabase.co/storage/v1/object/sign/SEPM/folder/filename.ext?token=...
            // Public URL format: https://dzysmnulhfhvownkvoct.supabase.co/storage/v1/object/public/SEPM/folder/filename.ext

            String filePath = extractFilePathFromUrl(fileUrl);

            if (filePath == null) {
                log.warn("Cannot parse file path from URL: {}", fileUrl);
                return false;
            }

            try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
                String deleteUrl = String.format("%s/storage/v1/object/%s/%s",
                        supabaseConfig.getSupabaseUrl(),
                        supabaseConfig.getBucket(),
                        filePath);

                HttpDelete deleteRequest = new HttpDelete(deleteUrl);

                // Set headers with admin service key
                deleteRequest.setHeader("Authorization", "Bearer " + supabaseConfig.getServiceRoleKey());
                deleteRequest.setHeader("apikey", supabaseConfig.getServiceRoleKey());

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