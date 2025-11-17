package org.example.Broomate.dto.response.tenant;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.Broomate.dto.response.allAuthUser.RoomDetailResponse;
import org.example.Broomate.model.Bookmark;
import org.example.Broomate.model.Room;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Bookmark response with optional room details")
public class BookmarkResponse {

    @Schema(description = "Bookmark ID", example = "bookmark-123")
    private String id;

    @Schema(description = "Room ID", example = "room-456")
    private String roomId;

    @Schema(description = "Bookmarked at timestamp", example = "2025-11-05T10:30:00Z")
    private String bookmarkedAt;

    @Schema(description = "Room details (included when fetching all bookmarks)")
    private RoomDetailResponse room;

    /**
     * Create response without room details (for bookmark/unbookmark actions)
     */
    public static BookmarkResponse fromBookmark(Bookmark bookmark) {
        return BookmarkResponse.builder()
                .id(bookmark.getId())
                .roomId(bookmark.getRoomId())
                .bookmarkedAt(bookmark.getCreatedAt() != null ?
                        bookmark.getCreatedAt().toString() : null)
                .room(null)  // No room details
                .build();
    }

    /**
     * Create response with room details (for listing bookmarks)
     */
    public static BookmarkResponse fromBookmarkWithRoom(Bookmark bookmark, Room room) {
        return BookmarkResponse.builder()
                .id(bookmark.getId())
                .roomId(bookmark.getRoomId())
                .bookmarkedAt(bookmark.getCreatedAt() != null ?
                        bookmark.getCreatedAt().toString() : null)
                .room(RoomDetailResponse.fromRoom(room))  // Include room details
                .build();
    }
}