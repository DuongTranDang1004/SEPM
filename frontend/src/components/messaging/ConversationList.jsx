import React from 'react';
import { Search } from 'lucide-react';

/**
 * Reusable conversation list component
 * Used in both MessagesPage and MessengerPopup
 */
function ConversationList({ 
  conversations, 
  selectedConversation, 
  onSelectConversation,
  searchQuery,
  onSearchChange,
  compact = false
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className={`${compact ? 'p-3' : 'p-4'} border-b border-gray-200`}>
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 ${compact ? 'w-4 h-4' : 'w-5 h-5'}`} />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className={`w-full ${compact ? 'pl-9 pr-4 py-2 text-sm' : 'pl-10 pr-4 py-2'} bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500`}
          />
        </div>
      </div>

      {/* Conversation Items */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">No conversations yet</p>
          </div>
        ) : (
          conversations.map((conv) => (
            <button
              key={conv.conversationId}
              onClick={() => onSelectConversation(conv)}
              className={`w-full ${compact ? 'p-3' : 'p-4'} flex items-center gap-3 hover:bg-gray-50 transition border-b border-gray-100 text-left ${
                selectedConversation?.conversationId === conv.conversationId
                  ? 'bg-teal-50 border-l-4 border-l-teal-500'
                  : ''
              }`}
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <img
                  src={
                    conv.otherParticipantAvatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      conv.otherParticipantName
                    )}&background=14b8a6&color=fff`
                  }
                  alt={conv.otherParticipantName}
                  className={`${compact ? 'w-10 h-10' : 'w-12 h-12'} rounded-full object-cover`}
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      conv.otherParticipantName
                    )}&background=14b8a6&color=fff`;
                  }}
                />
                {conv.unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <p className={`font-semibold text-gray-900 truncate ${compact ? 'text-sm' : ''}`}>
                    {conv.otherParticipantName}
                  </p>
                  {/* ✅ Use lastMessageAt OR createdAt OR updatedAt */}
                  {(conv.lastMessageAt || conv.updatedAt || conv.createdAt) && (
                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                      {formatTimeAgo(conv.lastMessageAt || conv.updatedAt || conv.createdAt)}
                    </span>
                  )}
                </div>
                <p className={`text-sm truncate ${
                  conv.unreadCount > 0 ? 'font-semibold text-gray-900' : 'text-gray-600'
                }`}>
                  {conv.lastMessage || 'Start a conversation'}
                </p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

// Helper function for better timestamps
function formatTimeAgo(timestamp) {
  if (!timestamp) return '';
  
  const now = new Date();
  const date = new Date(timestamp);
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  
  // If today, show time
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  // If this week, show day name
  const daysDiff = Math.floor(seconds / 86400);
  if (daysDiff < 7) {
    return date.toLocaleDateString([], { weekday: 'short' });
  }
  
  // Otherwise show date
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export default ConversationList;