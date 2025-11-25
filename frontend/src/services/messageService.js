// src/services/messageService.js
import api from './api';

const messageService = {
  // ===== CONVERSATIONS =====
  
  getAllConversations: async () => {
    const response = await api.get('/user/conversations');
    return response.data;
  },

  // ✅ ADD THIS - Get specific conversation
  getConversation: async (conversationId) => {
    const response = await api.get(`/user/conversations/${conversationId}`);
    return response.data;
  },

  createOrGetConversation: async (participantId) => {
    const response = await api.post('/user/conversations', {
      participantIds: [participantId]
    });
    return response.data;
  },

  // ===== MESSAGES =====
  
  // ✅ VERIFY THIS EXISTS - Get messages for a conversation
  getMessages: async (conversationId) => {
    const response = await api.get(`/user/conversations/${conversationId}/messages`);
    return response.data;
  },

  sendMessage: async (conversationId, content) => {
    const formData = new FormData();
    formData.append('content', content);

    const response = await api.post(
      `/user/conversations/${conversationId}/messages`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data;
  },

  sendMessageWithMedia: async (conversationId, content, mediaFile) => {
    const formData = new FormData();
    formData.append('content', content);
    if (mediaFile) {
      formData.append('media', mediaFile);
    }

    const response = await api.post(
      `/user/conversations/${conversationId}/messages`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data;
  },

  markAsRead: async (conversationId) => {
    const response = await api.put(
      `/user/conversations/${conversationId}/read`,
      {}
    );
    return response.data;
  }
};

export default messageService;