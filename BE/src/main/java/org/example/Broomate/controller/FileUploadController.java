package org.example.Broomate.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.Broomate.service.FileUploadService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
@Tag(name = "File Upload", description = "Firebase Storage file upload endpoints")
public class FileUploadController {

    private final FileUploadService fileUploadService;

    @PostMapping("/thumbnail")
    @Operation(summary = "Upload thumbnail image")
    public ResponseEntity<Map<String, String>> uploadThumbnail(
            @RequestParam("file") MultipartFile file) {
        try {
            String url = fileUploadService.uploadFile(file, "thumbnails");

            Map<String, String> response = new HashMap<>();
            response.put("url", url);
            response.put("message", "Thumbnail uploaded successfully");

            return ResponseEntity.ok(response);
        } catch (IOException e) {
            log.error("Error uploading thumbnail", e);
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to upload thumbnail: " + e.getMessage()
            );
        }
    }

    @PostMapping("/images")
    @Operation(summary = "Upload multiple images")
    public ResponseEntity<Map<String, Object>> uploadImages(
            @RequestParam("files") List<MultipartFile> files) {
        try {
            List<String> urls = fileUploadService.uploadFiles(files, "images");

            Map<String, Object> response = new HashMap<>();
            response.put("urls", urls);
            response.put("count", urls.size());
            response.put("message", "Images uploaded successfully");

            return ResponseEntity.ok(response);
        } catch (IOException e) {
            log.error("Error uploading images", e);
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to upload images: " + e.getMessage()
            );
        }
    }

    @PostMapping("/video")
    @Operation(summary = "Upload single video")
    public ResponseEntity<Map<String, String>> uploadVideo(
            @RequestParam("file") MultipartFile file) {
        try {
            String url = fileUploadService.uploadFile(file, "videos");

            Map<String, String> response = new HashMap<>();
            response.put("url", url);
            response.put("message", "Video uploaded successfully");

            return ResponseEntity.ok(response);
        } catch (IOException e) {
            log.error("Error uploading video", e);
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to upload video: " + e.getMessage()
            );
        }
    }

    @PostMapping("/videos")
    @Operation(summary = "Upload multiple videos")
    public ResponseEntity<Map<String, Object>> uploadVideos(
            @RequestParam("files") List<MultipartFile> files) {
        try {
            List<String> urls = fileUploadService.uploadFiles(files, "videos");

            Map<String, Object> response = new HashMap<>();
            response.put("urls", urls);
            response.put("count", urls.size());
            response.put("message", "Videos uploaded successfully");

            return ResponseEntity.ok(response);
        } catch (IOException e) {
            log.error("Error uploading videos", e);
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to upload videos: " + e.getMessage()
            );
        }
    }

    @PostMapping("/document")
    @Operation(summary = "Upload single document (PDF, CSV, DOCX)")
    public ResponseEntity<Map<String, String>> uploadDocument(
            @RequestParam("file") MultipartFile file) {
        try {
            String url = fileUploadService.uploadFile(file, "documents");

            Map<String, String> response = new HashMap<>();
            response.put("url", url);
            response.put("message", "Document uploaded successfully");

            return ResponseEntity.ok(response);
        } catch (IOException e) {
            log.error("Error uploading document", e);
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to upload document: " + e.getMessage()
            );
        }
    }

    @PostMapping("/documents")
    @Operation(summary = "Upload multiple documents")
    public ResponseEntity<Map<String, Object>> uploadDocuments(
            @RequestParam("files") List<MultipartFile> files) {
        try {
            List<String> urls = fileUploadService.uploadFiles(files, "documents");

            Map<String, Object> response = new HashMap<>();
            response.put("urls", urls);
            response.put("count", urls.size());
            response.put("message", "Documents uploaded successfully");

            return ResponseEntity.ok(response);
        } catch (IOException e) {
            log.error("Error uploading documents", e);
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to upload documents: " + e.getMessage()
            );
        }
    }

    @DeleteMapping("/file")
    @Operation(summary = "Delete a file by URL")
    public ResponseEntity<Map<String, String>> deleteFile(
            @RequestParam("url") String fileUrl) {
        boolean deleted = fileUploadService.deleteFile(fileUrl);

        Map<String, String> response = new HashMap<>();
        if (deleted) {
            response.put("message", "File deleted successfully");
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "File not found or already deleted");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
}