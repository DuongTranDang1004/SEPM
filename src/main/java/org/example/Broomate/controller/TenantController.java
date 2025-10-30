package org.example.Broomate.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.example.Broomate.config.CustomUserDetails;
import org.example.Broomate.dto.request.tenant.UpdateTenantProfileRequest;
import org.example.Broomate.dto.request.tenant.SwipeRequest;
import org.example.Broomate.dto.response.tenant.TenantProfileResponse;
import org.example.Broomate.dto.response.tenant.TenantListResponse;
import org.example.Broomate.dto.response.tenant.SwipeResponse;
import org.example.Broomate.dto.response.ErrorResponse;
import org.example.Broomate.service.TenantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tenant")
@Tag(name = "Tenant", description = "APIs available only for tenants")
@SecurityRequirement(name = "bearerAuth")
public class TenantController {

    @Autowired
    private TenantService tenantService;

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

    /**
     * UPDATE TENANT PROFILE
     */
    @Operation(summary = "Update tenant profile",
            description = "Update the authenticated tenant's profile information.")
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
        TenantProfileResponse response = tenantService.updateTenantProfile(tenantId,request);
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
        SwipeResponse response = tenantService.swipeTenant( swiperTenantId,request);
        return ResponseEntity.ok(response);
    }

    /**
     * GET CURRENT TENANT PROFILE
     */
    @Operation(summary = "Get current tenant profile",
            description = "Retrieve the authenticated tenant's own profile information.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved profile",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = TenantProfileResponse.class))),
            @ApiResponse(responseCode = "404", description = "Tenant not found",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/profile/{tenantId}")
    public ResponseEntity<TenantProfileResponse> getCurrentTenantProfile(
            @PathVariable String tenantId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        TenantProfileResponse response = tenantService.getTenantProfile(tenantId);
        return ResponseEntity.ok(response);
    }
}