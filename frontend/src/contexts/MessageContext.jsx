// FE/src/contexts/MessageContext.jsx

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import messageService from '../services/messageService';
import websocketService from '../services/websocketService';

const MessageContext = createContext();

export const useMessages = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessages must be used within MessageProvider');
  }
  return context;
};

export const MessageProvider = ({ children }) => {
  const navigate = useNavigate();
  const [unreadConversationsCount, setUnreadConversationsCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  
  const conversationsWithUnreadRef = useRef(new Set());

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const currentUserId = user.userId;
  const token = localStorage.getItem('token');

  const fetchUnreadConversationsCount = async () => {
    if (!currentUserId) return;

    try {
      const data = await messageService.getAllConversations();
      
      const unreadConvIds = (data.conversations || [])
        .filter(conv => (conv.unreadCount || 0) > 0)
        .map(conv => conv.id || conv.conversationId);
      
      conversationsWithUnreadRef.current = new Set(unreadConvIds);
      setUnreadConversationsCount(unreadConvIds.length);
      
      console.log('📊 Initial unread conversations:', unreadConvIds.length);
    } catch (error) {
      console.error('❌ Error fetching unread conversations:', error);
    }
  };

  useEffect(() => {
    if (!currentUserId || !token) return;

    fetchUnreadConversationsCount();

    let unsubscribeMessages = null;
    let unsubscribeConversations = null;

    console.log('🔌 MessageContext: Connecting to WebSocket');

    websocketService.connect(token, currentUserId)
      .then(() => {
        console.log('✅ MessageContext: WebSocket connected');
        setIsConnected(true);

        // Listen for new messages
        unsubscribeMessages = websocketService.onNewMessage((payload) => {
          console.log('💬 MessageContext: New message in conversation:', payload.conversationId);
          
          // ✅ FIX: Don't count your own messages as unread
          if (payload.senderId === currentUserId) {
            console.log('⏭️ Ignoring own message for unread count');
            return;
          }
          
          const wasAlreadyUnread = conversationsWithUnreadRef.current.has(payload.conversationId);
          
          if (!wasAlreadyUnread) {
            console.log('➕ Adding NEW unread conversation:', payload.conversationId);
            conversationsWithUnreadRef.current.add(payload.conversationId);
            setUnreadConversationsCount(prev => prev + 1);
          }
        });

        // ✅ Listen for 3-way conversation creation
        unsubscribeConversations = websocketService.onConversationNotification((payload) => {
          console.log('🎉 MessageContext: 3-way conversation created:', payload);
          
          const { conversationId, roomTitle, participants } = payload;
          const participantNames = participants
            .filter(p => p.userId !== currentUserId)
            .map(p => p.name)
            .join(' and ');
          
          // Show browser notification (if permitted)
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('🎉 Perfect Match!', {
              body: `A group chat has been created for "${roomTitle}" with ${participantNames}`,
              icon: '/logo.png'
            });
          }
          
          // Show in-app confirmation
          const shouldOpen = window.confirm(
            `🎉 Match!\n\nA group chat has been created for "${roomTitle}"\nwith ${participantNames}.\n\nOpen it now?`
          );
          
          if (shouldOpen) {
            navigate('/messages', { 
              state: { conversationId: conversationId } 
            });
          }
          
          // Refresh unread count
          fetchUnreadConversationsCount();
        });
      })
      .catch(error => {
        console.error('❌ MessageContext: Failed to connect WebSocket:', error);
        setIsConnected(false);
      });

    return () => {
      console.log('🧹 MessageContext: Cleaning up');
      if (unsubscribeMessages) unsubscribeMessages();
      if (unsubscribeConversations) unsubscribeConversations();
    };
  }, [currentUserId, token, navigate]);

  const markConversationAsRead = (conversationId) => {
    const wasUnread = conversationsWithUnreadRef.current.has(conversationId);
    
    if (wasUnread) {
      console.log('✅ Marking conversation as read:', conversationId);
      conversationsWithUnreadRef.current.delete(conversationId);
      setUnreadConversationsCount(prev => Math.max(0, prev - 1));
    }
  };

  const refreshUnreadCount = () => {
    console.log('🔄 Refreshing unread conversations count...');
    fetchUnreadConversationsCount();
  };

  return (
    <MessageContext.Provider
      value={{
        unreadConversationsCount,
        isConnected,
        markConversationAsRead,
        refreshUnreadCount,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};