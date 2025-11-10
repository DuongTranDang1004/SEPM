import React, { useState } from 'react';
// import './MessagePage.css'; 

/**
 * MessagePage component displays chat interface
 */
function MessagePage() {
  // Dummy data for chat list
  const [messages, setMessages] = useState([
    // isMine: false -> Coral bubble, Avatar/name display, left align
    // isMine: true -> Teal bubble, no Avatar/name display, Right align
    { id: 1, sender: 'Tenant 2', content: 'Lorem ipsum dolor sit amet consectetur. Aliquet accumsan sed vestibulum vestibulum cras tempus.', time: 'MM/DD HH:MM', isMine: false }, 
    { id: 2, sender: 'Tenant 1', content: 'Lorem ipsum dolor sit amet consectetur. Aliquet accumsan sed vestibulum vestibulum cras tempus.', time: 'MM/DD HH:MM', isMine: true }, 
    { id: 3, sender: 'Tenant 2', content: 'Lorem ipsum dolor sit amet consectetur. Aliquet accumsan sed vestibulum vestibulum cras tempus.', time: 'MM/DD HH:MM', isMine: false }, 
    { id: 4, sender: 'Tenant 1', content: 'Lorem ipsum dolor sit amet consectetur. Aliquet accumsan sed vestibulum vestibulum cras tempus.', time: 'MM/DD HH:MM', isMine: true },
  ]);
  
  const [inputMessage, setInputMessage] = useState('');

  // Message send handler placeholder
  const handleSend = (e) => {
    e.preventDefault();
    if (inputMessage.trim() === '') return;
    
    const newMessage = {
      id: messages.length + 1,
      sender: 'Tenant 1', 
      content: inputMessage,
      time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      isMine: true, // User message will always have isMine : true.
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');
  };

  // Message bubble render component
  const MessageBubble = ({ message }) => (
    // 'theirs' class will have name and avatar displayed
    <div className={`message-row ${message.isMine ? 'mine' : 'theirs'}`}>
      
      {/* 1. Their message (left align) */}
      {!message.isMine && (
        <>
          <div className="message-avatar">
            {/* Avatar placeholder */}
            <img src="https://via.placeholder.com/50/FF69B4/FFFFFF?text=T2" alt={message.sender} />
          </div>
          <div className="message-content">
            <div className="message-sender">{message.sender}</div>
            <div className="message-bubble">
              <p>{message.content}</p>
            </div>
          </div>
        </>
      )}

      {/* 2. My message (right align) */}
      {message.isMine && (
        <div className="message-content">
          <div className="message-bubble">
            <p>{message.content}</p>
          </div>
          <div className="message-time">{message.time}</div>
        </div>
      )}

      {/* imestamps can be handled with CSS flex-order or within message-content.*/}
      {/* My message time will be in message-content, their time will be in message-row.*/}
      {!message.isMine && <div className="message-time-theirs">{message.time}</div>}
      {message.isMine && <div className="message-time-mine">{message.time}</div>}
    </div>
  );

  return (
    <div className="main-layout-flex-container">
      {/* 1. Sidebar  */}
      <aside className="sidebar-placeholder">
        {/* ... Sidebar  ... */}
        <h2 className="logo-sidebar">Broomate</h2>
        <nav className="sidebar-nav">
          <ul>
            <li><a href="#home">Broomates</a></li>
            {/* ... Others ... */}
            <li><a href="#manage-chats">Manage Chats</a></li>
          </ul>
        </nav>
        <div className="sign-out-placeholder">Sign Out</div>
      </aside>

      {/* 2. Main content */}
      <main className="content-area-chat-flex">
        <div className="messages-list">
          {messages.map(msg => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
        </div>
        
        {/* Message enter field */}
        <form className="message-input-area" onSubmit={handleSend}>
          <button type="button" className="upload-button">+</button>
          <input 
            type="text" 
            placeholder="Lorem ipsum dolor sit amet consectetur. Aliquet accumsan sed vestibulum vestibulum cras tempus." 
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
          />
          <button type="submit" className="send-button">Send</button>
        </form>
      </main>
    </div>
  );
}

export default MessagePage;