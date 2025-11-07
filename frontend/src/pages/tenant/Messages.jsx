import React, { useState, useRef, useEffect } from 'react';
// Importing reusable components (Might need to alter according to file status/route)
import InputField from '../../components/common/InputField'; 
import Button from '../../components/common/Button';     
import ChatBubble from '../../components/message/MessageBubble';
import Avatar from '../../components/common/Avatar'; // Need to make

import './Messages.css'; 
import { mockMessages } from '../../data/MockData'; // Temporary message Data

/**
 * MessageDetail Component
 * Displays 1 on 1 message with another member
 */
const Messages = ({ matchId }) => { // Recognize chat room with matchId as Props
    
    // 1. Manage chat status
    const [messages, setMessages] = useState(mockMessages);
    const [inputMessage, setInputMessage] = useState('');
    
    // 2. Ref to manage scroll state
    const messagesEndRef = useRef(null);

    // 3. Handler for message input
    const handleInputChange = (event) => {
        setInputMessage(event.target.value);
    };

    // 4. Handler for message send
    const handleSend = () => {
        if (inputMessage.trim() === '') return;

        // Create new message object
        const newMessage = {
            id: messages.length + 1,
            text: inputMessage,
            is_user_message: true, // sent by the logged in user
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            avatar_url: 'user_avatar.jpg' // placeholder url for avatar
        };

        setMessages([...messages, newMessage]);
        setInputMessage('');
        // Use Websocket or API to send message to server
    };
    
    // 5. Enter to send
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSend();
        }
    };
    
    // 6. AutoScroll on message addiaiton
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="message-detail-container">
            {/* A. Chat Header (info for other user in chat) */}
            <header className="chat-header">
                <div className="partner-info">
                    <Avatar image_url="partner_avatar.jpg" size="medium" alt_text="J" />
                    <h3>Roommate Jane Doe</h3>
                </div>
                <Button text="View Profile" variant="secondary" size="small" onClick={() => console.log('View profile')} />
            </header>

            {/* B. Message History Area */}
            <main className="message-history">
                {messages.map((msg) => (
                    <ChatBubble
                        key={msg.id}
                        message={msg.text}
                        is_user_message={msg.is_user_message}
                        timestamp={msg.timestamp}
                        avatar_url={msg.avatar_url}
                    />
                ))}
                <div ref={messagesEndRef} /> {/* Autoscroll */}
            </main>

            {/* C. Input Area (메시지 입력) */}
            <footer className="message-input-footer">
                <InputField
                    type="text"
                    value={inputMessage}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyPress}
                    placeholder="Type your message here..."
                    variant="chat-input"
                />
                <Button 
                    text="Send" 
                    variant="primary" 
                    icon_name="send" 
                    onClick={handleSend}
                    // Deactivate button when empty message
                    disabled={inputMessage.trim() === ''} 
                />
            </footer>
        </div>
    );
};

export default Messages;