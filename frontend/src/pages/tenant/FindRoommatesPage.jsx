import React, { useState } from 'react';
import './FindRoommatesPage.css'; // CSS

/**
 * FindRoommatesPage components allows user to explore, 
 * 'Reject' or 'Bookmark' profiles
 */
function FindRoommatesPage() {
  // Uses local data for test purposes, final version will call from server
  const [currentProfile, setCurrentProfile] = useState({
    id: 1,
    name: "Jane Doe",
    age: "nn",
    gender: "nn",
    stayLength: "nn",
    movingDate: "DD/MM/YYYY",
    smoker: "No",
    cook: "Yes",
    description: "Lorem ipsum dolor sit amet consectetur. Aliquet accumsan sed vestibulum vestibulum cras tempus.",
    avatar: "https://via.placeholder.com/150/FF69B4/FFFFFF?text=Jane" // Example avatar
  });

  // Function to call next profile (Could use API for final version)
  const handleNextProfile = (action) => {
    console.log(`Profile ${currentProfile.name} was ${action}. Moving to next profile...`);
    // For testinf purposes, renewal of current profile will be used.
    setCurrentProfile(null); // Or ipdate to next profile
    alert(`현재 프로필 "${currentProfile.name}" ${action} 처리 완료. 다음 프로필을 불러옵니다.`);
    
    // Renewal of current profile for mock 'next' profile
    setTimeout(() => {
        setCurrentProfile({
            id: 2,
            name: "John Smith",
            age: "xx",
            gender: "yy",
            stayLength: "zz",
            movingDate: "DD/MM/YYYY",
            smoker: "Yes",
            cook: "No",
            description: "Another description for John Smith's profile, demonstrating content change.",
            avatar: "https://via.placeholder.com/150/4dc2f5/FFFFFF?text=John"
        });
    }, 1000);
  };

  return (
    <div className="main-layout-flex-container">
      
      {/* 1.(Sidebar Placeholder) */}
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

      {/* 2. Main content - profile */}
      <main className="content-area-vertical-flex">
        {currentProfile ? (
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-info">
                <h3>{currentProfile.name}</h3>
                <p>Age : {currentProfile.age}</p>
                <p>Gender : {currentProfile.gender}</p>
                <p>Stay Length : {currentProfile.stayLength}</p>
                <p>Moving date : {currentProfile.movingDate}</p>
                <p>Smoker : {currentProfile.smoker}</p>
                <p>Cook : {currentProfile.cook}</p>
              </div>
              <div className="profile-avatar">
                <img src={currentProfile.avatar} alt={`${currentProfile.name}'s avatar`} />
              </div>
            </div>
            <div className="profile-description">
              <p>{currentProfile.description}</p>
            </div>
            
            <div className="profile-actions">
              <button className="action-button reject-button" onClick={() => handleNextProfile('rejected')}>Reject</button>
              <button className="action-button bookmark-button" onClick={() => handleNextProfile('bookmarked')}>Bookmark</button>
            </div>
          </div>
        ) : (
          <p>No more roommates to show. Check back later!</p>
        )}
      </main>
    </div>
  );
}

export default FindRoommatesPage;