package org.example.Broomate.service;

import com.google.cloud.Timestamp;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.Broomate.config.JwtUtil;
import org.example.Broomate.dto.request.guest.LoginRequest;
import org.example.Broomate.dto.request.guest.SignupRequest;
import org.example.Broomate.dto.response.guest.AuthResponse;
import org.example.Broomate.model.Account;
import org.example.Broomate.model.Landlord;
import org.example.Broomate.model.Tenant;
import org.example.Broomate.repository.GuestAuthRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final GuestAuthRepository authRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;
    private final FileUploadService fileUploadService;

    // ========================================
    // 1. LOGIN (No changes needed)
    // ========================================
    public AuthResponse login(LoginRequest request) {
        log.info("Login attempt for email: {}", request.getEmail());

        // 1. Find user by email
        Account account = authRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found with email: " + request.getEmail()
                ));

        // 2. Check if account is active
        if (!account.isActive()) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Account is deactivated. Please activate your account first."
            );
        }

        // 3. Authenticate with Spring Security
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid email or password"
            );
        }

        // 4. Load user details and generate JWT
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        String jwt = jwtUtil.generateToken(
                account.getEmail(),
                account.getId(),
                account.getRole().toString()
        );

        log.info("Login successful for email: {}", request.getEmail());

        // 5. Return response with token
        return AuthResponse.builder()
                .token(jwt)
                .userId(account.getId())
                .email(account.getEmail())
                .name(account.getName())
                .role(account.getRole())
                .message("Login successful")
                .build();
    }

    // ========================================
    // 2. SIGNUP WITH AVATAR (ATOMIC WITH ROLLBACK)
    // ========================================
    public AuthResponse signup(SignupRequest request, MultipartFile avatar) throws IOException {
        log.info("Signup attempt for email: {}", request.getEmail());

        String uploadedAvatarUrl = null; // Track for rollback

        try {
            // 1. Check if email already exists
            if (authRepository.findByEmail(request.getEmail()).isPresent()) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Email already registered: " + request.getEmail()
                );
            }

            // 2. Validate password confirmation
            if (!request.getPassword().equals(request.getConfirmPassword())) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Passwords do not match"
                );
            }

            // 3. Upload avatar to Firebase Storage (if provided)
            if (avatar != null && !avatar.isEmpty()) {
                uploadedAvatarUrl = fileUploadService.uploadFile(avatar, "avatars");
                log.info("Avatar uploaded successfully: {}", uploadedAvatarUrl);
            }

            // 4. Hash password
            String hashedPassword = passwordEncoder.encode(request.getPassword());

            // 5. Create account based on role
            Account account;
            String userId = UUID.randomUUID().toString();

            if (request.getRole() == Account.AccountRoleEnum.TENANT) {
                // Create Tenant with avatar
                Tenant tenant = Tenant.builder()
                        .id(userId)
                        .email(request.getEmail())
                        .password(hashedPassword)
                        .name(request.getName())
                        .phone(request.getPhone())
                        .avatarUrl(uploadedAvatarUrl)  // ✅ Set avatar URL
                        .role(Account.AccountRoleEnum.TENANT)
                        .active(true)
                        .createdAt(Timestamp.now())
                        .updatedAt(Timestamp.now())
                        // Tenant-specific fields can be updated later
                        .budgetPerMonth(null)
                        .stayLengthMonths(null)
                        .moveInDate(null)
                        .preferredDistricts(null)
                        .build();

                account = authRepository.saveTenant(tenant);
                log.info("Tenant account created: {}", userId);

            } else if (request.getRole() == Account.AccountRoleEnum.LANDLORD) {
                // Create Landlord with avatar
                Landlord landlord = Landlord.builder()
                        .id(userId)
                        .email(request.getEmail())
                        .password(hashedPassword)
                        .name(request.getName())
                        .phone(request.getPhone())
                        .avatarUrl(uploadedAvatarUrl)  // ✅ Set avatar URL
                        .role(Account.AccountRoleEnum.LANDLORD)
                        .active(true)
                        .createdAt(Timestamp.now())
                        .updatedAt(Timestamp.now())
                        .build();

                account = authRepository.saveLandlord(landlord);
                log.info("Landlord account created: {}", userId);

            } else {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Invalid role. Must be TENANT or LANDLORD"
                );
            }

            // 6. Generate JWT token for auto-login
            UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
            String jwt = jwtUtil.generateToken(
                    account.getEmail(),
                    account.getId(),
                    account.getRole().toString()
            );

            log.info("Signup successful for email: {}", request.getEmail());

            // 7. Return response
            return AuthResponse.builder()
                    .token(jwt)
                    .userId(account.getId())
                    .email(account.getEmail())
                    .name(account.getName())
                    .role(account.getRole())
                    .avatarUrl(uploadedAvatarUrl)  // ✅ Include avatar URL in response
                    .message("Account created successfully")
                    .build();

        } catch (Exception e) {
            // ROLLBACK: Delete uploaded avatar if account creation fails
            log.error("Signup failed, rolling back uploaded avatar", e);
            if (uploadedAvatarUrl != null) {
                log.info("Deleting uploaded avatar: {}", uploadedAvatarUrl);
                fileUploadService.deleteFile(uploadedAvatarUrl);
            }

            // Re-throw the exception
            if (e instanceof ResponseStatusException) {
                throw e;
            }
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to create account: " + e.getMessage()
            );
        }
    }
}