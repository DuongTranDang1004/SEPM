package org.example.Broomate.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Encoding;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.Broomate.config.CustomUserDetails;
import org.example.Broomate.dto.request.landlord.CreateRoomRequestJSON;
import org.example.Broomate.dto.request.landlord.CreateRoomWithMediaRequest;
import org.example.Broomate.dto.request.landlord.UpdateLandlordProfileRequest;
import org.example.Broomate.dto.request.landlord.UpdateRoomRequest;
import org.example.Broomate.dto.response.ErrorResponse;
import org.example.Broomate.dto.response.landlord.LandlordProfileResponse;
import org.example.Broomate.dto.response.allAuthUser.RoomDetailResponse;
import org.example.Broomate.service.LandlordService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/landlord")
@Tag(name = "Landlord", description = "APIs available only for landlords")
@SecurityRequirement(name = "bearerAuth")
@RequiredArgsConstructor
public class LandlordController {

    private final LandlordService landlordService;

    // SCENARIO 1: CREATE ROOM WITH MEDIA
    // ========================================
    @Operation(summary = "Create a new room with file uploads",
            description = "Create a new room listing with all details and media files (ATOMIC)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Room created successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = RoomDetailResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid request body",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "Forbidden - User is not a landlord",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping(value = "/rooms", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<RoomDetailResponse> createRoom(
            @Parameter(
                    description = "Room creation json body",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = CreateRoomRequestJSON.class)
                    )
            )
            @Valid CreateRoomRequestJSON request,


            @RequestPart(value = "thumbnail", required = false) MultipartFile thumbnail,
            @RequestPart(value = "images", required = false) List<MultipartFile> images,
            @RequestPart(value = "videos", required = false) List<MultipartFile> videos,
            @RequestPart(value = "documents", required = false) List<MultipartFile> documents,

            @AuthenticationPrincipal CustomUserDetails userDetails
    ) throws IOException {

        String landlordId = userDetails.getUserId();

        RoomDetailResponse response = landlordService.createRoom(
                landlordId,
                request,
                thumbnail,
                images,
                videos,
                documents
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ========================================
    // SCENARIO 2: UPDATE ROOM INFO (NO MEDIA)
    // ========================================
    @Operation(summary = "Update room basic information",
            description = "Update room details without changing media files")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Room updated successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = RoomDetailResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid request body",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "Forbidden - Not the room owner",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Room not found",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PutMapping("/rooms/{roomId}")
    public ResponseEntity<RoomDetailResponse> updateRoom(
            @PathVariable String roomId,
            @Valid @RequestBody UpdateRoomRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        String landlordId = userDetails.getUserId();
        RoomDetailResponse response = landlordService.updateRoom(landlordId, roomId, request);
        return ResponseEntity.ok(response);
    }

    // ========================================
    // SCENARIO 2: ADD MEDIA FILES TO ROOM
    // ========================================
    @Operation(summary = "Add media files to existing room",
            description = "Upload new media files to an existing room (keeps existing files)")
    @PostMapping(value = "/rooms/{roomId}/media", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<RoomDetailResponse> addRoomMedia(
            @PathVariable String roomId,

            @Parameter(description = "New thumbnail (replaces old if replaceThumbnail=true)")
            @RequestParam(value = "thumbnail", required = false) MultipartFile thumbnail,

            @Parameter(description = "New images to add")
            @RequestParam(value = "images", required = false) List<MultipartFile> images,

            @Parameter(description = "New videos to add")
            @RequestParam(value = "videos", required = false) List<MultipartFile> videos,

            @Parameter(description = "New documents to add")
            @RequestParam(value = "documents", required = false) List<MultipartFile> documents,

            @Parameter(description = "Replace existing thumbnail? (default: false)")
            @RequestParam(value = "replaceThumbnail", defaultValue = "false") boolean replaceThumbnail,

            @AuthenticationPrincipal CustomUserDetails userDetails) throws IOException {

        String landlordId = userDetails.getUserId();
        RoomDetailResponse response = landlordService.addRoomMedia(
                landlordId, roomId, thumbnail, images, videos, documents, replaceThumbnail);
        return ResponseEntity.ok(response);
    }

    // ========================================
    // SCENARIO 3: DELETE MEDIA FILES
    // ========================================

    @Operation(summary = "Delete room thumbnail")
    @DeleteMapping("/rooms/{roomId}/thumbnail")
    public ResponseEntity<RoomDetailResponse> deleteThumbnail(
            @PathVariable String roomId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        String landlordId = userDetails.getUserId();
        RoomDetailResponse response = landlordService.deleteThumbnail(landlordId, roomId);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Delete specific room images")
    @DeleteMapping("/rooms/{roomId}/images")
    public ResponseEntity<RoomDetailResponse> deleteImages(
            @PathVariable String roomId,
            @RequestBody List<String> imageUrls,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        String landlordId = userDetails.getUserId();
        RoomDetailResponse response = landlordService.deleteImages(landlordId, roomId, imageUrls);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Delete specific room videos")
    @DeleteMapping("/rooms/{roomId}/videos")
    public ResponseEntity<RoomDetailResponse> deleteVideos(
            @PathVariable String roomId,
            @RequestBody List<String> videoUrls,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        String landlordId = userDetails.getUserId();
        RoomDetailResponse response = landlordService.deleteVideos(landlordId, roomId, videoUrls);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Delete specific room documents")
    @DeleteMapping("/rooms/{roomId}/documents")
    public ResponseEntity<RoomDetailResponse> deleteDocuments(
            @PathVariable String roomId,
            @RequestBody List<String> documentUrls,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        String landlordId = userDetails.getUserId();
        RoomDetailResponse response = landlordService.deleteDocuments(landlordId, roomId, documentUrls);
        return ResponseEntity.ok(response);
    }

    // ========================================
    // LANDLORD PROFILE
    // ========================================

    @Operation(summary = "Update landlord profile")
    @PutMapping("/profile")
    public ResponseEntity<LandlordProfileResponse> updateProfile(
            @Valid @RequestBody UpdateLandlordProfileRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        String landlordId = userDetails.getUserId();
        LandlordProfileResponse response = landlordService.updateProfile(landlordId, request);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Get landlord profile")
    @GetMapping("/profile/{landlordId}")
    public ResponseEntity<LandlordProfileResponse> getProfile(@PathVariable String landlordId) {
        LandlordProfileResponse response = landlordService.getProfile(landlordId);
        return ResponseEntity.ok(response);
    }
}