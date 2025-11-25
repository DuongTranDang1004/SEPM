package org.example.Broomate.dto.response.allAuthUser;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.Broomate.model.Conversation;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Conversation detail response")
public class ConversationDetailResponse {

    @Schema(description = "Conversation ID", example = "conv123")
    private String id;

    @Schema(description = "Participant IDs", example = "[\"user1\", \"user2\"]")
    private List<String> participantIds;

    // ✅ ADD THESE NEW FIELDS
    @Schema(description = "Other participant's user ID", example = "user456")
    private String otherParticipantId;

    @Schema(description = "Other participant's name", example = "Jane Doe")
    private String otherParticipantName;

    @Schema(description = "Other participant's avatar URL", example = "https://example.com/avatar.jpg")
    private String otherParticipantAvatar;

    @Schema(description = "Last message content", example = "Hello, is this room still available?")
    private String lastMessage;

    @Schema(description = "Last message timestamp", example = "2025-10-24T12:30:00Z")
    private String lastMessageAt;

    @Schema(description = "Unread message count", example = "3")
    private Integer unreadCount;

    @Schema(description = "Created timestamp", example = "2025-10-20T10:00:00Z")
    private String createdAt;

    @Schema(description = "Updated timestamp", example = "2025-10-24T12:30:00Z")
    private String updatedAt;

    // ✅ UPDATED: Now requires otherParticipant info
    public static ConversationDetailResponse fromConversation(
            Conversation conversation,
            String currentUserId,
            String otherParticipantName,
            String otherParticipantAvatar
    ) {
        // Find the other participant ID
        String otherParticipantId = conversation.getParticipantIds().stream()
                .filter(id -> !id.equals(currentUserId))
                .findFirst()
                .orElse(null);

        return ConversationDetailResponse.builder()
                .id(conversation.getId())
                .participantIds(conversation.getParticipantIds())
                .otherParticipantId(otherParticipantId)
                .otherParticipantName(otherParticipantName)
                .otherParticipantAvatar(otherParticipantAvatar)
                .lastMessage(conversation.getLastMessage())
                .lastMessageAt(conversation.getLastMessageAt() != null ?
                        conversation.getLastMessageAt().toString() : null)
                .unreadCount(0) // TODO: Implement unread count logic
                .createdAt(conversation.getCreatedAt() != null ?
                        conversation.getCreatedAt().toString() : null)
                .updatedAt(conversation.getUpdatedAt() != null ?
                        conversation.getUpdatedAt().toString() : null)
                .build();
    }
}