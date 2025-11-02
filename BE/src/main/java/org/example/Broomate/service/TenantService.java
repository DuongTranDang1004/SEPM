package org.example.Broomate.service;

import com.google.cloud.Timestamp;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.Broomate.dto.request.tenant.SwipeRequest;
import org.example.Broomate.dto.request.tenant.UpdateTenantProfileRequest;
import org.example.Broomate.dto.response.tenant.MatchResponse;
import org.example.Broomate.dto.response.tenant.SwipeResponse;
import org.example.Broomate.dto.response.tenant.TenantListResponse;
import org.example.Broomate.dto.response.tenant.TenantProfileResponse;
import org.example.Broomate.model.Conversation;
import org.example.Broomate.model.Match;
import org.example.Broomate.model.Swipe;
import org.example.Broomate.model.Tenant;
import org.example.Broomate.repository.TenantRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class TenantService {

    private final TenantRepository tenantRepository;
    private final FileUploadService fileUploadService;

    private static final int REJECTION_COOLDOWN_MINUTES = 10;

    // ========================================
    // BUSINESS LOGIC METHODS
    // ========================================

    /**
     * Get all available tenants for swiping
     * Excludes: current tenant, already matched, recently rejected, already swiped
     */
    public TenantListResponse getAllTenantsForSwiping(String currentTenantId) {
        log.info("Getting all tenants for swiping. Current tenant ID: {}", currentTenantId);

        // 1. Get all active tenants
        List<Tenant> allTenants = tenantRepository.findAllActiveTenants();

        // 2. Exclude current tenant
        List<Tenant> otherTenants = allTenants.stream()
                .filter(tenant -> !tenant.getId().equals(currentTenantId))
                .collect(Collectors.toList());

        // 3. Get swipe history for current tenant
        List<Swipe> swipeHistory = tenantRepository.findSwipesBySwiperId(currentTenantId);

        // 4. Calculate 10 minutes ago for rejection cooldown
        Instant tenMinutesAgo = Instant.now().minus(REJECTION_COOLDOWN_MINUTES, ChronoUnit.MINUTES);

        // 5. Get IDs of recently rejected tenants (within last 10 minutes)
        Set<String> recentlyRejectedIds = swipeHistory.stream()
                .filter(swipe -> "REJECT".equals(swipe.getAction()))
                .filter(swipe -> swipe.getCreatedAt().toDate().toInstant().isAfter(tenMinutesAgo))
                .map(Swipe::getTargetId)
                .collect(Collectors.toSet());

        // 6. Get IDs of all swiped tenants (don't show again)
        Set<String> allSwipedIds = swipeHistory.stream()
                .map(Swipe::getTargetId)
                .collect(Collectors.toSet());

        // 7. Get matched tenant IDs
        List<Match> matches = tenantRepository.findActiveMatchesByTenantId(currentTenantId);
        Set<String> matchedTenantIds = matches.stream()
                .map(match -> match.getTenant1Id().equals(currentTenantId) ?
                        match.getTenant2Id() : match.getTenant1Id())
                .collect(Collectors.toSet());

        // 8. Filter available tenants
        List<Tenant> availableTenants = otherTenants.stream()
                .filter(tenant -> !recentlyRejectedIds.contains(tenant.getId()))
                .filter(tenant -> !matchedTenantIds.contains(tenant.getId()))
                .filter(tenant -> !allSwipedIds.contains(tenant.getId()))
                .collect(Collectors.toList());

        // 9. Convert to response DTOs
        List<TenantProfileResponse> tenantResponses = availableTenants.stream()
                .map(TenantProfileResponse::fromTenant)
                .collect(Collectors.toList());

        log.info("Found {} available tenants for swiping", tenantResponses.size());

        return TenantListResponse.builder()
                .tenants(tenantResponses)
                .totalCount(tenantResponses.size())
                .message("Tenants retrieved successfully")
                .build();
    }

    /**
     * Get tenant profile by ID
     */
    public TenantProfileResponse getTenantProfile(String tenantId) {
        log.info("Getting tenant profile for ID: {}", tenantId);

        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Tenant not found with ID: " + tenantId
                ));

        return TenantProfileResponse.fromTenant(tenant);
    }

    // ========================================
    // SCENARIO 2: UPDATE PROFILE (NORMAL FIELDS ONLY)
    // ========================================
    /**
     * Update tenant profile (no avatar)
     */
    public TenantProfileResponse updateTenantProfile(String tenantId, UpdateTenantProfileRequest request) {
        log.info("Updating tenant profile for ID: {}", tenantId);

        // 1. Get existing tenant
        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Tenant not found with ID: " + tenantId
                ));

        // 2. Update normal fields (no avatar)
        tenant.setName(request.getName());
        tenant.setDescription(request.getDescription());
        tenant.setBudgetPerMonth(request.getBudgetPerMonth());
        tenant.setStayLengthMonths(request.getStayLength());
        tenant.setMoveInDate(request.getMoveInDate());
        tenant.setPreferredDistricts(request.getPreferredLocations());
        tenant.setPhone(request.getPhone());
        tenant.setAge(request.getAge());
        tenant.setGender(request.getGender());
        tenant.setSmoking(request.isSmoking());
        tenant.setCooking(request.isCooking());
        tenant.setNeedWindow(request.isNeedWindow());
        tenant.setMightShareBedRoom(request.isMightShareBedRoom());
        tenant.setMightShareToilet(request.isMightShareToilet());
        tenant.setUpdatedAt(Timestamp.now());

        // 3. Save updated tenant
        Tenant updatedTenant = tenantRepository.update(tenantId, tenant);

        log.info("Tenant profile updated successfully for ID: {}", tenantId);

        return TenantProfileResponse.fromTenant(updatedTenant);
    }

    // ========================================
    // SCENARIO 2: UPDATE/ADD AVATAR
    // ========================================
    /**
     * Update or add tenant avatar
     */
    public TenantProfileResponse updateAvatar(String tenantId, MultipartFile avatar, boolean replace) throws IOException {
        log.info("Updating avatar for tenant: {}", tenantId);

        // 1. Get existing tenant
        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Tenant not found with ID: " + tenantId
                ));

        // 2. Delete old avatar if replacing
        if (replace && tenant.getAvatarUrl() != null) {
            fileUploadService.deleteFile(tenant.getAvatarUrl());
            log.info("Old avatar deleted");
        }

        // 3. Upload new avatar
        String newAvatarUrl = fileUploadService.uploadFile(avatar, "avatars");
        tenant.setAvatarUrl(newAvatarUrl);
        tenant.setUpdatedAt(Timestamp.now());

        // 4. Save updated tenant
        Tenant updatedTenant = tenantRepository.update(tenantId, tenant);

        log.info("Avatar updated successfully for tenant: {}", tenantId);

        return TenantProfileResponse.fromTenant(updatedTenant);
    }

    // ========================================
    // SCENARIO 3: DELETE AVATAR
    // ========================================
    /**
     * Delete tenant avatar
     */
    public TenantProfileResponse deleteAvatar(String tenantId) {
        log.info("Deleting avatar for tenant: {}", tenantId);

        // 1. Get existing tenant
        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Tenant not found with ID: " + tenantId
                ));

        // 2. Delete avatar from Firebase Storage
        if (tenant.getAvatarUrl() != null) {
            fileUploadService.deleteFile(tenant.getAvatarUrl());
            tenant.setAvatarUrl(null);
            tenant.setUpdatedAt(Timestamp.now());

            // 3. Save updated tenant
            tenant = tenantRepository.update(tenantId, tenant);
            log.info("Avatar deleted successfully for tenant: {}", tenantId);
        } else {
            log.info("No avatar to delete for tenant: {}", tenantId);
        }

        return TenantProfileResponse.fromTenant(tenant);
    }

    // ========================================
    // SWIPE LOGIC
    // ========================================
    /**
     * Swipe on a tenant (accept or reject)
     * Handles match creation and conversation initialization
     */
    public SwipeResponse swipeTenant(String swiperTenantId, SwipeRequest request) {
        log.info("Tenant {} swiping {} on tenant {}",
                swiperTenantId, request.getSwipeAction(), request.getTargetTenantId());

        // 1. Validate - cannot swipe on yourself
        if (swiperTenantId.equals(request.getTargetTenantId())) {
            throw new IllegalArgumentException("Cannot swipe on yourself");
        }

        // 2. Check if target tenant exists
        Tenant targetTenant = tenantRepository.findById(request.getTargetTenantId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Target tenant not found with ID: " + request.getTargetTenantId()
                ));

        // 3. Check if already swiped on this tenant
        Optional<Swipe> existingSwipe = tenantRepository.findSwipe(
                swiperTenantId, request.getTargetTenantId());

        if (existingSwipe.isPresent()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "You have already swiped on this tenant"
            );
        }

        // 4. Create and save swipe
        Swipe swipe = Swipe.builder()
                .id(UUID.randomUUID().toString())
                .swiperId(swiperTenantId)
                .targetId(request.getTargetTenantId())
                .action(request.getSwipeAction())
                .createdAt(Timestamp.now())
                .updatedAt(Timestamp.now())
                .build();

        tenantRepository.saveSwipe(swipe);

        log.info("Swipe recorded successfully");

        // 5. Handle REJECT action
        if (Swipe.SwipeActionEnum.REJECT.equals(request.getSwipeAction())) {
            return SwipeResponse.fromSwipe(
                    swipe,
                    false,
                    null,
                    "Swiped left. This profile will be hidden for 10 minutes."
            );
        }

        // 6. Handle ACCEPT action - check for mutual match
        Optional<Swipe> mutualSwipe = tenantRepository.findSwipe(
                request.getTargetTenantId(), swiperTenantId);

        // 7. No mutual match yet
        if (mutualSwipe.isEmpty() || !Swipe.SwipeActionEnum.ACCEPT.equals(mutualSwipe.get().getAction())) {
            return SwipeResponse.fromSwipe(
                    swipe,
                    false,
                    null,
                    "Swiped right! Waiting for the other tenant to swipe back."
            );
        }

        // 8. MUTUAL MATCH FOUND! Create match and conversation
        log.info("Match found between {} and {}", swiperTenantId, request.getTargetTenantId());

        return createMatchAndConversation(swiperTenantId, targetTenant, swipe);
    }

    // ========================================
    // PRIVATE HELPER METHODS
    // ========================================
    private SwipeResponse createMatchAndConversation(String currentTenantId, Tenant targetTenant, Swipe swipe) {
        // Create conversation
        String conversationId = UUID.randomUUID().toString();
        Conversation conversation = Conversation.builder()
                .id(conversationId)
                .participantIds(List.of(currentTenantId, targetTenant.getId()))
                .lastMessage(null)
                .lastMessageAt(null)
                .createdAt(Timestamp.now())
                .updatedAt(Timestamp.now())
                .build();

        tenantRepository.saveConversation(conversation);

        // Create match
        String matchId = UUID.randomUUID().toString();
        Match match = Match.builder()
                .id(matchId)
                .tenant1Id(currentTenantId)
                .tenant2Id(targetTenant.getId())
                .conversationId(conversationId)
                .status(Match.MatchStatusEnum.ACTIVE)
                .createdAt(Timestamp.now())
                .updatedAt(Timestamp.now())
                .build();

        tenantRepository.saveMatch(match);

        // Build match DTO for response
        MatchResponse matchResponse = MatchResponse.builder()
                .matchId(matchId)
                .conversationId(conversationId)
                .otherTenantId(targetTenant.getId())
                .otherTenantName(targetTenant.getName())
                .otherTenantAvatar(targetTenant.getAvatarUrl())
                .matchedAt(Timestamp.now().toString())
                .build();

        log.info("Match and conversation created successfully");

        return SwipeResponse.fromSwipe(
                swipe,
                true,
                matchResponse,
                "It's a match! You can now start chatting with " + targetTenant.getName() + "."
        );
    }
}