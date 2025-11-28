// src/services/messageService.js
import api from './api';

const messageService = {
  // ===== CONVERSATIONS =====
  
  /**
   * Get all conversations for current user
   * Backend: GET /api/user/conversations
   */
  getAllConversations: async () => {
    const response = await api.get('/user/conversations');
    return response.data;
  },

  // ❌ REMOVE getConversation - Backend doesn't have this endpoint
  // ❌ REMOVE createOrGetConversation - Conversations created by backend automatically

  // ===== MESSAGES =====
  
  /**
   * Get messages for a conversation
   * Backend: GET /api/user/conversations/{conversationId}/messages
   * Note: Backend doesn't have this endpoint yet, but service handles 403 gracefully
   */
  getMessages: async (conversationId) => {
    try {
      const response = await api.get(`/user/conversations/${conversationId}/messages`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 403) {
        console.warn('⚠️ 403 error - conversation access denied, starting fresh');
        return { messages: [] };
      }
      throw error;
    }
  },

  /**
   * Send message with optional file attachment
   * Backend: POST /api/user/conversations/{conversationId}/messages
   * @param {string} conversationId - Conversation ID
   * @param {string} content - Message text content
   * @param {File|null} file - Optional file (image, video, or document)
   * @returns {Promise<MessageDetailResponse>}
   */
  sendMessage: async (conversationId, content, file = null) => {
    const formData = new FormData();
    formData.append('content', content);
    
    // ✅ Add file if provided
    if (file) {
      formData.append('media', file);
      console.log(`📎 Attaching file: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
    }

    const response = await api.post(
      `/user/conversations/${conversationId}/messages`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  /**
   * Mark messages as read (OPTIONAL - Backend endpoint not implemented yet)
   * Future: PUT /api/user/conversations/{conversationId}/mark-read
   */
  markAsRead: async (conversationId) => {
    try {
      const response = await api.put(`/user/conversations/${conversationId}/mark-read`);
      return response.data;
    } catch (error) {
      // Non-critical, log and continue
      console.warn('⚠️ Mark as read not implemented yet:', error.message);
      return null;
    }
  }
};

export default messageService;