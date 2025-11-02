package org.example.Broomate.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.Broomate.config.CustomUserDetails;
import org.example.Broomate.dto.request.tenant.UpdateTenantProfileRequest;
import org.example.Broomate.dto.request.tenant.SwipeRequest;
import org.example.Broomate.dto.response.tenant.TenantProfileResponse;
import org.example.Broomate.dto.response.tenant.TenantListResponse;
import org.example.Broomate.dto.response.tenant.SwipeResponse;
import org.example.Broomate.dto.response.ErrorResponse;
import org.example.Broomate.service.TenantService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/tenant")
@Tag(name = "Tenant", description = "APIs available only for tenants")
@SecurityRequirement(name = "bearerAuth")
@RequiredArgsConstructor
public class TenantController {

    private final TenantService tenantService;

    /**
     * GET ALL TENANTS FOR SWIPING
     */
    @Operation(summary = "Get all tenants for swiping",
            description = "Retrieve all tenant profiles for swiping/matching. " +
                    "Excludes already rejected (within 10 min), matched, and already swiped tenants.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved tenant profiles",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = TenantListResponse.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "Forbidden - User is not a tenant",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/profiles")
    public ResponseEntity<TenantListResponse> getAllTenants(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        String currentTenantId = userDetails.getUserId();
        TenantListResponse response = tenantService.getAllTenantsForSwiping(currentTenantId);
        return ResponseEntity.ok(response);
    }

    // ========================================
    // SCENARIO 2: UPDATE TENANT PROFILE (NORMAL FIELDS ONLY)
    // ========================================
    @Operation(summary = "Update tenant profile information",
            description = "Update tenant profile fields (no avatar)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Profile successfully updated",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = TenantProfileResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid request body or validation error",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Tenant not found",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PutMapping("/profile")
    public ResponseEntity<TenantProfileResponse> updateTenantProfile(
            @Valid @RequestBody UpdateTenantProfileRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        String tenantId = userDetails.getUserId();
        TenantProfileResponse response = tenantService.updateTenantProfile(tenantId, request);
        return ResponseEntity.ok(response);
    }

    // ========================================
    // SCENARIO 2: UPDATE/ADD AVATAR
    // ========================================
    @Operation(summary = "Update tenant avatar",
            description = "Upload or replace tenant profile avatar")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Avatar updated successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = TenantProfileResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid file or file too large",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Tenant not found",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping(value = "/profile/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<TenantProfileResponse> updateAvatar(
            @Parameter(description = "Avatar image file")
            @RequestParam("avatar") MultipartFile avatar,

            @Parameter(description = "Replace existing avatar? (default: true)")
            @RequestParam(value = "replace", defaultValue = "true") boolean replace,

            @AuthenticationPrincipal CustomUserDetails userDetails) throws IOException {

        String tenantId = userDetails.getUserId();
        TenantProfileResponse response = tenantService.updateAvatar(tenantId, avatar, replace);
        return ResponseEntity.ok(response);
    }

    // ========================================
    // SCENARIO 3: DELETE AVATAR
    // ========================================
    @Operation(summary = "Delete tenant avatar",
            description = "Remove tenant profile avatar")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Avatar deleted successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = TenantProfileResponse.class))),
            @ApiResponse(responseCode = "404", description = "Tenant not found",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class)))
    })
    @DeleteMapping("/profile/avatar")
    public ResponseEntity<TenantProfileResponse> deleteAvatar(
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        String tenantId = userDetails.getUserId();
        TenantProfileResponse response = tenantService.deleteAvatar(tenantId);
        return ResponseEntity.ok(response);
    }

    /**
     * SWIPE TENANT
     */
    @Operation(summary = "Swipe tenant profile",
            description = "Swipe left (reject) or right (accept) on another tenant. " +
                    "If both accept, a match is created with automatic conversation.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Swipe recorded successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = SwipeResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid request - Cannot swipe on yourself",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Target tenant not found",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "409", description = "Already swiped on this tenant",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping("/swipe")
    public ResponseEntity<SwipeResponse> swipeTenant(
            @Valid @RequestBody SwipeRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        String swiperTenantId = userDetails.getUserId();
        SwipeResponse response = tenantService.swipeTenant(swiperTenantId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * GET CURRENT TENANT PROFILE
     */
    @Operation(summary = "Get tenant profile",
            description = "Retrieve tenant profile information by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved profile",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = TenantProfileResponse.class))),
            @ApiResponse(responseCode = "404", description = "Tenant not found",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/profile/{tenantId}")
    public ResponseEntity<TenantProfileResponse> getTenantProfile(
            @PathVariable String tenantId) {
        TenantProfileResponse response = tenantService.getTenantProfile(tenantId);
        return ResponseEntity.ok(response);
    }
}