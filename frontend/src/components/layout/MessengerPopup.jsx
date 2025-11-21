import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import ConversationList from '../messaging/ConversationList';
import ChatWindow from '../messaging/ChatWindow';
import messageService from '../../services/messageService';

/**
 * Floating messenger popup (Facebook-style)
 * Uses shared messaging components and services
 */
function MessengerPopup({ isOpen, onClose }) {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Get current user - ✅ FIXED: Use userId instead of id
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const currentUserId = user.userId;  // ✅ Correct property

  // Fetch conversations when popup opens
  useEffect(() => {
    if (isOpen) {
      fetchConversations();
    }
  }, [isOpen]);

  // Fetch conversations using service
  const fetchConversations = async () => {
    try {
      const data = await messageService.getAllConversations();
      setConversations(data.conversations || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  // Select conversation and fetch messages
  const handleSelectConversation = async (conversation) => {
    setSelectedConversation(conversation);
    setIsLoading(true);

    try {
      const data = await messageService.getMessages(conversation.conversationId);
      setMessages(data.messages || []);
      
      // ✅ Mark messages as read when conversation is opened
      await messageService.markAsRead(conversation.conversationId);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Send message using service
  const handleSendMessage = async (content) => {
    if (!selectedConversation) return;

    setIsSending(true);

    try {
      const newMessage = await messageService.sendMessage(
        selectedConversation.conversationId,
        content
      );

      setMessages(prev => [...prev, newMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  // Handle file attachment (placeholder)
  const handleAttachFile = () => {
    alert('File upload coming soon! Use the full Messages page for file uploads.');
  };

  // Go back to conversation list
  const handleBack = () => {
    setSelectedConversation(null);
    setMessages([]);
  };

  // Filter conversations
  const filteredConversations = conversations.filter(conv =>
    conv.otherParticipantName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-20 z-40"
        onClick={onClose}
      />

      {/* Messenger Popup */}
      <div className="fixed bottom-0 right-6 w-96 h-[600px] bg-white rounded-t-2xl shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-4 py-3 rounded-t-2xl flex items-center justify-between flex-shrink-0">
          <h3 className="font-semibold text-lg">Messages</h3>
          <button 
            onClick={onClose}
            className="hover:bg-white/20 p-1 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {!selectedConversation ? (
          <ConversationList
            conversations={filteredConversations}
            selectedConversation={selectedConversation}
            onSelectConversation={handleSelectConversation}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            compact={true}
          />
        ) : (
          <ChatWindow
            conversation={selectedConversation}
            messages={messages}
            currentUserId={currentUserId}
            onSendMessage={handleSendMessage}
            onAttachFile={handleAttachFile}
            onBack={handleBack}
            isSending={isSending}
            isLoading={isLoading}
            compact={true}
          />
        )}
      </div>
    </>
  );
}

export default MessengerPopup;