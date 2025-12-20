// FE/src/contexts/NotificationContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import websocketService from '../services/websocketService';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const currentUserId = user.userId;
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!currentUserId || !token) return;

    console.log('🔔 NotificationContext: Initializing...');

    let unsubscribeMessages = null;
    let unsubscribeSwipes = null;
    let unsubscribeConversations = null;

    websocketService.connect(token, currentUserId)
      .then(() => {
        console.log('✅ NotificationContext: WebSocket connected');
        setIsConnected(true);

        // ✅ Listen for new messages
        unsubscribeMessages = websocketService.onNewMessage((payload) => {
          console.log('💬 New message notification:', payload);
          
          // Don't notify for own messages
          if (payload.senderId === currentUserId) return;

          const notification = {
            id: `msg-${payload.messageId}-${Date.now()}`,
            type: 'message',
            icon: '💬',
            title: 'New Message',
            description: `${payload.senderName}: ${payload.content || 'Sent you a message'}`,
            timestamp: payload.timestamp || new Date().toISOString(),
            data: {
              conversationId: payload.conversationId,
              senderId: payload.senderId,
              senderName: payload.senderName,
            },
            read: false,
          };

          addNotification(notification);
        });

        // ✅ Listen for swipes/matches
        unsubscribeSwipes = websocketService.onNewSwipe((payload) => {
          console.log('👍 New swipe notification:', payload);

          if (payload.isMatch) {
            const notification = {
              id: `match-${payload.swipeId}-${Date.now()}`,
              type: 'match',
              icon: '🎉',
              title: "It's a Match!",
              description: `You matched with ${payload.swiperName}!`,
              timestamp: payload.timestamp || new Date().toISOString(),
              data: {
                conversationId: payload.conversationId,
                swiperId: payload.swiperId,
                swiperName: payload.swiperName,
                roomId: payload.roomId,
              },
              read: false,
            };

            addNotification(notification);
          }
        });

        // ✅ Listen for 3-way conversations
        unsubscribeConversations = websocketService.onConversationNotification((payload) => {
          console.log('👥 New 3-way conversation notification:', payload);

          const participantNames = payload.participants
            .filter(p => p.userId !== currentUserId)
            .map(p => p.name)
            .join(' and ');

          const notification = {
            id: `group-${payload.conversationId}-${Date.now()}`,
            type: 'group_chat',
            icon: '👥',
            title: 'Group Chat Created!',
            description: `"${payload.roomTitle}" with ${participantNames}`,
            timestamp: payload.timestamp || new Date().toISOString(),
            data: {
              conversationId: payload.conversationId,
              roomId: payload.roomId,
              roomTitle: payload.roomTitle,
              participants: payload.participants,
            },
            read: false,
          };

          addNotification(notification);
        });
      })
      .catch(error => {
        console.error('❌ NotificationContext: Failed to connect WebSocket:', error);
        setIsConnected(false);
      });

    return () => {
      console.log('🧹 NotificationContext: Cleaning up');
      if (unsubscribeMessages) unsubscribeMessages();
      if (unsubscribeSwipes) unsubscribeSwipes();
      if (unsubscribeConversations) unsubscribeConversations();
    };
  }, [currentUserId, token]);

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev].slice(0, 50)); // Keep last 50
    setUnreadCount(prev => prev + 1);

    // Show browser notification if permitted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.description,
        icon: '/logo192.png', // ✅ Use React's default logo or add your own
        tag: notification.id,
      });
    }
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    setUnreadCount(0);
  };

  const clearNotification = (notificationId) => {
    const notif = notifications.find(n => n.id === notificationId);
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    if (notif && !notif.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);

    // Navigate based on notification type
    switch (notification.type) {
      case 'message':
      case 'match':
      case 'group_chat':
        if (notification.data.conversationId) {
          navigate('/dashboard/messages', {
            state: { conversationId: notification.data.conversationId }
          });
        }
        break;
      default:
        break;
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isConnected,
        markAsRead,
        markAllAsRead,
        clearNotification,
        clearAllNotifications,
        handleNotificationClick,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};