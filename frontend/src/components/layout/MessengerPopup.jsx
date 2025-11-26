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
      console.log('💬 MessengerPopup - Fetched conversations:', data.conversations?.length);
      
      // ✅ DEBUG: Log first conversation structure
      if (data.conversations?.length > 0) {
        console.log('🔍 First conversation structure:', data.conversations[0]);
        console.log('🔑 First conversation ID:', data.conversations[0].conversationId || data.conversations[0].id);
      }
      
      setConversations(data.conversations || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  // Select conversation and fetch messages
  const handleSelectConversation = async (conversation) => {
    console.log('🎯 MessengerPopup - Selected conversation:', conversation);
    
    setSelectedConversation(conversation);
    setIsLoading(true);

    // ✅ Handle both 'conversationId' and 'id' field names
    const convId = conversation?.conversationId || conversation?.id;
    console.log('🔑 MessengerPopup - Extracted conversation ID:', convId);
    
    if (!convId) {
      console.error('❌ No conversation ID found:', conversation);
      alert('Cannot open conversation: Missing ID');
      setIsLoading(false);
      return;
    }

    try {
      console.log('📥 MessengerPopup - Fetching messages for:', convId);
      const data = await messageService.getMessages(convId);
      console.log('✅ MessengerPopup - Messages loaded:', data.messages?.length);
      setMessages(data.messages || []);
      
      // ✅ Mark messages as read when conversation is opened
      try {
        await messageService.markAsRead(convId);
      } catch (readError) {
        console.warn('⚠️ Could not mark as read:', readError);
        // Non-critical, continue anyway
      }
    } catch (error) {
      console.error('❌ MessengerPopup - Error fetching messages:', error);
      console.error('Error details:', error.response?.data || error.message);
      
      // ✅ Start with empty messages (user can still send new ones)
      setMessages([]);
      console.warn('⚠️ Starting with empty conversation');
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ UPDATED - Send message with optional file
  const handleSendMessage = async (content, file = null) => {
    if (!selectedConversation) {
      console.error('❌ No conversation selected');
      return;
    }

    const convId = selectedConversation?.conversationId || selectedConversation?.id;
    
    if (!convId) {
      console.error('❌ No conversation ID found');
      alert('Cannot send message: Invalid conversation');
      return;
    }

    console.log('📤 Sending message:', { 
      conversationId: convId, 
      hasContent: !!content, 
      hasFile: !!file,
      fileName: file?.name 
    });
    
    setIsSending(true);

    try {
      // ✅ Call updated service with file support
      const newMessage = await messageService.sendMessage(convId, content, file);
      
      console.log('✅ Message sent successfully:', newMessage);
      setMessages(prev => [...prev, newMessage]);
    } catch (error) {
      console.error('❌ Error sending message:', error);
      console.error('Error details:', error.response?.data || error.message);
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