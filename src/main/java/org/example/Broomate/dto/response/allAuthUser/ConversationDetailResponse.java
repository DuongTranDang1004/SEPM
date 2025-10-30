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

    @Schema(description = "Last message content", example = "Hello, is this room still available?")
    private String lastMessage;

    @Schema(description = "Last message timestamp", example = "2025-10-24T12:30:00Z")
    private String lastMessageAt;

    @Schema(description = "Created timestamp", example = "2025-10-20T10:00:00Z")
    private String createdAt;

    @Schema(description = "Updated timestamp", example = "2025-10-24T12:30:00Z")
    private String updatedAt;

    public static ConversationDetailResponse fromConversation(Conversation conversation) {
        return ConversationDetailResponse.builder()
                .id(conversation.getId())
                .participantIds(conversation.getParticipantIds())
                .lastMessage(conversation.getLastMessage())
                .lastMessageAt(conversation.getLastMessageAt() != null ?
                        conversation.getLastMessageAt().toString() : null)
                .createdAt(conversation.getCreatedAt() != null ?
                        conversation.getCreatedAt().toString() : null)
                .updatedAt(conversation.getUpdatedAt() != null ?
                        conversation.getUpdatedAt().toString() : null)
                .build();
    }
}