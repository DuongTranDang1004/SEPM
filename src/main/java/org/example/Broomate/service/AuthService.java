package org.example.Broomate.service;

import com.google.cloud.Timestamp;
import lombok.extern.slf4j.Slf4j;
import org.example.Broomate.dto.request.guest.LoginRequest;
import org.example.Broomate.dto.request.guest.SignupRequest;
import org.example.Broomate.dto.response.guest.AuthResponse;
import org.example.Broomate.model.Account;
import org.example.Broomate.model.Landlord;
import org.example.Broomate.model.Tenant;
import org.example.Broomate.repository.GuestAuthRepository;
import org.example.Broomate.config.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Slf4j
@Service
public class AuthService {

    @Autowired
    private GuestAuthRepository authRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    // ========================================
    // 1. LOGIN
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
// In login method
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
    // 2. SIGNUP
    // ========================================
    public AuthResponse signup(SignupRequest request) {
        log.info("Signup attempt for email: {}", request.getEmail());

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

        // 3. Hash password
        String hashedPassword = passwordEncoder.encode(request.getPassword());

        // 4. Create account based on role
        Account account;
        String userId = UUID.randomUUID().toString();

        if (request.getRole() == Account.AccountRoleEnum.TENANT) {
            // Create Tenant
            Tenant tenant = Tenant.builder()
                    .id(userId)
                    .email(request.getEmail())
                    .password(hashedPassword)
                    .name(request.getName())
                    .phone(request.getPhone())
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
            // Create Landlord
            Landlord landlord = Landlord.builder()
                    .id(userId)
                    .email(request.getEmail())
                    .password(hashedPassword)
                    .name(request.getName())
                    .phone(request.getPhone())
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

        // 5. Generate JWT token for auto-login
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
// In signup method
        String jwt = jwtUtil.generateToken(
                account.getEmail(),
                account.getId(),
                account.getRole().toString()
        );
        log.info("Signup successful for email: {}", request.getEmail());

        // 6. Return response
        return AuthResponse.builder()
                .token(jwt)
                .userId(account.getId())
                .email(account.getEmail())
                .name(account.getName())
                .role(account.getRole())
                .message("Account created successfully")
                .build();
    }
}