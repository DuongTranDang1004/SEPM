import React from 'react';

/**
 * Reusable message bubble component
 */
function MessageBubble({ 
  message, 
  isMyMessage, 
  senderName,
  senderAvatar,
  compact = false 
}) {
  return (
    <div className={`flex gap-3 ${isMyMessage ? 'flex-row-reverse' : ''} ${compact ? 'mb-3' : 'mb-4'}`}>
      {/* Avatar */}
      <div className={`${compact ? 'w-8 h-8' : 'w-10 h-10'} rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-semibold flex-shrink-0 ${compact ? 'text-xs' : 'text-sm'}`}>
        {senderAvatar || (isMyMessage ? 'ME' : senderName?.charAt(0) || '?')}
      </div>

      {/* Message Content */}
      <div className={`flex flex-col ${isMyMessage ? 'items-end' : 'items-start'} ${compact ? 'max-w-[70%]' : 'max-w-md'}`}>
        {/* Sender name (only for received messages) */}
        {!isMyMessage && !compact && (
          <p className="text-xs font-semibold text-gray-700 mb-1 px-2">{senderName}</p>
        )}

        {/* Message bubble */}
        <div className={`px-4 py-2 rounded-2xl ${
          isMyMessage 
            ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white' 
            : 'bg-white border border-gray-200 text-gray-900'
        }`}>
          <p className={`whitespace-pre-line ${compact ? 'text-sm' : 'text-sm'}`}>
            {message.content}
          </p>

          {/* ✅ Media Support - Show images/videos if present */}
          {message.mediaUrls && message.mediaUrls.length > 0 && (
            <div className="mt-2 space-y-2">
              {message.mediaUrls.map((url, index) => {
                // Check if it's an image or video
                const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
                const isVideo = /\.(mp4|webm|ogg)$/i.test(url);

                if (isImage) {
                  return (
                    <img
                      key={index}
                      src={url}
                      alt={`Media ${index + 1}`}
                      className="max-w-full rounded-lg cursor-pointer hover:opacity-90 transition"
                      onClick={() => window.open(url, '_blank')}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  );
                } else if (isVideo) {
                  return (
                    <video
                      key={index}
                      src={url}
                      controls
                      className="max-w-full rounded-lg"
                    />
                  );
                } else {
                  // Other file types - show as link
                  return (
                    <a
                      key={index}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                        isMyMessage
                          ? 'bg-white/20 hover:bg-white/30'
                          : 'bg-gray-100 hover:bg-gray-200'
                      } transition`}
                    >
                      <span className="text-sm">📎 {url.split('/').pop()}</span>
                    </a>
                  );
                }
              })}
            </div>
          )}
        </div>

        {/* ✅ Timestamp - Use createdAt instead of sentAt */}
        <p className="text-xs text-gray-500 mt-1 px-2">
          {new Date(message.createdAt).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </p>
      </div>
    </div>
  );
}

export default MessageBubble;