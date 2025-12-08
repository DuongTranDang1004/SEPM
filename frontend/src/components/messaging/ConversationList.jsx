// FE/src/components/messaging/ConversationList.jsx

import React from 'react';
import { Search } from 'lucide-react';

function ConversationList({
  conversations,
  selectedConversation,
  onSelectConversation,
  searchQuery,
  onSearchChange,
  currentUserId, // ✅ NEW PROP
  compact = false
}) {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      {/* Search Bar */}
      <div className={`${compact ? 'p-3' : 'p-4'} border-b border-gray-200 dark:border-gray-700 flex-shrink-0`}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-3">💬</div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">No conversations yet</p>
          </div>
        ) : (
          conversations.map((conversation) => {
            const convId = conversation.id || conversation.conversationId;
            const isSelected =
              selectedConversation?.id === convId ||
              selectedConversation?.conversationId === convId;

            const hasUnread = (conversation.unreadCount || 0) > 0;
            const isThreeWay = conversation.conversationType === 'THREE_WAY';

            return (
              <button
                key={convId}
                onClick={() => onSelectConversation(conversation)}
                className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition border-b border-gray-100 dark:border-gray-700 ${
                  isSelected
                    ? 'bg-teal-50 dark:bg-teal-900/30 border-l-4 border-l-teal-500 dark:border-l-teal-400'
                    : ''
                }`}
              >
                {/* Avatar with Unread Indicator */}
                <div className="relative flex-shrink-0">
                  {isThreeWay ? (
                    <div className={`${compact ? 'w-10 h-10' : 'w-12 h-12'} rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center`}>
                      <span className="text-white text-xl">👥</span>
                    </div>
                  ) : (
                    <img
                      src={
                        conversation.otherParticipantAvatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          conversation.otherParticipantName
                        )}&background=14b8a6&color=fff`
                      }
                      alt={conversation.otherParticipantName}
                      className={`${compact ? 'w-10 h-10' : 'w-12 h-12'} rounded-full object-cover`}
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          conversation.otherParticipantName
                        )}&background=14b8a6&color=fff`;
                      }}
                    />
                  )}

                  {/* Small red dot for unread */}
                  {hasUnread && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-800" />
                  )}
                </div>

                {/* Conversation Info */}
                <div className="flex-1 min-w-0 text-left">
                  {/* Name with Group Badge */}
                  <div className="flex items-center gap-2 mb-1">
                    <p
                      className={`${compact ? 'text-sm' : 'text-base'} truncate flex-1 ${
                        hasUnread
                          ? 'font-bold text-gray-900 dark:text-white'
                          : 'font-medium text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {isThreeWay 
                        ? (conversation.allParticipants 
                            ? conversation.allParticipants
                                .filter(p => p.userId !== currentUserId) // ✅ USES PROP
                                .map(p => p.name)
                                .join(', ')
                            : 'Group Chat')
                        : conversation.otherParticipantName}
                    </p>
                    
                    {/* Group Badge */}
                    {isThreeWay && (
                      <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 text-xs rounded-full font-medium flex-shrink-0">
                        Group
                      </span>
                    )}
                  </div>

                  {/* Last Message */}
                  <p
                    className={`text-xs truncate ${
                      hasUnread
                        ? 'font-semibold text-gray-900 dark:text-white'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {conversation.lastMessage || 'No messages yet'}
                  </p>

                  {/* Timestamp */}
                  {conversation.lastMessageAt && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {new Date(conversation.lastMessageAt).toLocaleString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

export default ConversationList;