import React, { useState } from 'react';

function MessengerPopup({ isOpen, onClose }) {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);

  // Mock conversations data
  const conversations = [
    {
      id: 1,
      name: 'John Doe',
      avatar: 'JD',
      lastMessage: 'Hey, is the room still available?',
      lastTime: '2:30 PM',
      avatarColor: 'from-pink-400 to-pink-600',
      unread: 2
    },
    {
      id: 2,
      name: 'Sarah Miller',
      avatar: 'SM',
      lastMessage: 'Thanks for the information!',
      lastTime: 'Yesterday',
      avatarColor: 'from-teal-400 to-teal-600',
      unread: 0
    },
    {
      id: 3,
      name: 'Robert Brown',
      avatar: 'RB',
      lastMessage: 'Can we schedule a viewing?',
      lastTime: 'Monday',
      avatarColor: 'from-purple-400 to-purple-600',
      unread: 1
    }
  ];

  // Mock messages
  const messagesData = {
    1: [
      {
        id: 1,
        sender: 'John Doe',
        content: 'Hey! Is the room still available?',
        time: '2:25 PM',
        isSent: false
      },
      {
        id: 2,
        sender: 'Me',
        content: 'Yes, it is! Would you like to know more?',
        time: '2:27 PM',
        isSent: true
      },
      {
        id: 3,
        sender: 'John Doe',
        content: 'That would be great! Can you send photos?',
        time: '2:30 PM',
        isSent: false
      }
    ]
  };

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
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-4 py-3 rounded-t-2xl flex items-center justify-between">
          <h3 className="font-semibold text-lg">Messages</h3>
          <div className="flex items-center gap-2">
            <button 
              className="hover:bg-white/20 p-1 rounded-full transition"
              title="New message"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <button 
              onClick={onClose}
              className="hover:bg-white/20 p-1 rounded-full transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        {!selectedConversation ? (
          // Conversation List View
          <div className="flex-1 overflow-y-auto">
            {/* Search */}
            <div className="p-3 border-b">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search messages..."
                  className="w-full pl-9 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Conversations */}
            <div className="divide-y">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv)}
                  className="p-3 hover:bg-gray-50 cursor-pointer transition flex items-center gap-3"
                >
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${conv.avatarColor} flex items-center justify-center text-white font-semibold`}>
                      {conv.avatar}
                    </div>
                    {conv.unread > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {conv.unread}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-semibold text-sm text-gray-900 truncate">{conv.name}</p>
                      <span className="text-xs text-gray-500">{conv.lastTime}</span>
                    </div>
                    <p className={`text-sm truncate ${conv.unread > 0 ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                      {conv.lastMessage}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Chat View
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="px-4 py-3 border-b flex items-center gap-3">
              <button 
                onClick={() => setSelectedConversation(null)}
                className="hover:bg-gray-100 p-1 rounded-full transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${selectedConversation.avatarColor} flex items-center justify-center text-white font-semibold`}>
                {selectedConversation.avatar}
              </div>
              <div>
                <p className="font-semibold text-sm">{selectedConversation.name}</p>
                <p className="text-xs text-gray-500">Active now</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {(messagesData[selectedConversation.id] || []).map((message) => (
                <div key={message.id} className={`flex ${message.isSent ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] ${message.isSent ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-900'} px-4 py-2 rounded-2xl`}>
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${message.isSent ? 'text-teal-100' : 'text-gray-500'}`}>
                      {message.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-3 border-t">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="p-2 hover:bg-gray-100 rounded-full transition"
                  title="Attach file"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </button>
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  className="p-2 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Upload File</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select File</label>
                <input
                  type="file"
                  onChange={(e) => setUploadFile(e.target.files[0])}
                  accept="image/*,video/*,.pdf,.doc,.docx"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                />
                {uploadFile && (
                  <p className="text-sm text-gray-600 mt-2">Selected: {uploadFile.name}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  if (uploadFile) {
                    alert(`File uploaded: ${uploadFile.name}`);
                    setShowUploadModal(false);
                    setUploadFile(null);
                  }
                }}
                className="w-full bg-teal-500 text-white font-semibold py-2 rounded-lg hover:bg-teal-600 transition"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default MessengerPopup;