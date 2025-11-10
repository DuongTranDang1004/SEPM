import React from 'react';
import './TenantDashboard.css'; // Import Separate CSS if required

/**
 * TenantDashboard Component displays Broomate's primary dashboard
 * composed of Sidebar and main search area
 */
function TenantDashboard() {
  return (
    // 'main-layout' class is a flex container with a Sidebar and Content Area.
    <div className="main-layout">
      
      {/* 1. (Sidebar Placeholder) */}
      <aside className="sidebar-placeholder">
        <h2 className="logo-sidebar">Broomate</h2>
        <nav className="sidebar-nav">
          <ul>
            {/* Roomate menu */}
            <li><a href="#find-roommates">Find Roommates</a></li>
            <li><a href="#bookmarks-roommates">Bookmarks</a></li>
            <li><a href="#blocked">Blocked</a></li>
            <hr style={{ margin: '8px 0', border: 'none', borderTop: '1px solid #eee' }} />
            {/* Room menu */}
            <li><a href="#rooms">Rooms</a></li>
            <li><a href="#find-rooms">Find Rooms</a></li>
            <li><a href="#bookmarks-rooms">Bookmarks</a></li>
            <hr style={{ margin: '8px 0', border: 'none', borderTop: '1px solid #eee' }} />
            {/* Extras */}
            <li><a href="#chats">Chats</a></li>
            <li><a href="#manage-chats">Manage Chats</a></li>
          </ul>
        </nav>
        
        <div className="sign-out-placeholder">
          Sign Out
        </div>
      </aside>

      {/* 2. Main content area */}
      <main className="content-area-vertical-flex">
        {/* The above cab be handled by App.js, 
           but this part is left empty above content-area, or implements padding */}
        
        {/* Find roomate (Coral Color) */}
        <section className="search-card roommate-search-card">
          <h3>Looking for **Roommates**?</h3>
          <p>Lorem ipsum dolor sit amet consectetur. Aliquet accumsan sed vestibulum vestibulum cras tempus.</p>
          <button className="search-btn">Search 🔍</button>
        </section>

        {/* Find Rooms (Teal Color) */}
        <section className="search-card room-search-card">
          <h3>Looking for **Rooms**?</h3>
          <p>Lorem ipsum dolor sit amet consectetur. Aliquet accumsan sed vestibulum vestibulum cras tempus.</p>
          <button className="search-btn">Search 🔍</button>
        </section>
      </main>
    </div>
  );
}

export default TenantDashboard;