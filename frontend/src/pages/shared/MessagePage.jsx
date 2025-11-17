import React, { useState } from 'react';

function MessagePage() {
  const [selectedConversation, setSelectedConversation] = useState(1);
  const [messageInput, setMessageInput] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadCaption, setUploadCaption] = useState('');
  const [messages, setMessages] = useState({});

  // Mock conversations data
  const conversations = [
    {
      id: 1,
      name: 'John Doe',
      avatar: 'JD',
      lastMessage: 'Hey, is the room still available?',
      lastTime: '2:30 PM',
      unreadCount: 2,
      avatarColor: 'from-pink-400 to-pink-600'
    },
    {
      id: 2,
      name: 'Sarah Miller',
      avatar: 'SM',
      lastMessage: 'Thanks for the information!',
      lastTime: 'Yesterday',
      unreadCount: 0,
      avatarColor: 'from-teal-400 to-teal-600'
    },
    {
      id: 3,
      name: 'Robert Brown',
      avatar: 'RB',
      lastMessage: 'Can we schedule a viewing?',
      lastTime: 'Monday',
      unreadCount: 1,
      avatarColor: 'from-purple-400 to-purple-600'
    },
    {
      id: 4,
      name: 'Emily Chen',
      avatar: 'EC',
      lastMessage: "I'm interested in your listing",
      lastTime: 'Tuesday',
      unreadCount: 0,
      avatarColor: 'from-orange-400 to-orange-600'
    }
  ];

  // Initial mock messages data
  const initialMessagesData = {
    1: [
      {
        id: 1,
        sender: 'John Doe',
        avatar: 'JD',
        content: 'Hey! I saw your listing for the room in District 1. Is it still available?',
        time: '2:25 PM',
        isMine: false,
        avatarColor: 'from-pink-400 to-pink-600'
      },
      {
        id: 2,
        sender: 'Me',
        avatar: 'ME',
        content: 'Yes, it\'s still available! Would you like to know more details?',
        time: '2:27 PM',
        isMine: true,
        avatarColor: 'from-teal-400 to-teal-600'
      },
      {
        id: 3,
        sender: 'John Doe',
        avatar: 'JD',
        content: 'That would be great! Can you send some photos?',
        time: '2:30 PM',
        isMine: false,
        avatarColor: 'from-pink-400 to-pink-600'
      }
    ],
    2: [
      {
        id: 1,
        sender: 'Sarah Miller',
        avatar: 'SM',
        content: 'Hi! I have some questions about the roommate preferences.',
        time: 'Yesterday 3:15 PM',
        isMine: false,
        avatarColor: 'from-teal-400 to-teal-600'
      },
      {
        id: 2,
        sender: 'Me',
        avatar: 'ME',
        content: 'Sure! What would you like to know?',
        time: 'Yesterday 3:20 PM',
        isMine: true,
        avatarColor: 'from-teal-400 to-teal-600'
      },
      {
        id: 3,
        sender: 'Sarah Miller',
        avatar: 'SM',
        content: 'Thanks for the information!',
        time: 'Yesterday 3:25 PM',
        isMine: false,
        avatarColor: 'from-teal-400 to-teal-600'
      }
    ]
  };

  // Initialize messages state if empty
  const currentMessages = messages[selectedConversation] || initialMessagesData[selectedConversation] || [];
  const currentConversation = conversations.find(c => c.id === selectedConversation);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const newMessage = {
        id: Date.now(),
        sender: 'Me',
        avatar: 'ME',
        content: messageInput,
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        isMine: true,
        avatarColor: 'from-teal-400 to-teal-600'
      };

      setMessages(prev => ({
        ...prev,
        [selectedConversation]: [...(prev[selectedConversation] || currentMessages), newMessage]
      }));
      
      setMessageInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadFile(file);
    }
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (uploadFile) {
      // Create a message with file attachment
      const newMessage = {
        id: Date.now(),
        sender: 'Me',
        avatar: 'ME',
        content: `📎 ${uploadFile.name}${uploadCaption ? `\n${uploadCaption}` : ''}`,
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        isMine: true,
        avatarColor: 'from-teal-400 to-teal-600',
        hasAttachment: true
      };

      setMessages(prev => ({
        ...prev,
        [selectedConversation]: [...(prev[selectedConversation] || currentMessages), newMessage]
      }));

      setShowUploadModal(false);
      setUploadFile(null);
      setUploadCaption('');
    }
  };

  return (
    <div className="flex h-full bg-gradient-to-br from-pink-50 via-white to-teal-50">
      {/* Conversation List Sidebar */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Messages</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Conversation Items */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation.id)}
              className={`p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50 ${
                selectedConversation === conversation.id ? 'bg-teal-50 border-l-4 border-l-teal-500' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${conversation.avatarColor} flex items-center justify-center text-white font-semibold flex-shrink-0`}>
                    {conversation.avatar}
                  </div>
                  {conversation.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">{conversation.name}</h3>
                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{conversation.lastTime}</span>
                  </div>
                  <p className={`text-sm truncate ${conversation.unreadCount > 0 ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                    {conversation.lastMessage}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Conversation Detail */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${currentConversation?.avatarColor} flex items-center justify-center text-white font-semibold`}>
              {currentConversation?.avatar}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{currentConversation?.name}</h3>
              <p className="text-sm text-gray-500">Active now</p>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-pink-50/30 to-teal-50/30">
          {currentMessages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 mb-4 ${message.isMine ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${message.avatarColor} flex items-center justify-center text-white font-semibold flex-shrink-0`}>
                {message.avatar}
              </div>
              
              {/* Message Content */}
              <div className={`flex flex-col ${message.isMine ? 'items-end' : 'items-start'} max-w-md`}>
                {/* Sender name (only for received messages) */}
                {!message.isMine && (
                  <p className="text-xs font-semibold text-gray-700 mb-1 px-2">{message.sender}</p>
                )}
                
                {/* Message bubble */}
                <div className={`px-4 py-2 rounded-2xl ${
                  message.isMine 
                    ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white' 
                    : 'bg-white border border-gray-200 text-gray-900'
                }`}>
                  <p className="whitespace-pre-line">{message.content}</p>
                </div>
                
                {/* Time */}
                <p className="text-xs text-gray-500 mt-1 px-2">{message.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-end gap-2">
            {/* Upload Button */}
            <button
              onClick={() => setShowUploadModal(true)}
              className="p-3 text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-full transition"
              title="Upload media (images, videos, PDFs, docs, CSV)"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
            
            {/* Message Input */}
            <textarea
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message... (Press Enter to send)"
              rows="1"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
            />
            
            {/* Send Button */}
            <button
              onClick={handleSendMessage}
              disabled={!messageInput.trim()}
              className="p-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-full hover:from-teal-600 hover:to-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              title="Send message"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 px-4">
            💡 Tip: Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>

      {/* Upload Media Modal */}
      {showUploadModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => {
            setShowUploadModal(false);
            setUploadFile(null);
            setUploadCaption('');
          }}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Upload Media</h3>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadFile(null);
                  setUploadCaption('');
                }}
                className="text-gray-400 hover:text-gray-600 transition"
                type="button"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select File *
                </label>
                <input
                  type="file"
                  onChange={handleFileSelect}
                  accept="image/*,video/*,.pdf,.doc,.docx,.csv"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                />
                {uploadFile && (
                  <p className="text-sm text-teal-600 mt-2 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Selected: {uploadFile.name}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Supported: Images, Videos, PDF, Word, CSV
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Caption (optional)
                </label>
                <textarea
                  value={uploadCaption}
                  onChange={(e) => setUploadCaption(e.target.value)}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                  placeholder="Add a caption to your file..."
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold py-3 rounded-lg hover:from-teal-600 hover:to-teal-700 transition"
              >
                Send File
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MessagePage;