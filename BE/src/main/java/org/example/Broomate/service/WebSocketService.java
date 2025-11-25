package org.example.Broomate.service;

import com.google.cloud.Timestamp;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.Broomate.dto.websocket.NewMessageNotification;
import org.example.Broomate.dto.websocket.NewSwipeNotification;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class WebSocketService {

    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Send new message notification to a specific user
     */
    public void sendNewMessageNotification(String userId, NewMessageNotification notification) {
        notification.setType("NEW_MESSAGE");
        notification.setTimestamp(Timestamp.now().toString());

        log.info("Sending new message notification to user: {}", userId);

        // Send to specific user's queue
        messagingTemplate.convertAndSendToUser(
                userId,
                "/queue/messages",
                notification
        );
    }

    /**
     * Send new swipe notification to a specific user
     */
    public void sendNewSwipeNotification(String userId, NewSwipeNotification notification) {
        notification.setType("NEW_SWIPE");
        notification.setTimestamp(Timestamp.now().toString());

        log.info("Sending new swipe notification to user: {}", userId);

        // Send to specific user's queue
        messagingTemplate.convertAndSendToUser(
                userId,
                "/queue/swipes",
                notification
        );
    }

    /**
     * Send match notification to both users
     */
    public void sendMatchNotification(String userId1, String userId2, NewSwipeNotification notification) {
        notification.setType("NEW_SWIPE");
        notification.setTimestamp(Timestamp.now().toString());
        notification.setIsMatch(true);

        log.info("Sending match notification to users: {} and {}", userId1, userId2);

        // Send to both users
        messagingTemplate.convertAndSendToUser(userId1, "/queue/swipes", notification);
        messagingTemplate.convertAndSendToUser(userId2, "/queue/swipes", notification);
    }
}