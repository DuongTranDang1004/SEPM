package org.example.Broomate.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.Broomate.dto.request.guest.LoginRequest;
import org.example.Broomate.dto.request.guest.SignupRequest;
import org.example.Broomate.dto.response.ErrorResponse;
import org.example.Broomate.dto.response.guest.AuthResponse;
import org.example.Broomate.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Public APIs for guest users (login & signup)")
@RequiredArgsConstructor
public class GuestAuthController {

    private final AuthService authService;

    // ========================================
    // LOGIN (No changes needed)
    // ========================================
    @Operation(summary = "Login",
            description = "Authenticate user with email and password, returns JWT token")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Login successful",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = AuthResponse.class))),
            @ApiResponse(responseCode = "401", description = "Invalid credentials",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "User not found",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    // ========================================
    // SCENARIO 1: SIGNUP WITH AVATAR (ATOMIC)
    // ========================================
    @Operation(summary = "Sign up with avatar",
            description = "Register a new user account (Tenant or Landlord) with optional avatar upload. " +
                    "If any step fails (validation, avatar upload, or account creation), everything is rolled back.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "User registered successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = AuthResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid request, validation error, or file too large",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "409", description = "Email already exists",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping(value = "/signup", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AuthResponse> signup(
            @Valid @ModelAttribute SignupRequest request,

            @Parameter(description = "Optional avatar image file")
            @RequestParam(value = "avatar", required = false) MultipartFile avatar) throws IOException {

        AuthResponse response = authService.signup(request, avatar);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}