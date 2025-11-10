package org.example.Broomate.service;

import com.google.cloud.Timestamp;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.Broomate.dto.request.tenant.SwipeRequest;
import org.example.Broomate.dto.request.tenant.UpdateTenantProfileRequest;
import org.example.Broomate.dto.response.tenant.*;
import org.example.Broomate.model.*;
import org.example.Broomate.repository.TenantRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
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
    private final FileStorageService fileStorageService;

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
                .toList();

        // 3. Get swipe history for current tenant
        List<Swipe> swipeHistory = tenantRepository.findSwipesBySwiperId(currentTenantId);

        // 4. Calculate 10 minutes ago for rejection cooldown
        Instant tenMinutesAgo = Instant.now().minus(REJECTION_COOLDOWN_MINUTES, ChronoUnit.MINUTES);

        // 5. Get IDs of recently rejected tenants (within last 10 minutes)
        Set<String> recentlyRejectedIds = swipeHistory.stream()
                .filter(swipe -> false)
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
// UPDATE TENANT PROFILE (WITH AVATAR)
// ========================================
    /**
     * Update tenant profile with avatar
     */
    public TenantProfileResponse updateTenantProfile(
            String tenantId,
            UpdateTenantProfileRequest request,
            MultipartFile avatar) throws IOException {

        log.info("Updating tenant profile for ID: {}", tenantId);

        // 1. Get existing tenant
        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Tenant not found with ID: " + tenantId
                ));

        String oldAvatarUrl = tenant.getAvatarUrl();
        String newAvatarUrl = oldAvatarUrl;

        try {
            // 2. Handle avatar update
            if (request.getRemoveAvatar() != null && request.getRemoveAvatar()) {
                // User wants to remove avatar
                if (oldAvatarUrl != null) {
                    fileStorageService.deleteFile(oldAvatarUrl);
                    log.info("Removed avatar for tenant {}", tenantId);
                }
                newAvatarUrl = null;
            } else if (avatar != null && !avatar.isEmpty()) {
                // User is uploading a new avatar
                // Delete old avatar if exists
                if (oldAvatarUrl != null) {
                    fileStorageService.deleteFile(oldAvatarUrl);
                    log.info("Deleted old avatar for tenant {}", tenantId);
                }

                // Upload new avatar
                newAvatarUrl = fileStorageService.uploadFile(avatar, "avatars");
                log.info("Uploaded new avatar for tenant {}: {}", tenantId, newAvatarUrl);
            }

            // 3. Update profile fields
            tenant.setName(request.getName());
            tenant.setAvatarUrl(newAvatarUrl);
            tenant.setDescription(request.getDescription());
            tenant.setBudgetPerMonth(request.getBudgetPerMonth());
            tenant.setStayLengthMonths(request.getStayLength());
            tenant.setMoveInDate(request.getMoveInDate());
            tenant.setPreferredDistricts(request.getPreferredLocations());
            tenant.setPhone(request.getPhone());
            tenant.setAge(request.getAge());
            tenant.setGender(Tenant.GenderEnum.valueOf(request.getGender()));
            tenant.setSmoking(request.isSmoking());
            tenant.setCooking(request.isCooking());
            tenant.setNeedWindow(request.isNeedWindow());
            tenant.setMightShareBedRoom(request.isMightShareBedRoom());
            tenant.setMightShareToilet(request.isMightShareToilet());
            tenant.setUpdatedAt(Timestamp.now());

            // 4. Save updated tenant
            Tenant updatedTenant = tenantRepository.update(tenantId, tenant);

            log.info("Tenant profile updated successfully for ID: {}", tenantId);

            return TenantProfileResponse.fromTenant(updatedTenant);

        } catch (Exception e) {
            log.error("Failed to update tenant profile: {}", tenantId, e);

            // Rollback: If we uploaded a new avatar but profile update failed, delete it
            if (newAvatarUrl != null && !newAvatarUrl.equals(oldAvatarUrl)) {
                fileStorageService.deleteFile(newAvatarUrl);
                log.info("Rolled back new avatar upload due to profile update failure");
            }

            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to update tenant profile: " + e.getMessage()
            );
        }
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
    // ========================================
// BOOKMARK ROOM
// ========================================
    public BookmarkResponse bookmarkRoom(String tenantId, String roomId) {
        log.info("Bookmarking room {} for tenant {}", roomId, tenantId);

        // 1. Check if tenant exists
        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Tenant not found with ID: " + tenantId
                ));

        // 2. Check if room exists
        Room room = tenantRepository.findRoomById(roomId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Room not found with ID: " + roomId
                ));

        // 3. Check if already bookmarked
        Optional<Bookmark> existingBookmark = tenantRepository.findBookmarkByTenantAndRoom(tenantId, roomId);
        if (existingBookmark.isPresent()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Room already bookmarked"
            );
        }

        // 4. Create bookmark
        Bookmark bookmark = Bookmark.builder()
                .id(UUID.randomUUID().toString())
                .tenantId(tenantId)
                .roomId(roomId)
                .createdAt(Timestamp.now())
                .updatedAt(Timestamp.now())
                .build();

        // 5. Save bookmark
        Bookmark savedBookmark = tenantRepository.saveBookmark(bookmark);

        log.info("Room bookmarked successfully: {}", roomId);

        // Return without room details (lightweight response)
        return BookmarkResponse.fromBookmark(savedBookmark);
    }

    // ========================================
// UNBOOKMARK ROOM
// ========================================
    public void unbookmarkRoom(String tenantId, String roomId) {
        log.info("Unbookmarking room {} for tenant {}", roomId, tenantId);

        // 1. Find bookmark
        Bookmark bookmark = tenantRepository.findBookmarkByTenantAndRoom(tenantId, roomId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Bookmark not found for this room"
                ));

        // 2. Verify ownership
        if (!bookmark.getTenantId().equals(tenantId)) {
            throw new AccessDeniedException("You don't have permission to remove this bookmark");
        }

        // 3. Delete bookmark
        tenantRepository.deleteBookmark(bookmark.getId());

        log.info("Room unbookmarked successfully: {}", roomId);
    }

    // ========================================
// GET ALL BOOKMARKS
// ========================================
    public List<BookmarkResponse> getAllBookmarks(String tenantId) {
        log.info("Getting all bookmarks for tenant: {}", tenantId);

        // 1. Check if tenant exists
        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Tenant not found with ID: " + tenantId
                ));

        // 2. Get all bookmarks
        List<Bookmark> bookmarks = tenantRepository.findBookmarksByTenantId(tenantId);

        // 3. Get room details for each bookmark
        List<BookmarkResponse> responses = new ArrayList<>();

        for (Bookmark bookmark : bookmarks) {
            try {
                Optional<Room> roomOpt = tenantRepository.findRoomById(bookmark.getRoomId());

                if (roomOpt.isPresent()) {
                    Room room = roomOpt.get();

                    // Use method with room details
                    BookmarkResponse response = BookmarkResponse.fromBookmarkWithRoom(bookmark, room);
                    responses.add(response);
                } else {
                    // Room might have been deleted
                    log.warn("Room not found for bookmark: {}", bookmark.getRoomId());
                    // Optionally delete orphaned bookmark
                    tenantRepository.deleteBookmark(bookmark.getId());
                }
            } catch (Exception e) {
                log.error("Error fetching room details for bookmark: {}", bookmark.getId(), e);
            }
        }

        log.info("Retrieved {} bookmarks for tenant: {}", responses.size(), tenantId);

        return responses;
    }
}