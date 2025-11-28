// src/components/messaging/ChatWindow.jsx

import React, { useRef, useEffect } from 'react';
// ✅ Fix: Files now exist in the same directory, so relative imports should work.
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';  
import { ArrowLeft, MoreVertical, Loader } from 'lucide-react';

/**
 * Reusable chat window component
 * Displays messages and input for a conversation
 */
function ChatWindow({
  conversation,
  messages,
  currentUserId,
  onSendMessage,     // ✅ NOW: (content, file) => Promise
  // onAttachFile,   // ❌ REMOVE - No longer needed
  onBack,
  isSending = false,
  isLoading = false,
  compact = false
}) {
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">💬</div>
          <p className="text-gray-600">Select a conversation to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className={`bg-white border-b border-gray-200 ${compact ? 'p-3' : 'p-4'} flex items-center justify-between flex-shrink-0`}>
        <div className="flex items-center gap-3">
          {/* ✅ Back Button Logic Updated:
              - Render if 'onBack' is provided.
              - If not compact (full page), hide on desktop (lg:hidden) because list is visible side-by-side.
              - If compact (popup), always show.
          */}
          {onBack && (
            <button
              onClick={onBack}
              className={`hover:bg-gray-100 p-1 rounded-full transition ${!compact ? 'lg:hidden' : ''}`}
              aria-label="Back to conversations"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          {/* Avatar */}
          <img
            src={
              conversation.otherParticipantAvatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                conversation.otherParticipantName
              )}&background=14b8a6&color=fff`
            }
            alt={conversation.otherParticipantName}
            className={`${compact ? 'w-8 h-8' : 'w-10 h-10'} rounded-full object-cover`}
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                conversation.otherParticipantName
              )}&background=14b8a6&color=fff`;
            }}
          />

          {/* Info */}
          <div>
            <p className={`font-semibold text-gray-900 ${compact ? 'text-sm' : ''}`}>
              {conversation.otherParticipantName}
            </p>
            <p className="text-xs text-gray-500">Active now</p>
          </div>
        </div>

        {/* More Options */}
        <button className="p-2 hover:bg-gray-100 rounded-full transition">
          <MoreVertical className={`text-gray-600 ${compact ? 'w-4 h-4' : 'w-5 h-5'}`} />
        </button>
      </div>

      {/* Messages Area */}
      <div className={`flex-1 overflow-y-auto ${compact ? 'p-3' : 'p-6'} ${
        compact ? 'bg-gray-50' : 'bg-gradient-to-br from-pink-50/30 to-teal-50/30'
      }`}>
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader className="w-8 h-8 text-teal-600 animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8">
            <div className={`${compact ? 'text-4xl' : 'text-5xl'} mb-3`}>💬</div>
            <p className="text-gray-500 text-sm">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => {
              const isMyMessage = msg.senderId === currentUserId;
              
              return (
                <MessageBubble
                  key={msg.id || index}
                  message={msg}
                  isMyMessage={isMyMessage}
                  senderName={conversation.otherParticipantName}
                  compact={compact}
                />
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* ✅ Message Input - Now handles files internally */}
      <MessageInput
        onSendMessage={onSendMessage}  // ✅ Passes (content, file) signature
        isSending={isSending}
        compact={compact}
      />
    </div>
  );
}

export default ChatWindow;