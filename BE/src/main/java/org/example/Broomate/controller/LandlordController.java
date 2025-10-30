package org.example.Broomate.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.example.Broomate.config.CustomUserDetails;
import org.example.Broomate.dto.request.landlord.CreateRoomRequest;
import org.example.Broomate.dto.request.landlord.UpdateLandlordProfileRequest;
import org.example.Broomate.dto.request.landlord.UpdateRoomRequest;
import org.example.Broomate.dto.response.ErrorResponse;
import org.example.Broomate.dto.response.landlord.LandlordProfileResponse;
import org.example.Broomate.dto.response.allAuthUser.RoomDetailResponse;
import org.example.Broomate.service.LandlordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/landlord")
@Tag(name = "Landlord", description = "APIs available only for landlords")
@SecurityRequirement(name = "bearerAuth")
public class LandlordController {

    @Autowired
    private LandlordService landlordService;

    /**
     * CREATE ROOM DETAIL
     */
    @Operation(summary = "Create a new room",
            description = "Create a new room listing with all details")
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
    @PostMapping("/rooms")
    public ResponseEntity<RoomDetailResponse> createRoom(
            @Valid @RequestBody CreateRoomRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        String landlordId = userDetails.getUserId();
        RoomDetailResponse response = landlordService.createRoom(landlordId,request);
        return ResponseEntity.status(201).body(response);
    }

    /**
     * UPDATE ROOM DETAIL
     */
    @Operation(summary = "Update room details",
            description = "Update an existing room's information")
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
        RoomDetailResponse response = landlordService.updateRoom(landlordId , roomId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * UPDATE LANDLORD PROFILE
     */
    @Operation(summary = "Update landlord profile",
            description = "Update the authenticated landlord's profile information")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Profile updated successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = LandlordProfileResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid request body",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Landlord not found",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PutMapping("/profile/")
    public ResponseEntity<LandlordProfileResponse> updateProfile(
            @Valid @RequestBody UpdateLandlordProfileRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        String landlordId = userDetails.getUserId();
        LandlordProfileResponse response = landlordService.updateProfile(landlordId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * GET CURRENT LANDLORD PROFILE
     */
    @Operation(summary = "Get current landlord profile",
            description = "Retrieve the authenticated landlord's profile information")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Profile retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = LandlordProfileResponse.class))),
            @ApiResponse(responseCode = "404", description = "Landlord not found",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/profile/{landlordId}")
    public ResponseEntity<LandlordProfileResponse> getProfile(@PathVariable  String landlordId) {
        LandlordProfileResponse response = landlordService.getProfile(landlordId);
        return ResponseEntity.ok(response);
    }
}