import React, { useState } from 'react';
import { Send, Paperclip, Smile, Loader } from 'lucide-react';

/**
 * Reusable message input component
 */
function MessageInput({ 
  onSendMessage, 
  onAttachFile,
  isSending = false,
  compact = false,
  placeholder = "Type a message..."
}) {
  const [inputMessage, setInputMessage] = useState('');

  const handleSend = () => {
    if (inputMessage.trim() && !isSending) {
      onSendMessage(inputMessage);
      setInputMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`bg-white border-t border-gray-200 ${compact ? 'p-3' : 'p-4'}`}>
      <div className="flex items-end gap-2">
        {/* Attach Button */}
        <button
          onClick={onAttachFile}
          className="p-2 text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-full transition"
          title="Attach file"
        >
          <Paperclip className={compact ? 'w-4 h-4' : 'w-5 h-5'} />
        </button>

        {/* Input Field */}
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          rows="1"
          disabled={isSending}
          className={`flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none ${
            compact ? 'text-sm' : ''
          }`}
        />

        {/* Emoji Button (optional) */}
        {!compact && (
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition">
            <Smile className="w-5 h-5" />
          </button>
        )}

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={!inputMessage.trim() || isSending}
          className={`${compact ? 'p-2' : 'p-3'} bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-full hover:from-teal-600 hover:to-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isSending ? (
            <Loader className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} animate-spin`} />
          ) : (
            <Send className={compact ? 'w-4 h-4' : 'w-5 h-5'} />
          )}
        </button>
      </div>

      {/* Helper Text */}
      {!compact && (
        <p className="text-xs text-gray-500 mt-2 px-4">
          💡 Tip: Press Enter to send, Shift+Enter for new line
        </p>
      )}
    </div>
  );
}

export default MessageInput;