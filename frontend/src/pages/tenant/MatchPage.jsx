import React from 'react';
import './MatchPage.css';

/**
 * MatchPage Component is displayed when two tenants bookmark each other
 * Shows two profile cards and a dialogue box of 'it's a match'
 */
function MatchPage() {
  // Tenant datas
  const tenantA = {
    id: 1,
    name: "Jane Doe",
    description: "Lorem ipsum dolor sit amet consectetur. Aliquet accumsan sed vestibulum vestibulum cras tempus.",
    avatar: "https://via.placeholder.com/150/FF69B4/FFFFFF?text=Jane" // Placeholder
  };

  const tenantB = {
    id: 2,
    name: "John Smith",
    description: "Lorem ipsum dolor sit amet consectetur. Aliquet accumsan sed vestibulum vestibulum cras tempus.",
    avatar: "https://via.placeholder.com/150/4dc2f5/FFFFFF?text=John" // Placeholder
  };

  // Placeholder Component of user profile
  const ProfileMatchCard = ({ tenant }) => (
    <div className="profile-match-card">
      <h3 className="card-name">{tenant.name}</h3>
      <div className="card-content">
        <div className="card-description">
          <p>{tenant.description}</p>
        </div>
        <div className="card-avatar">
          <img src={tenant.avatar} alt={`${tenant.name}'s avatar`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="main-layout-flex-container">
      
      {/*Sidebar Placeholder
      <aside className="sidebar-placeholder">
        <h2 className="logo-sidebar">Broomate</h2>
        <nav className="sidebar-nav">
          <ul>
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
        <div className="sign-out-placeholder">
          Sign Out
        </div>
      </aside>
      */}

      {/* Match card*/}
      <main className="content-area-match-flex">
        <div className="match-cards-container">
          <ProfileMatchCard tenant={tenantA} />
          <ProfileMatchCard tenant={tenantB} />
          {/* "It's a match!" */}
          <div className="match-overlay">
            It's a match!
          </div>

        </div>

        {/* Buttons */}
        <div className="match-actions">
          <button className="action-button return-button">Return</button>
          <button className="action-button open-chat-button">Open Chat</button>
        </div>

      </main>
    </div>
  );
}

export default MatchPage;