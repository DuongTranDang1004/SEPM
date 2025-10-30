package org.example.Broomate.dto.response.tenant;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.Broomate.dto.response.allAuthUser.RoomDetailResponse;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookmarkResponse {
    
    @Schema(description = "Bookmark ID", example = "bookmark_123")
    private String id;
    
    @Schema(description = "Room ID", example = "room_456")
    private String roomId;
    
    @Schema(description = "Bookmarked at timestamp", example = "2024-01-15T10:30:00Z")
    private String bookmarkedAt;
    
    @Schema(description = "Room details")
    private RoomDetailResponse room;
}
