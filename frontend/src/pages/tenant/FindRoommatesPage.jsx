import React, { useState, useEffect, useCallback } from 'react';
import { X, Bookmark, Loader, Heart } from 'lucide-react';
import './FindRoommatesPage.css';

// API Configuration (Authentication is assumed to be complete)
const API_BASE_URL = 'http://localhost:8080/api';
const MOCK_AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZW5hbnQtdGVzdCIsImlhdCI6MTY3ODg4NjQwMH0.B91pA0z_R5T2oE8QvA8K6pE9A1X9o7V8HqN1jT0"; 

// Initial profile data structure for loading state
const initialMockProfile = {
  tenantId: null,
  name: "Loading Profile...",
  age: '??',
  gender: '??',
  stayLength: '??',
  movingDate: 'DD/MM/YYYY',
  smoker: false, 
  cook: false,   
  budgetPerMonth: '??',
  preferredLocations: [],
  description: "Fetching the next roommate profile from the server.",
  avatarUrl: "https://placehold.co/128x128/A0AEC0/FFFFFF?text=Loading",
};

// =========================================================================
// API Simulation Functions
// =========================================================================

const fetchNextProfile = async (token) => {
  // Mock API response data, reflecting the provided JSON schema
  const mockApiData = {
    id: "tenant" + Math.floor(Math.random() * 1000), 
    name: ["Minjun Kim", "Seoyeon Lee", "Jihun Park", "Yujin Choi"][Math.floor(Math.random() * 4)],
    avatar: "https://i.imgur.com/kS5Yv0G.png", 
    description: "I prefer a clean and quiet roommate. I work from home often during the day. This is a longer bio to simulate real-world data and fill the description box effectively. This text is long enough to demonstrate scrolling functionality in the bio section.",
    budgetPerMonth: Math.floor(Math.random() * 400000 + 300000), 
    stayLength: Math.floor(Math.random() * 12 + 6), 
    moveInDate: "2025-12-01",
    preferredLocations: ["Gangnam-gu", "Songpa-gu", "Mapo-gu", "Jongno-gu"].slice(0, Math.floor(Math.random() * 3) + 1),
    isSmoker: Math.random() < 0.3, // Boolean 값
    isCook: Math.random() < 0.7,   // Boolean 값
  };

  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const isLastProfile = Math.random() < 0.1; 
    if (isLastProfile) { return null; }

    const profile = mockApiData;

    // Transform server response structure (JSON) to UI state
    return {
      tenantId: profile.id, 
      name: profile.name || 'Tenant Name',
      age: profile.age || 'N/A', 
      gender: profile.gender || 'N/A', 
      stayLength: `${profile.stayLength} months` || 'N/A',
      movingDate: profile.moveInDate || 'DD/MM/YYYY',
      smoker: profile.isSmoker, // Keep as Boolean
      cook: profile.isCook,     // Keep as Boolean
      budgetPerMonth: profile.budgetPerMonth.toLocaleString('ko-KR') + ' KRW',
      preferredLocations: profile.preferredLocations || [],
      description: profile.description || "Meet your next roommate!",
      avatarUrl: profile.avatar || "https://placehold.co/128x128/6366F1/FFFFFF?text=Tenant",
    };
    
  } catch (error) {
    console.error("Fetch Error (Mock):", error.message);
    return null; 
  }
};

const sendSwipeAction = async (token, targetId, action) => {
  if (!targetId) return false;

  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    const isMatch = action === 'LIKE' && Math.random() < 0.5;
    if (isMatch) { /* Match logic */ }
    return true;

  } catch (error) {
    console.error("Swipe API Error (Mock):", error.message);
    return false;
  }
};


// =========================================================================
// Helper Components
// =========================================================================

// UI Helper Component: Info Item 
const SimpleInfoItem = ({ label, value }) => (
    <p className="info-item">
        <span className="info-label">{label}:</span> <span className="info-value">{value}</span>
    </p>
);

// UI Helper Component: Match Modal
const MatchModal = ({ profile, onClose }) => {
  if (!profile) return null;

  return (
    <div className="match-modal-backdrop" onClick={onClose}>
      <div className="match-modal-content" onClick={e => e.stopPropagation()}>
        <Heart className="match-icon" />
        <h2 className="match-title">🎉 It's a Match!</h2>
        <p className="match-text">
          You matched with **{profile.name}**! Start a conversation now.
        </p>
        <img 
          src={profile.avatarUrl} 
          alt={profile.name} 
          className="match-avatar"
          onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/80x80/FF8598/000000?text=Avatar"; }}
        />
        <button
          onClick={onClose}
          className="match-button"
        >
          Start Chatting
        </button>
      </div>
    </div>
  );
};


// =========================================================================
// FindRoommatesPage Component 
// =========================================================================

