import React from 'react';
import { Search, ChevronLeft } from 'lucide-react';

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
  compact = false,
  // New props for mobile responsiveness
  isMobileVisible = true, // Controls visibility on small screens
  onBackClick // Function to call when "Back" is clicked on mobile
}) {
  // ✅ Helper to get conversation ID (handles both 'id' and 'conversationId')
  const getConversationId = (conv) => {
    return conv?.conversationId || conv?.id;
  };

  // ✅ Helper to check if conversation is selected
  const isSelected = (conv) => {
    const convId = getConversationId(conv);
    const selectedId = getConversationId(selectedConversation);
    return convId && selectedId && convId === selectedId;
  };
  
  // Mobile classes for sliding effect
  const mobileVisibilityClasses = isMobileVisible 
    ? 'translate-x-0' // Visible: takes full screen
    : '-translate-x-full'; // Hidden: slides off screen to the left
    
  // Base width for desktop view (lg:)
  const baseWidthClasses = compact ? 'w-full' : 'w-full lg:w-96'; 

  return (
    // Apply mobile and desktop layout classes
    <div className={`
        flex flex-col h-full bg-white 
        ${baseWidthClasses}
        ${!compact ? 'lg:flex-shrink-0' : ''} // prevent shrinking on desktop for MessagesPage
        
        /* Mobile Overlay Setup: only applied when not 'compact' (i.e., full page) */
        ${compact ? '' : 'absolute inset-y-0 left-0 z-20 transition-transform duration-300 lg:relative lg:translate-x-0'} 
        ${!compact ? mobileVisibilityClasses : ''} // Apply sliding only if not compact
        ${!compact && selectedConversation ? 'border-r-0' : 'border-r border-gray-200'}
    `}>
        
      {/* Header: Back Button (Mobile only) and Title */}
      <div className={`flex items-center ${compact ? 'p-3' : 'p-4'} border-b border-gray-200`}>
        {/* Back Button - Visible on mobile when a conversation is selected (list is hidden) */}
        {!compact && !isMobileVisible && (
          <button 
            onClick={onBackClick}
            className="p-2 mr-3 rounded-full hover:bg-gray-100 lg:hidden text-gray-700"
            aria-label="Back to conversations"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
        
        {/* Title - Visible when list is visible (or if it's the compact popup) */}
        {(!compact && isMobileVisible) || compact ? (
           <h2 className="text-xl font-bold text-gray-900 flex-1">Messages</h2>
        ) : null}
      </div>

      {/* Search */}
      <div className={`${compact ? 'p-3' : 'p-4'} ${!compact && isMobileVisible ? 'border-b border-gray-200' : ''}`}>
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
          conversations.map((conv) => {
            const convId = getConversationId(conv);
            
            // Skip conversations without valid IDs
            if (!convId) {
              console.warn('⚠️ Conversation missing ID:', conv);
              return null;
            }

            return (
              <button
                key={convId}
                onClick={() => onSelectConversation(conv)}
                className={`w-full ${compact ? 'p-3' : 'p-4'} flex items-center gap-3 hover:bg-gray-50 transition border-b border-gray-100 text-left ${
                  isSelected(conv)
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
            );
          })
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