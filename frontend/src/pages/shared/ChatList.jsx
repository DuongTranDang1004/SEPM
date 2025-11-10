import React, { useState } from 'react';
// import './ChatList.css'; // CSS 파일을 import 합니다.

/**
 * ChatListPage Component displays filter and list of user's chat list
 */
function ChatListPage() {
  // Dummy data for filter status
  const [filters, setFilters] = useState({
    recentChatSort: 'Ascending',
    nameSort: 'Ascending',
  });

  // Dummy data for chat list
  const chatRooms = [
    {
      id: 1,
      name: "Chat Name 1",
      avatars: ["https://via.placeholder.com/40/FF69B4?text=T1", "https://via.placeholder.com/40/4dc2f5?text=T2"],
      lastMessage: "Lorem ipsum dolor sit amet consectetur. Aliquet accumsan sed vestibulum vestibulum cras tempus.",
      unreadCount: 3, // Unread messages count
    },
    {
      id: 2,
      name: "Chat 2 (No Unread)",
      avatars: ["https://via.placeholder.com/40/FF69B4?text=T3"],
      lastMessage: "Lorem ipsum dolor sit amet consectetur. Aliquet accumsan sed vestibulum vestibulum cras tempus.",
      unreadCount: 0,
    },
    {
      id: 3,
      name: "Roomie Match",
      avatars: ["https://via.placeholder.com/40/4dc2f5?text=T4", "https://via.placeholder.com/40/FF69B4?text=T5"],
      lastMessage: "Lorem ipsum dolor sit amet consectetur. Aliquet accumsan sed vestibulum vestibulum cras tempus.",
      unreadCount: 1,
    },
  ];

  // Filter dropdown handler placeholder
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
    console.log(`Filter ${filterName} changed to ${value}`);
  };

  // Chat click handler (Does not contain routing logic)
  const goToChatRoom = (chatId) => {
    alert(`Chat ID ${chatId} 채팅방으로 이동합니다.`);
    // history.push(`/messages/${chatId}`); // To be used in actual routing
  };


  // Chatlist placeholder component
  const ChatListItem = ({ chat }) => (
    <div className="chat-list-item" onClick={() => goToChatRoom(chat.id)}>
      <div className="chat-list-avatars">
        {/* Avatar placeholder, maximum 3 avatars*/}
        {chat.avatars.slice(0, 3).map((src, index) => (
            <img 
                key={index} 
                src={src} 
                alt={`Avatar ${index + 1}`} 
                className="chat-avatar"
            />
        ))}
      </div>
      
      <div className="chat-list-details">
        <div className="chat-list-header">
          <span className="chat-name">{chat.name}</span>
          {/* Unread messages in red numbers */}
          {chat.unreadCount > 0 && (
            <span className="unread-count">{chat.unreadCount}</span>
          )}
        </div>
        <p className="last-message">{chat.lastMessage}</p>
      </div>
    </div>
  );


  return (
    <div className="main-layout-flex-container">
      
      {/* 1. Sidebar */}
      <aside className="sidebar-placeholder">
        {/* ... Sidebar ... */}
        <h2 className="logo-sidebar">Broomate</h2>
        <nav className="sidebar-nav">
          <ul>
            <li><a href="#home">Broomates</a></li>
            <li><a href="#find-roommates">Find Roommates</a></li>
            <li><a href="#bookmarks-roommates">Bookmarks</a></li>
            <li><a href="#blocked">Blocked</a></li>
            <hr style={{ margin: '8px 0', border: 'none', borderTop: '1px solid #eee' }} />
            <li><a href="#rooms">Rooms</a></li>
            <li><a href="#find-rooms">Find Rooms</a></li>
            <li><a href="#bookmarks-rooms">Bookmarks</a></li>
            <hr style={{ margin: '8px 0', border: 'none', borderTop: '1px solid #eee' }} />
            <li><a href="#chats">Chats</a></li>
            <li><a href="#manage-chats">Manage Chats</a></li>
          </ul>
        </nav>
        <div className="sign-out-placeholder">Sign Out</div>
      </aside>

      {/* 2. MAin content */}
      <main className="content-area-vertical-flex">
        
        {/* Chat List Filter Header */}
        <div className="filter-header chat-filter-header">
          {/* Recent Chat filter */}
          <div className="filter-dropdown">
            <label>Recent Chat</label>
            <select value={filters.recentChatSort} onChange={(e) => handleFilterChange('recentChatSort', e.target.value)}>
              <option value="Ascending">Ascending</option>
              <option value="Descending">Descending</option>
            </select>
          </div>
          {/* Name filter */}
          <div className="filter-dropdown">
            <label>Name</label>
            <select value={filters.nameSort} onChange={(e) => handleFilterChange('nameSort', e.target.value)}>
              <option value="Ascending">Ascending</option>
              <option value="Descending">Descending</option>
            </select>
          </div>
          
          <button className="sort-button">Sort</button>
        </div>
        
        {/* Chat Listings Area */}
        <div className="chat-listings">
          {chatRooms.map(chat => (
            <ChatListItem key={chat.id} chat={chat} />
          ))}
        </div>
      </main>
    </div>
  );
}

export default ChatListPage;