const FindRoommatesPage = () => {
  const [currentProfile, setCurrentProfile] = useState(initialMockProfile);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState('Fetching roommate profiles...');
  const [isMatchModalVisible, setIsMatchModalVisible] = useState(false);
  const [matchData, setMatchData] = useState(null);

  const loadNextProfile = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    
    const profile = await fetchNextProfile(MOCK_AUTH_TOKEN);

    if (profile) {
      setCurrentProfile(profile);
      setMessage('Ready to swipe!');
    } else if (profile === null) {
      setMessage('No more roommates to swipe. 😭 Please check back later.');
      setCurrentProfile({ ...initialMockProfile, name: 'No Profiles', description: 'Try again later.' });
    } else {
        setIsError(true);
        setMessage('An error occurred while loading profiles.');
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadNextProfile();
  }, [loadNextProfile]);

  const handleSwipe = async (action) => {
    if (isLoading || !currentProfile.tenantId) return;
    
    const success = await sendSwipeAction(
      MOCK_AUTH_TOKEN, 
      currentProfile.tenantId, 
      action
    );
    
    const isMatch = action === 'LIKE' && Math.random() < 0.5;

    if (success) {
      if (isMatch) {
        setMatchData(currentProfile);
        setIsMatchModalVisible(true);
      }
      loadNextProfile();
    } else {
      setMessage("Action failed. Please check your network status and try again.");
    }
  };

  // Convert Boolean flags to display string
  const smokerDisplay = currentProfile.smoker ? 'Yes' : 'No';
  const cookDisplay = currentProfile.cook ? 'Yes' : 'No';


  // Main Component Render
  return (
    <>
      {/* =====================================================================
        JSX CONTENT 
        ===================================================================== 
      */}
      <div className="roommate-finder-main-container">
        <h1 className="main-title">Broomate Finder</h1>
        <p className={`status-message ${isError ? 'error' : ''}`}>{message}</p>

        {/* Profile Card Container */}
        <div className="profile-card-container">
          
          {/* Loading Overlay */}
          {isLoading && (
            <div className="loading-overlay">
              <Loader className="loading-icon" />
              <p className="loading-text">Loading next profile...</p>
            </div>
          )}

          {/* --- ROOMMATE PROFILE CARD (Vertical Flex) --- */}
          <div className="roommate-profile-card">
            
            {/* 1. Top Section (Header: Info + Photo) - Horizontal Flex */}
            <div className="card-header-section">
              
              {/* Left: Name and Basic Info */}
              <div className="profile-info-block">
                <h2 className="profile-name">{currentProfile.name}</h2>
                <div className="profile-details-grid">
                    <SimpleInfoItem label="Age" value={currentProfile.age} />
                    <SimpleInfoItem label="Gender" value={currentProfile.gender} />
                    <SimpleInfoItem label="Stay Length" value={currentProfile.stayLength} />
                    <SimpleInfoItem label="Moving Date" value={currentProfile.movingDate} />
                    <SimpleInfoItem label="Smoker" value={smokerDisplay} /> 
                    <SimpleInfoItem label="Cook" value={cookDisplay} /> 
                    <SimpleInfoItem label="Budget" value={currentProfile.budgetPerMonth} />
                </div>

                {/* Preferred Locations */}
                <div className="locations-block">
                  <p className="locations-title">Locations:</p>
                  <div className="locations-list">
                    {currentProfile.preferredLocations.length > 0 ? (
                        currentProfile.preferredLocations.map((loc, index) => (
                            <span key={index} className="location-tag">
                                {loc}
                            </span>
                        ))
                    ) : (
                        <span className="location-none">Anywhere in Seoul</span>
                    )}
                  </div>
                </div>

              </div>
              
              {/* Right: Profile Photo */}
              <div className="profile-photo-wrapper">
                <img 
                  src={currentProfile.avatarUrl} 
                  alt={currentProfile.name} 
                  className="profile-photo"
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/96x96/FF8598/000000?text=Avatar"; }}
                />
              </div>
              
            </div>

            {/* 2. Middle Section (Bio: Description) */}
            <div className="card-bio-section">
              <h3 className="bio-title">About Me</h3>
              <p className="bio-text">
                {currentProfile.description}
              </p>
            </div>
            
            {/* 3. Bottom Section (Actions: Buttons) - Ends justified */}
            <div className="card-action-section">
              
              {/* Reject Button (X) */}
              <button
                onClick={() => handleSwipe('REJECT')}
                disabled={isLoading || !currentProfile.tenantId}
                className="swipe-button reject-button"
              >
                <X className="button-icon" />
                <span className='hidden-mobile'>Reject</span>
              </button>
              
              {/* Like Button (Heart) */}
              <button
                onClick={() => handleSwipe('LIKE')}
                disabled={isLoading || !currentProfile.tenantId}
                className="swipe-button like-button"
              >
                <Heart className="button-icon" />
                <span className='hidden-mobile'>Like</span>
              </button>
              
            </div>
            
          </div>
        </div>
        
        <div className="footer-note">
          * Authentication is assumed complete. API calls are mocked.
        </div>
        
        {isMatchModalVisible && <MatchModal 
            profile={matchData} 
            onClose={() => setIsMatchModalVisible(false)} 
        />}

      </div>
    </>
  );
};

export default FindRoommatesPage;