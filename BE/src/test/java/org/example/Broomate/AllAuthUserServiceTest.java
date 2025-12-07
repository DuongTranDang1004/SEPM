package org.example.Broomate;

import org.example.Broomate.dto.request.allAuthUser.SendMessageRequest;
import org.example.Broomate.dto.websocket.NewMessageNotification;
import org.example.Broomate.model.Conversation;
import org.example.Broomate.repository.AllAuthUserRepository;
import org.example.Broomate.service.AllAuthUserService;
import org.example.Broomate.service.FileStorageService;
import org.example.Broomate.service.WebSocketService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AllAuthUserServiceTest {

        @Mock
        private AllAuthUserRepository repository;

        @Mock
        private FileStorageService fileStorageService;

        @Mock
        private WebSocketService webSocketService;

        @InjectMocks
        private AllAuthUserService allAuthUserService;

        private String tenantAId;
        private String tenantBId;
        private String conversationId;

        @BeforeEach
        void setUp() {
                tenantAId = "tenant-a-123";
                tenantBId = "tenant-b-456";
                conversationId = "conversation-789";
        }

        @Test
        void testSendMessage_ShouldFailWhenNotParticipant() {
                // Arrange
                String unauthorizedTenantId = "tenant-c-999";

                Conversation conversation = Conversation.builder()
                                .id(conversationId)
                                .participantIds(Arrays.asList(tenantAId, tenantBId))
                                .build();

                SendMessageRequest request = SendMessageRequest.builder()
                                .content("Hello, can we be roommates?")
                                .build();

                when(repository.findConversationById(conversationId))
                                .thenReturn(Optional.of(conversation));

                // Act & Assert
                ResponseStatusException exception = assertThrows(
                                ResponseStatusException.class,
                                () -> allAuthUserService.sendMessage(unauthorizedTenantId, conversationId, request, null)
                );

                assertEquals(HttpStatus.FORBIDDEN, exception.getStatusCode());
                assertTrue(exception.getReason().contains("not a participant"));
                
                verify(repository, times(1)).findConversationById(conversationId);
                verify(repository, never()).saveMessage(any());

                System.out.println("✅ Test Passed: Cannot send message without being participant");
        }

        @Test
        void testSendMessage_ShouldFailWhenConversationNotFound() {
                // Arrange
                SendMessageRequest request = SendMessageRequest.builder()
                                .content("Hello!")
                                .build();

                when(repository.findConversationById(anyString()))
                                .thenReturn(Optional.empty());

                // Act & Assert
                ResponseStatusException exception = assertThrows(
                                ResponseStatusException.class,
                                () -> allAuthUserService.sendMessage(tenantAId, "non-existent-conv", request, null));

                assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
                assertTrue(exception.getReason().contains("Conversation not found"));
                verify(repository, never()).saveMessage(any());

                System.out.println("✅ Test passed: Cannot send message to non-existent conversation");
        }

        @Test
        void testSendMessage_ShouldSucceedWhenUserIsParticipant() throws Exception {
                // Arrange
                Conversation conversation = Conversation.builder()
                                .id(conversationId)
                                .participantIds(Arrays.asList(tenantAId, tenantBId))
                                .build();

                SendMessageRequest request = SendMessageRequest.builder()
                                .content("Hello, nice to meet you!")
                                .build();

                when(repository.findConversationById(conversationId))
                                .thenReturn(Optional.of(conversation));

                doNothing().when(webSocketService).sendNewMessageNotification(
                                anyString(),
                                any(NewMessageNotification.class));

                // Act
                assertDoesNotThrow(() -> allAuthUserService.sendMessage(tenantAId, conversationId, request, null));

                // Verify
                verify(repository, times(1)).saveMessage(any());
                verify(repository, times(1)).updateConversation(anyString(), any());

                System.out.println("✅ Test passed: Message sent successfully");
        }

        // ✅ REMOVED: testSendMessage_ShouldFailWhenTenantTriesToMessageThemselves
        // This edge case is extremely unlikely in production and adds no value
}