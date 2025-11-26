import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Loader } from 'lucide-react';
import ConversationList from '../../components/messaging/ConversationList';
import ChatWindow from '../../components/messaging/ChatWindow';
import messageService from '../../services/messageService';

function MessagesPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const currentUserId = user.userId;

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (location.state?.conversationId && conversations.length > 0) {
      const convId = location.state.conversationId;

      // Handle both 'conversationId' and 'id' field names
      const conv = conversations.find(c => 
        c.conversationId === convId || c.id === convId
      );
      
      if (conv) {
        console.log('✅ Found conversation:', conv);
        handleSelectConversation(conv);
      } else {
        console.log('❌ Conversation not found in list!');
      }
    }
  }, [location.state, conversations]);

  const fetchConversations = async () => {
    try {
      const data = await messageService.getAllConversations();
      setConversations(data.conversations || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectConversation = async (conversation) => {
    // Handle both 'conversationId' and 'id' field names
    const convId = conversation?.conversationId || conversation?.id;
    
    // Validate conversation ID exists
    if (!convId) {
      console.error('❌ ERROR: No conversationId or id found in conversation object:', conversation);
      alert('Cannot load conversation: Missing conversation ID');
      return;
    }

    setSelectedConversation(conversation);

    try {
      const data = await messageService.getMessages(convId);
      console.log('✅ Messages loaded:', data);
      setMessages(data.messages || []);
      
      // Mark as read
      await messageService.markAsRead(convId);
    } catch (error) {
      console.error('❌ Error fetching messages:', error);
      console.error('Error details:', error.response?.data || error.message);
      setMessages([]);
      alert('Failed to load messages. Please try again.');
    }
  };

  // ✅ UPDATED: Now accepts file parameter like MessengerPopup
  const handleSendMessage = async (content, file = null) => {
    if (!selectedConversation) {
      console.error('❌ No conversation selected');
      return;
    }

    // Handle both 'conversationId' and 'id' field names
    const convId = selectedConversation?.conversationId || selectedConversation?.id;
    
    // Validate conversation ID before sending
    if (!convId) {
      console.error('❌ Selected conversation has no ID:', selectedConversation);
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
      // ✅ Use same service method as MessengerPopup with file support
      const newMessage = await messageService.sendMessage(convId, content, file);

      console.log('✅ Message sent:', newMessage);
      setMessages(prev => [...prev, newMessage]);
    } catch (error) {
      console.error('❌ Error sending message:', error);
      console.error('Error details:', error.response?.data || error.message);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.otherParticipantName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader className="w-12 h-12 text-teal-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full flex bg-gray-50">
      {/* Conversation List Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back</span>
          </button>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Messages</h2>
        </div>

        <ConversationList
          conversations={filteredConversations}
          selectedConversation={selectedConversation}
          onSelectConversation={handleSelectConversation}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          compact={false}
        />
      </div>

      {/* Chat Window - Now with file upload support via MessageInput */}
      <ChatWindow
        conversation={selectedConversation}
        messages={messages}
        currentUserId={currentUserId}
        onSendMessage={handleSendMessage}
        isSending={isSending}
        compact={false}
      />
    </div>
  );
}

export default MessagesPage;