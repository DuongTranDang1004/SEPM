package org.example.Broomate.service;

import com.google.cloud.Timestamp;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.Broomate.dto.request.landlord.CreateRoomRequest;
import org.example.Broomate.dto.request.landlord.UpdateLandlordProfileRequest;
import org.example.Broomate.dto.request.landlord.UpdateRoomRequest;
import org.example.Broomate.dto.response.landlord.LandlordProfileResponse;
import org.example.Broomate.dto.response.allAuthUser.RoomDetailResponse;
import org.example.Broomate.model.Landlord;
import org.example.Broomate.model.Room;
import org.example.Broomate.repository.LandlordRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class LandlordService {

    private final LandlordRepository landlordRepository;
    private final FileUploadService fileUploadService;

    // ========================================
    // SCENARIO 1: CREATE ROOM (WITH ATOMICITY)
    // ========================================
    /**
     * Create new room with file uploads
     * If any step fails, rollback uploaded files
     */
    public RoomDetailResponse createRoom(
            String landlordId,
            CreateRoomRequest request,
            MultipartFile thumbnail,
            List<MultipartFile> images,
            List<MultipartFile> videos,
            List<MultipartFile> documents) throws IOException {

        log.info("Creating room for landlord: {}", landlordId);

        List<String> uploadedUrls = new ArrayList<>(); // Track for rollback

        try {
            // 1. Verify landlord exists
            Landlord landlord = landlordRepository.findById(landlordId)
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Landlord not found with ID: " + landlordId
                    ));

            // 2. Upload files to Firebase Storage
            log.info("Uploading files to Firebase Storage...");

            String thumbnailUrl = null;
            if (thumbnail != null && !thumbnail.isEmpty()) {
                thumbnailUrl = fileUploadService.uploadFile(thumbnail, "thumbnails");
                if (thumbnailUrl != null) {
                    uploadedUrls.add(thumbnailUrl);
                }
                log.info("Thumbnail uploaded: {}", thumbnailUrl);
            }

            List<String> imageUrls = fileUploadService.uploadFiles(images, "images");
            uploadedUrls.addAll(imageUrls);
            log.info("Uploaded {} images", imageUrls.size());

            List<String> videoUrls = fileUploadService.uploadFiles(videos, "videos");
            uploadedUrls.addAll(videoUrls);
            log.info("Uploaded {} videos", videoUrls.size());

            List<String> documentUrls = fileUploadService.uploadFiles(documents, "documents");
            uploadedUrls.addAll(documentUrls);
            log.info("Uploaded {} documents", documentUrls.size());

            // 3. Create new room with uploaded file URLs
            Room room = Room.builder()
                    .id(UUID.randomUUID().toString())
                    .landlordId(landlordId)
                    .title(request.getTitle())
                    .description(request.getDescription())
                    .thumbnailUrl(thumbnailUrl)
                    .imageUrls(imageUrls)
                    .videoUrls(videoUrls)
                    .documentUrls(documentUrls)
                    .rentPricePerMonth(request.getRentPricePerMonth())
                    .minimumStayMonths(request.getMinimumStayMonths())
                    .address(request.getAddress())
                    .latitude(request.getLatitude())
                    .longitude(request.getLongitude())
                    .numberOfToilets(request.getNumberOfToilets())
                    .numberOfBedRooms(request.getNumberOfBedRooms())
                    .hasWindow(request.getHasWindow())
                    .status(Room.RoomStatus.PUBLISHED)
                    .createdAt(Timestamp.now())
                    .updatedAt(Timestamp.now())
                    .build();

            // 4. Save to Firestore
            Room savedRoom = landlordRepository.saveRoom(room);

            log.info("Room created successfully with ID: {}", savedRoom.getId());

            // 5. Convert to response
            return RoomDetailResponse.fromRoom(savedRoom);

        } catch (Exception e) {
            // ROLLBACK: Delete all uploaded files if room creation fails
            log.error("Room creation failed, rolling back uploaded files", e);
            if (!uploadedUrls.isEmpty()) {
                log.info("Deleting {} uploaded files...", uploadedUrls.size());
                fileUploadService.deleteFiles(uploadedUrls);
            }
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to create room: " + e.getMessage()
            );
        }
    }

    // ========================================
    // SCENARIO 2: UPDATE ROOM (NORMAL FIELDS ONLY)
    // ========================================
    /**
     * Update room normal fields (no media files)
     * Separate from media updates for simplicity
     */
    public RoomDetailResponse updateRoom(String landlordId, String roomId, UpdateRoomRequest request) {
        log.info("Updating room {} for landlord {}", roomId, landlordId);

        // 1. Get existing room
        Room room = landlordRepository.findRoomById(roomId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Room not found with ID: " + roomId
                ));

        // 2. Verify ownership
        if (!room.getLandlordId().equals(landlordId)) {
            throw new AccessDeniedException("You don't have permission to update this room");
        }

        // 3. Update normal fields only (no media)
        room.setTitle(request.getTitle());
        room.setDescription(request.getDescription());
        room.setRentPricePerMonth(request.getRentPricePerMonth());
        room.setMinimumStayMonths(request.getMinimumStayMonths());
        room.setAddress(request.getAddress());
        room.setLatitude(request.getLatitude());
        room.setLongitude(request.getLongitude());
        room.setNumberOfToilets(request.getNumberOfToilets());
        room.setNumberOfBedRooms(request.getNumberOfBedRooms());
        room.setHasWindow(request.getHasWindow());
        room.setStatus(request.getStatus());
        room.setUpdatedAt(Timestamp.now());

        // 4. Save updated room
        Room updatedRoom = landlordRepository.updateRoom(roomId, room);

        log.info("Room updated successfully: {}", roomId);

        // 5. Convert to response
        return RoomDetailResponse.fromRoom(updatedRoom);
    }

    // ========================================
    // SCENARIO 2: ADD MEDIA FILES TO EXISTING ROOM
    // ========================================
    /**
     * Add new media files to existing room (keeps existing files)
     */
    public RoomDetailResponse addRoomMedia(
            String landlordId,
            String roomId,
            MultipartFile thumbnail,
            List<MultipartFile> images,
            List<MultipartFile> videos,
            List<MultipartFile> documents,
            boolean replaceThumbnail) throws IOException {

        log.info("Adding media files to room {} for landlord {}", roomId, landlordId);

        // 1. Get existing room
        Room room = landlordRepository.findRoomById(roomId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Room not found with ID: " + roomId
                ));

        // 2. Verify ownership
        if (!room.getLandlordId().equals(landlordId)) {
            throw new AccessDeniedException("You don't have permission to update this room");
        }

        // 3. Handle thumbnail
        if (thumbnail != null && !thumbnail.isEmpty()) {
            if (replaceThumbnail && room.getThumbnailUrl() != null) {
                // Delete old thumbnail
                fileUploadService.deleteFile(room.getThumbnailUrl());
            }
            // Upload new thumbnail
            String newThumbnailUrl = fileUploadService.uploadFile(thumbnail, "thumbnails");
            room.setThumbnailUrl(newThumbnailUrl);
        }

        // 4. Add new images (keep existing)
        if (images != null && !images.isEmpty()) {
            List<String> newImageUrls = fileUploadService.uploadFiles(images, "images");
            List<String> allImageUrls = new ArrayList<>(room.getImageUrls() != null ? room.getImageUrls() : new ArrayList<>());
            allImageUrls.addAll(newImageUrls);
            room.setImageUrls(allImageUrls);
            log.info("Added {} new images to room", newImageUrls.size());
        }

        // 5. Add new videos (keep existing)
        if (videos != null && !videos.isEmpty()) {
            List<String> newVideoUrls = fileUploadService.uploadFiles(videos, "videos");
            List<String> allVideoUrls = new ArrayList<>(room.getVideoUrls() != null ? room.getVideoUrls() : new ArrayList<>());
            allVideoUrls.addAll(newVideoUrls);
            room.setVideoUrls(allVideoUrls);
            log.info("Added {} new videos to room", newVideoUrls.size());
        }

        // 6. Add new documents (keep existing)
        if (documents != null && !documents.isEmpty()) {
            List<String> newDocumentUrls = fileUploadService.uploadFiles(documents, "documents");
            List<String> allDocumentUrls = new ArrayList<>(room.getDocumentUrls() != null ? room.getDocumentUrls() : new ArrayList<>());
            allDocumentUrls.addAll(newDocumentUrls);
            room.setDocumentUrls(allDocumentUrls);
            log.info("Added {} new documents to room", newDocumentUrls.size());
        }

        room.setUpdatedAt(Timestamp.now());

        // 7. Save updated room
        Room updatedRoom = landlordRepository.updateRoom(roomId, room);

        log.info("Media files added successfully to room: {}", roomId);

        return RoomDetailResponse.fromRoom(updatedRoom);
    }

    // ========================================
    // SCENARIO 3: DELETE MEDIA FILES
    // ========================================

    /**
     * Delete thumbnail from room
     */
    public RoomDetailResponse deleteThumbnail(String landlordId, String roomId) {
        log.info("Deleting thumbnail from room {} for landlord {}", roomId, landlordId);

        Room room = landlordRepository.findRoomById(roomId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Room not found"));

        if (!room.getLandlordId().equals(landlordId)) {
            throw new AccessDeniedException("You don't have permission to modify this room");
        }

        if (room.getThumbnailUrl() != null) {
            fileUploadService.deleteFile(room.getThumbnailUrl());
            room.setThumbnailUrl(null);
            room.setUpdatedAt(Timestamp.now());
            room = landlordRepository.updateRoom(roomId, room);
            log.info("Thumbnail deleted successfully from room: {}", roomId);
        }

        return RoomDetailResponse.fromRoom(room);
    }

    /**
     * Delete specific images from room
     */
    public RoomDetailResponse deleteImages(String landlordId, String roomId, List<String> imageUrls) {
        log.info("Deleting {} images from room {} for landlord {}", imageUrls.size(), roomId, landlordId);

        Room room = landlordRepository.findRoomById(roomId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Room not found"));

        if (!room.getLandlordId().equals(landlordId)) {
            throw new AccessDeniedException("You don't have permission to modify this room");
        }

        if (room.getImageUrls() != null && imageUrls != null && !imageUrls.isEmpty()) {
            // Delete from Firebase Storage
            for (String url : imageUrls) {
                if (room.getImageUrls().contains(url)) {
                    fileUploadService.deleteFile(url);
                }
            }

            // Remove from room
            room.getImageUrls().removeAll(imageUrls);
            room.setUpdatedAt(Timestamp.now());
            room = landlordRepository.updateRoom(roomId, room);
            log.info("{} images deleted successfully from room: {}", imageUrls.size(), roomId);
        }

        return RoomDetailResponse.fromRoom(room);
    }

    /**
     * Delete specific videos from room
     */
    public RoomDetailResponse deleteVideos(String landlordId, String roomId, List<String> videoUrls) {
        log.info("Deleting {} videos from room {} for landlord {}", videoUrls.size(), roomId, landlordId);

        Room room = landlordRepository.findRoomById(roomId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Room not found"));

        if (!room.getLandlordId().equals(landlordId)) {
            throw new AccessDeniedException("You don't have permission to modify this room");
        }

        if (room.getVideoUrls() != null && videoUrls != null && !videoUrls.isEmpty()) {
            for (String url : videoUrls) {
                if (room.getVideoUrls().contains(url)) {
                    fileUploadService.deleteFile(url);
                }
            }

            room.getVideoUrls().removeAll(videoUrls);
            room.setUpdatedAt(Timestamp.now());
            room = landlordRepository.updateRoom(roomId, room);
            log.info("{} videos deleted successfully from room: {}", videoUrls.size(), roomId);
        }

        return RoomDetailResponse.fromRoom(room);
    }

    /**
     * Delete specific documents from room
     */
    public RoomDetailResponse deleteDocuments(String landlordId, String roomId, List<String> documentUrls) {
        log.info("Deleting {} documents from room {} for landlord {}", documentUrls.size(), roomId, landlordId);

        Room room = landlordRepository.findRoomById(roomId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Room not found"));

        if (!room.getLandlordId().equals(landlordId)) {
            throw new AccessDeniedException("You don't have permission to modify this room");
        }

        if (room.getDocumentUrls() != null && documentUrls != null && !documentUrls.isEmpty()) {
            for (String url : documentUrls) {
                if (room.getDocumentUrls().contains(url)) {
                    fileUploadService.deleteFile(url);
                }
            }

            room.getDocumentUrls().removeAll(documentUrls);
            room.setUpdatedAt(Timestamp.now());
            room = landlordRepository.updateRoom(roomId, room);
            log.info("{} documents deleted successfully from room: {}", documentUrls.size(), roomId);
        }

        return RoomDetailResponse.fromRoom(room);
    }

    // ========================================
    // UPDATE LANDLORD PROFILE
    // ========================================
    public LandlordProfileResponse updateProfile(String landlordId, UpdateLandlordProfileRequest request) {
        log.info("Updating landlord profile for ID: {}", landlordId);

        Landlord landlord = landlordRepository.findById(landlordId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Landlord not found with ID: " + landlordId
                ));

        landlord.setName(request.getName());
        landlord.setPhone(request.getPhone());
        landlord.setAvatarUrl(request.getAvatarUrl());
        landlord.setDescription(request.getDescription());
        landlord.setUpdatedAt(Timestamp.now());

        Landlord updatedLandlord = landlordRepository.update(landlordId, landlord);

        log.info("Landlord profile updated successfully: {}", landlordId);

        return LandlordProfileResponse.fromLandlord(updatedLandlord);
    }

    // ========================================
    // GET LANDLORD PROFILE
    // ========================================
    public LandlordProfileResponse getProfile(String landlordId) {
        log.info("Getting landlord profile for ID: {}", landlordId);

        Landlord landlord = landlordRepository.findById(landlordId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Landlord not found with ID: " + landlordId
                ));

        return LandlordProfileResponse.fromLandlord(landlord);
    }
}