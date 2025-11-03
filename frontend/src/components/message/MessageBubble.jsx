import React from 'react';
import Avatar from '../common/Avatar';
import './MessageBubble.css';

function MessageBubble({ 
  message, 
  isUserMessage, 
  timestamp = null, 
  avatarUrl = null 
}) {
  const rootClass = `chat-bubble-root ${
    isUserMessage ? "user-message" : "partner-message"
  }`;
  
  const children = [];
  
  if (!isUserMessage && avatarUrl) {
    children.push(
      <Avatar key="avatar" imageUrl={avatarUrl} size="small" />
    );
  }
  
  children.push(
    <div key="bubble" className="bubble-content">
      <p className="message-text">{message}</p>
      {timestamp && (
        <span className="message-timestamp">{timestamp}</span>
      )}
    </div>
  );
  
  return <div className={rootClass}>{children}</div>;
}

export default MessageBubble;