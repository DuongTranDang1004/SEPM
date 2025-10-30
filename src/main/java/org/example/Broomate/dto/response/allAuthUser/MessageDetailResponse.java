package org.example.Broomate.dto.response.allAuthUser;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.Broomate.model.Message;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Message detail response")
public class MessageDetailResponse {

    @Schema(description = "Message ID", example = "msg123")
    private String id;

    @Schema(description = "Conversation ID", example = "conv123")
    private String conversationId;

    @Schema(description = "Sender ID", example = "user123")
    private String senderId;

    @Schema(description = "Message content", example = "Hello, is this room still available?")
    private String content;

    @Schema(description = "Media URLs", example = "[]")
    private List<String> mediaUrls;

    @Schema(description = "User IDs who read this message", example = "[\"user123\"]")
    private List<String> readBy;

    @Schema(description = "Created timestamp", example = "2025-10-24T12:30:00Z")
    private String createdAt;

    public static MessageDetailResponse fromMessage(Message message) {
        return MessageDetailResponse.builder()
                .id(message.getId())
                .conversationId(message.getConversationId())
                .senderId(message.getSenderId())
                .content(message.getContent())
                .mediaUrls(message.getMediaUrls())
                .readBy(message.getReadBy())
                .createdAt(message.getCreatedAt() != null ?
                        message.getCreatedAt().toString() : null)
                .build();
    }
}
