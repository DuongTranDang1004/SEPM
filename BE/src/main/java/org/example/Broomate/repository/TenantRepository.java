package org.example.Broomate.repository;

import com.google.cloud.Timestamp;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.firebase.cloud.FirestoreClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.Broomate.model.Tenant;
import org.example.Broomate.model.Match;
import org.example.Broomate.model.Swipe;
import org.example.Broomate.model.Conversation;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Slf4j
@Repository
@RequiredArgsConstructor
public class TenantRepository {

    private static final String TENANTS_COLLECTION = "tenants";
    private static final String SWIPES_COLLECTION = "swipes";
    private static final String MATCHES_COLLECTION = "matches";
    private static final String CONVERSATIONS_COLLECTION = "conversations";
    private final Firestore firestore;

    // ========================================
    // TENANT CRUD OPERATIONS
    // ========================================

    /**
     * Find tenant by ID
     */
    public Optional<Tenant> findById(String tenantId) {
        try {
            DocumentSnapshot document =  firestore
                    .collection(TENANTS_COLLECTION)
                    .document(tenantId)
                    .get()
                    .get();

            if (!document.exists()) {
                return Optional.empty();
            }

            return Optional.ofNullable(document.toObject(Tenant.class));
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error finding tenant by ID: {}", tenantId, e);
            throw new RuntimeException("Failed to find tenant", e);
        }
    }

    /**
     * Find all active tenants with role TENANT
     */
    public List<Tenant> findAllActiveTenants() {
        try {
            QuerySnapshot querySnapshot = firestore.collection(TENANTS_COLLECTION)
                    .whereEqualTo("role", "TENANT")
                    .whereEqualTo("active", true)
                    .get()
                    .get();

            return querySnapshot.getDocuments().stream()
                    .map(doc -> doc.toObject(Tenant.class))
                    .collect(Collectors.toList());
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error finding all active tenants", e);
            throw new RuntimeException("Failed to find active tenants", e);
        }
    }

    /**
     * Update tenant
     */
    public Tenant update(String tenantId, Tenant tenant) {
        try {
            tenant.setUpdatedAt(Timestamp.now());
            
            firestore.collection(TENANTS_COLLECTION)
                    .document(tenantId)
                    .set(tenant)
                    .get();

            return tenant;
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error updating tenant: {}", tenantId, e);
            throw new RuntimeException("Failed to update tenant", e);
        }
    }

    // ========================================
    // SWIPE CRUD OPERATIONS
    // ========================================

    /**
     * Find all swipes by swiper ID
     */
    public List<Swipe> findSwipesBySwiperId(String swiperId) {
        try {
            QuerySnapshot querySnapshot = firestore.collection(SWIPES_COLLECTION)
                    .whereEqualTo("swiperId", swiperId)
                    .get()
                    .get();

            return querySnapshot.getDocuments().stream()
                    .map(doc -> doc.toObject(Swipe.class))
                    .collect(Collectors.toList());
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error finding swipes by swiper ID: {}", swiperId, e);
            throw new RuntimeException("Failed to find swipes", e);
        }
    }

    /**
     * Find swipe by swiper and target
     */
    public Optional<Swipe> findSwipe(String swiperId, String targetId) {
        try {
            QuerySnapshot querySnapshot = firestore.collection(SWIPES_COLLECTION)
                    .whereEqualTo("swiperId", swiperId)
                    .whereEqualTo("targetId", targetId)
                    .get()
                    .get();

            if (querySnapshot.isEmpty()) {
                return Optional.empty();
            }

            return Optional.of(querySnapshot.getDocuments().get(0).toObject(Swipe.class));
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error finding swipe between {} and {}", swiperId, targetId, e);
            throw new RuntimeException("Failed to find swipe", e);
        }
    }

    /**
     * Save swipe
     */
    public Swipe saveSwipe(Swipe swipe) {
        try {
            firestore.collection(SWIPES_COLLECTION)
                    .document(swipe.getId())
                    .set(swipe)
                    .get();

            return swipe;
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error saving swipe", e);
            throw new RuntimeException("Failed to save swipe", e);
        }
    }

    // ========================================
    // MATCH CRUD OPERATIONS
    // ========================================

    /**
     * Find all active matches for a tenant
     */
    public List<Match> findActiveMatchesByTenantId(String tenantId) {
        try {

            // Need to query twice since Firestore doesn't support OR on different fields
            QuerySnapshot matches1 = firestore.collection(MATCHES_COLLECTION)
                    .whereEqualTo("tenant1Id", tenantId)
                    .whereEqualTo("status", "ACTIVE")
                    .get()
                    .get();

            QuerySnapshot matches2 = firestore.collection(MATCHES_COLLECTION)
                    .whereEqualTo("tenant2Id", tenantId)
                    .whereEqualTo("status", "ACTIVE")
                    .get()
                    .get();

            List<Match> allMatches = matches1.getDocuments().stream()
                    .map(doc -> doc.toObject(Match.class))
                    .collect(Collectors.toList());

            allMatches.addAll(matches2.getDocuments().stream()
                    .map(doc -> doc.toObject(Match.class))
                    .collect(Collectors.toList()));

            return allMatches;
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error finding matches for tenant: {}", tenantId, e);
            throw new RuntimeException("Failed to find matches", e);
        }
    }

    /**
     * Save match
     */
    public Match saveMatch(Match match) {
        try {
            firestore.collection(MATCHES_COLLECTION)
                    .document(match.getId())
                    .set(match)
                    .get();

            return match;
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error saving match", e);
            throw new RuntimeException("Failed to save match", e);
        }
    }

    // ========================================
    // CONVERSATION CRUD OPERATIONS
    // ========================================

    /**
     * Save conversation
     */
    public Conversation saveConversation(Conversation conversation) {
        try {
            firestore.collection(CONVERSATIONS_COLLECTION)
                    .document(conversation.getId())
                    .set(conversation)
                    .get();

            return conversation;
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error saving conversation", e);
            throw new RuntimeException("Failed to save conversation", e);
        }
    }
}