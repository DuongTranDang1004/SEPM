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
<<<<<<< HEAD
    <div className="h-full flex bg-gray-50 overflow-hidden relative">
      {/* ✅ Left Side: Conversation List Wrapper
        - Mobile: w-full (full screen)
        - Desktop: w-80 (fixed width)
        - Hidden on mobile if a conversation is selected
      */}
      <div className={`
        flex flex-col bg-white border-r border-gray-200 h-full transition-all
        w-full lg:w-80
        ${selectedConversation ? 'hidden lg:flex' : 'flex'}
      `}>
        {/* Header Section */}
        <div className="p-4 border-b flex-shrink-0">
=======
    <div className="h-full flex bg-gray-50">
      {/* Conversation List Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b">
>>>>>>> origin/Hau_Frontend_MergeLandlords
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back</span>
          </button>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Messages</h2>
        </div>

        {/* ✅ ConversationList
           - Used in compact mode because this wrapper handles the layout and header.
        */}
        <ConversationList
          conversations={filteredConversations}
          selectedConversation={selectedConversation}
          onSelectConversation={handleSelectConversation}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          compact={true} 
        />
      </div>

<<<<<<< HEAD
      {/* ✅ Right Side: Chat Window Wrapper
        - Mobile: Hidden if no conversation selected
        - Desktop: Always visible (flex-1)
      */}
      <div className={`
        flex-1 flex flex-col h-full bg-white
        ${!selectedConversation ? 'hidden lg:flex' : 'flex'}
      `}>
        <ChatWindow
          conversation={selectedConversation}
          messages={messages}
          currentUserId={currentUserId}
          onSendMessage={handleSendMessage}
          onAttachFile={() => setShowUploadModal(true)}
          isSending={isSending}
          compact={false}
          // ✅ Pass a handler to go back to the list on mobile
          onBack={() => setSelectedConversation(null)}
        />
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Upload Media</h3>
              <button onClick={() => setShowUploadModal(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <input
                type="file"
                onChange={(e) => setUploadFile(e.target.files[0])}
                accept="image/*,video/*,.pdf,.doc,.docx,.csv"
                required
                className="w-full px-4 py-2 border rounded-lg"
              />
              {uploadFile && (
                <p className="text-sm text-teal-600 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  {uploadFile.name}
                </p>
              )}
              <textarea
                value={uploadCaption}
                onChange={(e) => setUploadCaption(e.target.value)}
                rows="3"
                placeholder="Add a caption..."
                className="w-full px-4 py-2 border rounded-lg"
              />
              <button
                type="submit"
                disabled={isSending}
                className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700"
              >
                {isSending ? 'Sending...' : 'Send File'}
              </button>
            </form>
          </div>
        </div>
      )}
=======
      {/* Chat Window - Now with file upload support via MessageInput */}
      <ChatWindow
        conversation={selectedConversation}
        messages={messages}
        currentUserId={currentUserId}
        onSendMessage={handleSendMessage}
        isSending={isSending}
        compact={false}
      />
>>>>>>> origin/Hau_Frontend_MergeLandlords
    </div>
  );
}

export default MessagesPage;