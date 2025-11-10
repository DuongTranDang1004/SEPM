package org.example.Broomate.service;


import com.google.cloud.Timestamp;
import lombok.extern.slf4j.Slf4j;
import org.example.Broomate.dto.request.allAuthUser.ChangePasswordRequest;
import org.example.Broomate.dto.request.allAuthUser.SendMessageRequest;
import org.example.Broomate.dto.request.allAuthUser.ChangePasswordRequest;
import org.example.Broomate.dto.response.*;
import org.example.Broomate.dto.response.allAuthUser.*;
import org.example.Broomate.model.Account;
import org.example.Broomate.model.Conversation;
import org.example.Broomate.model.Message;
import org.example.Broomate.model.Room;
import org.example.Broomate.repository.AllAuthUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
public class AllAuthUserService {

    @Autowired
    private AllAuthUserRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private  FileStorageService fileStorageService;


    // ========================================
    // 1. GET ALL CONVERSATIONS
    // ========================================
    public ConversationListResponse getAllConversations(String userId) {
        log.info("Getting all conversations for user: {}", userId);

        List<Conversation> conversations = repository.findConversationsByUserId(userId);

        List<ConversationDetailResponse> conversationResponses = conversations.stream()
                .map(ConversationDetailResponse::fromConversation)
                .collect(Collectors.toList());

        log.info("Found {} conversations for user: {}", conversationResponses.size(), userId);

        return ConversationListResponse.builder()
                .conversations(conversationResponses)
                .totalCount(conversationResponses.size())
                .message("Conversations retrieved successfully")
                .build();
    }

    // ========================================
    // 2. GET ALL ROOMS
    // ========================================
    public RoomListResponse getAllRooms() {
        log.info("Getting all published rooms");

        // Get all published rooms
        List<Room> rooms = repository.findAllPublishedRooms();

        // Convert to response DTOs
        List<RoomDetailResponse> roomResponses = rooms.stream()
                .map(RoomDetailResponse::fromRoom)
                .collect(Collectors.toList());

        log.info("Found {} rooms", roomResponses.size());

        return RoomListResponse.builder()
                .rooms(roomResponses)
                .totalCount(roomResponses.size())
                .message("Rooms retrieved successfully")
                .build();
    }

    // ========================================
    // 3. GET ROOM DETAIL
    // ========================================
    public RoomDetailResponse getRoomDetail(String roomId) {
        log.info("Getting room detail for ID: {}", roomId);

        Room room = repository.findRoomById(roomId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Room not found with ID: " + roomId
                ));

        return RoomDetailResponse.fromRoom(room);
    }

    // ========================================
    // 4. CHANGE PASSWORD
    // ========================================
    public HTTPMessageResponse changePassword( String userId, ChangePasswordRequest request) {
        log.info("Changing password for user: {}", userId);

        // 1. Get user account
        Account account = repository.findAccountById(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found with ID: " + userId
                ));

        // 2. Verify current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), account.getPassword())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Current password is incorrect"
            );
        }

        // 3. Update to new password
        String hashedNewPassword = passwordEncoder.encode(request.getNewPassword());
        account.setPassword(hashedNewPassword);
        account.setUpdatedAt(Timestamp.now());

        repository.updateAccount(userId, account);

        log.info("Password changed successfully for user: {}", userId);

        return HTTPMessageResponse.builder()
                .message("Password changed successfully")
                .build();
    }

    // ========================================
    // 5. SEND MESSAGE WITH MEDIA

// ========================================
    public MessageDetailResponse sendMessage(
            String userId,
            String conversationId,
            SendMessageRequest request,
            MultipartFile media) throws IOException {

        log.info("Sending message in conversation: {} from user: {}", conversationId, userId);

        String uploadedMediaUrl = null;

        try {
            // 1. Get conversation
            Conversation conversation = repository.findConversationById(conversationId)
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Conversation not found with ID: " + conversationId
                    ));

            // 2. Verify user is a participant
            if (!conversation.getParticipantIds().contains(userId)) {
                throw new AccessDeniedException("You are not a participant in this conversation");
            }

            // 3. Upload media file if provided
            if (media != null && !media.isEmpty()) {
                // Determine folder based on file type
                String folder = determineMediaFolder(media);
                uploadedMediaUrl = fileStorageService.uploadFile(media, folder);
                log.info("Media uploaded successfully: {}", uploadedMediaUrl);
            }

            // 4. Create message
            List<String> mediaUrls = uploadedMediaUrl != null
                    ? List.of(uploadedMediaUrl)
                    : List.of();

            Message message = Message.builder()
                    .id(UUID.randomUUID().toString())
                    .conversationId(conversationId)
                    .senderId(userId)
                    .content(request.getContent())
                    .mediaUrls(mediaUrls)
                    .readBy(List.of(userId))  // Sender has read it
                    .createdAt(Timestamp.now())
                    .updatedAt(Timestamp.now())
                    .build();

            // 5. Save message
            repository.saveMessage(message);

            // 6. Update conversation's last message
            conversation.setLastMessage(request.getContent());
            conversation.setLastMessageAt(Timestamp.now());
            conversation.setUpdatedAt(Timestamp.now());
            repository.updateConversation(conversationId, conversation);

            log.info("Message sent successfully in conversation: {}", conversationId);

            return MessageDetailResponse.fromMessage(message);

        } catch (Exception e) {
            // Rollback: Delete uploaded media if message sending fails
            log.error("Failed to send message, rolling back uploaded media", e);
            if (uploadedMediaUrl != null) {
                fileStorageService.deleteFile(uploadedMediaUrl);
            }

            if (e instanceof ResponseStatusException || e instanceof AccessDeniedException) {
                throw e;
            }
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to send message: " + e.getMessage()
            );
        }
    }

    /**
     * Determine the correct folder based on file type
     */
    private String determineMediaFolder(MultipartFile file) {
        String contentType = file.getContentType();

        if (contentType == null) {
            return "documents"; // Default
        }

        if (contentType.startsWith("image/")) {
            return "images";
        } else if (contentType.startsWith("video/")) {
            return "videos";
        } else {
            return "documents";
        }
    }

    // ========================================
    // 6. DEACTIVATE PROFILE
    // ========================================
    public HTTPMessageResponse deactivateProfile(String userId) {
        log.info("Deactivating profile for user: {}", userId);

        Account account = repository.findAccountById(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found with ID: " + userId
                ));

        account.setActive(false);
        account.setUpdatedAt(Timestamp.now());

        repository.updateAccount(userId, account);

        log.info("Profile deactivated for user: {}", userId);

        return HTTPMessageResponse.builder()
                .message("Profile deactivated successfully")
                .build();
    }

    // ========================================
    // 7. ACTIVATE PROFILE
    // ========================================
    public HTTPMessageResponse activateProfile(String userId) {
        log.info("Activating profile for user: {}", userId);

        Account account = repository.findAccountById(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found with ID: " + userId
                ));

        account.setActive(true);
        account.setUpdatedAt(Timestamp.now());

        repository.updateAccount(userId, account);

        log.info("Profile activated for user: {}", userId);

        return HTTPMessageResponse.builder()
                .message("Profile activated successfully")
                .build();
    }
}