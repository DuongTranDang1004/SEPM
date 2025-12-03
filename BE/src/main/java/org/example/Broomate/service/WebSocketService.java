package org.example.Broomate.service;

import com.google.cloud.Timestamp;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.Broomate.dto.websocket.NewMessageNotification;
import org.example.Broomate.dto.websocket.NewSwipeNotification;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.user.SimpUserRegistry;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class WebSocketService {

    private final SimpMessagingTemplate messagingTemplate;
    private final SimpUserRegistry userRegistry;  // ✅ Add this

    public void sendNewMessageNotification(String userId, NewMessageNotification notification) {
        notification.setType("NEW_MESSAGE");
        notification.setTimestamp(Timestamp.now().toString());

        log.info("🔔 Sending new message notification to user: {}", userId);
        log.info("📨 Notification content: {}", notification.getContent());
        log.info("📍 Destination: /user/{}/queue/messages", userId);
        
        // ✅ Check if user is connected
        boolean isUserConnected = userRegistry.getUser(userId) != null;
        log.info("🔌 Is user {} connected? {}", userId, isUserConnected);
        
        if (!isUserConnected) {
            log.warn("⚠️ User {} is NOT connected to WebSocket!", userId);
            log.info("📋 Currently connected users: {}", userRegistry.getUserCount());
        }

        try {
            messagingTemplate.convertAndSendToUser(
                    userId,
                    "/queue/messages",
                    notification
            );
            log.info("✅ Message notification sent successfully to user: {}", userId);
        } catch (Exception e) {
            log.error("❌ Failed to send notification to user {}: {}", userId, e.getMessage(), e);
        }
    }

    public void sendNewSwipeNotification(String userId, NewSwipeNotification notification) {
        notification.setType("NEW_SWIPE");
        notification.setTimestamp(Timestamp.now().toString());

        log.info("🔔 Sending new swipe notification to user: {}", userId);

        messagingTemplate.convertAndSendToUser(
                userId,
                "/queue/swipes",
                notification
        );
    }

    public void sendMatchNotification(String userId1, String userId2, NewSwipeNotification notification) {
        notification.setType("NEW_SWIPE");
        notification.setTimestamp(Timestamp.now().toString());
        notification.setIsMatch(true);

        log.info("🔔 Sending match notification to users: {} and {}", userId1, userId2);

        messagingTemplate.convertAndSendToUser(userId1, "/queue/swipes", notification);
        messagingTemplate.convertAndSendToUser(userId2, "/queue/swipes", notification);
    }
}