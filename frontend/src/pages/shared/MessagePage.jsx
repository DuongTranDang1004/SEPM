import React, { useState } from 'react';

function MessagePage() {
  const [selectedConversation, setSelectedConversation] = useState(1);
  const [messageInput, setMessageInput] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadCaption, setUploadCaption] = useState('');

  // Mock conversations data
  const conversations = [
    {
      id: 1,
      name: 'John Doe',
      avatar: 'JD',
      lastMessage: 'Hey, is the room still available?',
      lastTime: '2:30 PM',
      avatarColor: 'from-pink-400 to-pink-600'
    },
    {
      id: 2,
      name: 'Sarah Miller',
      avatar: 'SM',
      lastMessage: 'Thanks for the information!',
      lastTime: 'Yesterday',
      avatarColor: 'from-teal-400 to-teal-600'
    },
    {
      id: 3,
      name: 'Robert Brown',
      avatar: 'RB',
      lastMessage: 'Can we schedule a viewing?',
      lastTime: 'Monday',
      avatarColor: 'from-purple-400 to-purple-600'
    },
    {
      id: 4,
      name: 'Emily Chen',
      avatar: 'EC',
      lastMessage: "I'm interested in your listing",
      lastTime: 'Tuesday',
      avatarColor: 'from-orange-400 to-orange-600'
    }
  ];

  // Mock messages data
  const messagesData = {
    1: [
      {
        id: 1,
        sender: 'John Doe',
        avatar: 'JD',
        content: 'Hey! I saw your listing for the room in District 1. Is it still available?',
        time: '2:25 PM',
        isSent: false,
        avatarColor: 'from-pink-400 to-pink-600'
      },
      {
        id: 2,
        sender: 'Me',
        avatar: 'ME',
        content: 'Yes, it\'s still available! Would you like to know more details?',
        time: '2:27 PM',
        isSent: true,
        avatarColor: 'from-teal-400 to-teal-600'
      },
      {
        id: 3,
        sender: 'John Doe',
        avatar: 'JD',
        content: 'That would be great! Can you send some photos?',
        time: '2:30 PM',
        isSent: false,
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
        isSent: false,
        avatarColor: 'from-teal-400 to-teal-600'
      },
      {
        id: 2,
        sender: 'Me',
        avatar: 'ME',
        content: 'Sure! What would you like to know?',
        time: 'Yesterday 3:20 PM',
        isSent: true,
        avatarColor: 'from-teal-400 to-teal-600'
      },
      {
        id: 3,
        sender: 'Sarah Miller',
        avatar: 'SM',
        content: 'Thanks for the information!',
        time: 'Yesterday 3:25 PM',
        isSent: false,
        avatarColor: 'from-teal-400 to-teal-600'
      }
    ]
  };

  const currentMessages = messagesData[selectedConversation] || [];
  const currentConversation = conversations.find(c => c.id === selectedConversation);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      console.log('Sending message:', messageInput);
      alert(`Message sent: ${messageInput}`);
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
      console.log('File selected:', file.name);
    }
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (uploadFile) {
      console.log('Uploading file:', uploadFile.name, 'Caption:', uploadCaption);
      alert(`File uploaded: ${uploadFile.name}`);
      setShowUploadModal(false);
      setUploadFile(null);
      setUploadCaption('');
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-pink-50 via-white to-teal-50">
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
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${conversation.avatarColor} flex items-center justify-center text-white font-semibold flex-shrink-0`}>
                  {conversation.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">{conversation.name}</h3>
                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{conversation.lastTime}</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
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
              className={`flex gap-3 mb-4 ${message.isSent ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${message.avatarColor} flex items-center justify-center text-white font-semibold flex-shrink-0`}>
                {message.avatar}
              </div>
              <div className={`max-w-md ${message.isSent ? 'items-end' : 'items-start'}`}>
                <div className={`px-4 py-2 rounded-2xl ${
                  message.isSent 
                    ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white' 
                    : 'bg-white border border-gray-200 text-gray-900'
                }`}>
                  <p>{message.content}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1 px-2">{message.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-end gap-2">
            <button
              onClick={() => setShowUploadModal(true)}
              className="p-3 text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-full transition"
              title="Upload media"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
            <textarea
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              rows="1"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
            />
            <button
              onClick={handleSendMessage}
              disabled={!messageInput.trim()}
              className="p-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-full hover:from-teal-600 hover:to-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Upload Media Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Upload Media</h3>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadFile(null);
                  setUploadCaption('');
                }}
                className="text-gray-400 hover:text-gray-600"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                {uploadFile && (
                  <p className="text-sm text-gray-600 mt-2">Selected: {uploadFile.name}</p>
                )}
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
                  placeholder="Add a caption..."
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold py-3 rounded-lg hover:from-teal-600 hover:to-teal-700 transition"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MessagePage;