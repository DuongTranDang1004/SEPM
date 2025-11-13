import React, { useState, useEffect, useCallback } from 'react';
import { X, Bookmark, MapPin, DollarSign } from 'lucide-react';

// API Configuration (Authentication is assumed to be complete)
const API_BASE_URL = 'http://localhost:8080/api';
// Mock authentication token, assuming successful sign-in
const MOCK_AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZW5hbnQtdGVzdCIsImlhdCI6MTY3ODg4NjQwMH0.B91pA0z_R5T2oE8QvA8K6pE9A1X9o7V8HqN1jT0"; 

// Initial profile data structure for loading state
const initialMockProfile = {
  tenantId: null,
  name: "Loading Profile...",
  email: 'N/A',
  phone: 'N/A',
  age: '??',
  gender: '??',
  stayLength: '??',
  movingDate: 'DD/MM/YYYY',
  smoker: '??',
  cook: '??',
  budgetPerMonth: '??',
  preferredLocations: [],
  description: "Fetching the next roommate profile from the server.",
  avatarUrl: "https://placehold.co/128x128/A0AEC0/FFFFFF?text=Loading",
};

// =========================================================================
// API Simulation Functions
// =========================================================================

/**
 * Fetches the next profile for swiping. Transforms server JSON structure to UI state.
 * @param {string} token Authentication token
 * @returns {Promise<Object>} Next profile data
 */
const fetchNextProfile = async (token) => {
  // Mock API response data, reflecting the provided JSON schema
  const mockApiData = {
    id: "tenant" + Math.floor(Math.random() * 1000), // Unique ID
    email: "john@example.com",
    phone: "0901234567",
    name: ["Minjun Kim", "Seoyeon Lee", "Jihun Park", "Yujin Choi"][Math.floor(Math.random() * 4)],
    avatar: "https://placehold.co/128x128/4dc2f5/FFFFFF?text=Tenant",
    description: "I prefer a clean and quiet roommate. I work from home often during the day.",
    budgetPerMonth: Math.floor(Math.random() * 400000 + 300000), // 300K ~ 700K KRW
    stayLength: Math.floor(Math.random() * 12 + 6), // 6 ~ 18 months
    moveInDate: "2025-12-01",
    preferredLocations: ["Gangnam-gu", "Songpa-gu", "Mapo-gu", "Jongno-gu"].slice(0, Math.floor(Math.random() * 3) + 1),
    isSmoker: Math.random() < 0.3,
    isCook: Math.random() < 0.7,
  };

  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate case where no more profiles are available
    const isLastProfile = Math.random() < 0.1; 
    if (isLastProfile) {
         return null; 
    }

    const profile = mockApiData;

    // Transform server response structure (JSON) to UI state
    return {
      tenantId: profile.id, 
      name: profile.name || 'Tenant Name',
      email: profile.email || 'N/A',
      phone: profile.phone || 'N/A',
      age: profile.age || 'N/A', 
      gender: profile.gender || 'N/A', 
      stayLength: `${profile.stayLength} months` || 'N/A',
      movingDate: profile.moveInDate || 'DD/MM/YYYY',
      smoker: profile.isSmoker ? 'Yes' : 'No',
      cook: profile.isCook ? 'Yes' : 'No',
      // Format budget as Korean Won
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

/**
 * Sends a swipe action (LIKE or REJECT) to the server.
 * @param {string} token Authentication token
 * @param {string} targetId Target Tenant ID
 * @param {string} action 'LIKE' or 'REJECT'
 * @returns {Promise<boolean>} Success status
 */
const sendSwipeAction = async (token, targetId, action) => {
  if (!targetId) return false;

  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simulate match success/failure randomly (only on LIKE action)
    const isMatch = action === 'LIKE' && Math.random() < 0.5;

    if (isMatch) {
        // console.log("🎉 Match successful!"); 
    }
    
    // Simulate successful API call
    return true;

  } catch (error) {
    console.error("Swipe API Error (Mock):", error.message);
    return false;
  }
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

  // Function to load the next profile (memoized with useCallback)
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

  // Load the first profile on component mount
  useEffect(() => {
    loadNextProfile();
  }, [loadNextProfile]);

  // Swipe handler
  const handleSwipe = async (action) => {
    if (isLoading || !currentProfile.tenantId) return;

    // 1. Send swipe action to the server
    const success = await sendSwipeAction(
      MOCK_AUTH_TOKEN, 
      currentProfile.tenantId, 
      action
    );
    
    // Simulate match success (only on LIKE action)
    const isMatch = action === 'LIKE' && Math.random() < 0.5;

    // 2. If successful, load the next profile
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


  // UI Helper Component: Info Item
  const InfoItem = ({ icon, label, value }) => (
    <div className="flex items-center w-full border-b border-gray-200 py-1.5 px-1">
      {icon}
      <span className="font-semibold text-gray-500 ml-2 text-sm">{label}:</span>
      <span className="text-gray-700 ml-auto font-medium text-sm">{value}</span>
    </div>
  );
  
  // UI Helper Component: Match Modal
  const MatchModal = ({ profile, onClose }) => {
    if (!profile) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center transform transition-all scale-100 animate-pulse-once">
          <Bookmark className="w-12 h-12 text-indigo-600 mx-auto mb-4 fill-indigo-100" />
          <h2 className="text-3xl font-extrabold text-green-600 mb-2">🎉 It's a Match!</h2>
          <p className="text-gray-700 mb-4">
            You matched with {profile.name}! Start a conversation now.
          </p>
          <img 
            src={profile.avatarUrl} 
            alt={profile.name} 
            className="w-20 h-20 object-cover rounded-full shadow-lg mx-auto mb-6 ring-4 ring-green-300"
            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/128x128/6366F1/FFFFFF?text=Tenant"; }}
          />
          <button
            onClick={onClose}
            className="w-full p-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition duration-150 shadow-md"
          >
            Start Chatting
          </button>
        </div>
      </div>
    );
  };


  return (
    <div className="min-h-full bg-gray-50 flex flex-col items-center p-4 sm:p-8">
      <h1 className="text-4xl font-extrabold text-indigo-700 mb-6 tracking-tight">
        Broomate Finder
      </h1>
      <p className={`mb-8 text-lg ${isError ? 'text-red-500' : 'text-gray-600'}`}>{message}</p>

      {/* Profile Card Container */}
      <div className="relative w-full max-w-lg">
        {isLoading && (
          <div className="absolute inset-0 bg-white/70 z-10 flex items-center justify-center rounded-2xl shadow-2xl">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-500"></div>
          </div>
        )}

        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-[1.01] border-4 border-indigo-100">
          
          {/* Header (Name and Avatar) */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between mb-6">
            <div className="text-center sm:text-left">
              <h2 className="text-3xl font-bold text-indigo-800 mb-1">{currentProfile.name}</h2>
              <p className="text-sm text-gray-400">Tenant ID: {currentProfile.tenantId || 'N/A'}</p>
            </div>
            <img 
              src={currentProfile.avatarUrl} 
              alt={currentProfile.name} 
              className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-full shadow-lg mt-4 sm:mt-0 ring-4 ring-indigo-300"
              onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/128x128/6366F1/FFFFFF?text=Tenant"; }}
            />
          </div>

          {/* Details Section */}
          <div className="space-y-3 p-4 bg-indigo-50 rounded-xl mb-6">
            <h3 className="text-xl font-bold text-indigo-700 border-b pb-2 mb-2">Basic Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                <InfoItem label="Age" value={currentProfile.age} />
                <InfoItem label="Gender" value={currentProfile.gender} />
                <InfoItem label="Stay Length" value={currentProfile.stayLength} />
                <InfoItem label="Moving Date" value={currentProfile.movingDate} />
                <InfoItem label="Smoker" value={currentProfile.smoker} />
                <InfoItem label="Cook" value={currentProfile.cook} />
            </div>
          </div>
          
          {/* Preferred Info Section (Budget & Locations) */}
          <div className="space-y-3 p-4 bg-yellow-50 rounded-xl mb-6">
            <h3 className="text-xl font-bold text-yellow-700 border-b pb-2 mb-2">Preferences</h3>
            <InfoItem 
                icon={<DollarSign className="w-5 h-5 text-yellow-600" />} 
                label="Monthly Budget" 
                value={currentProfile.budgetPerMonth} 
            />
            <div className="flex flex-col w-full py-1.5 px-1">
                <div className="flex items-center mb-1">
                    <MapPin className="w-5 h-5 text-yellow-600" />
                    <span className="font-semibold text-gray-500 ml-2 text-sm">Preferred Locations:</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-1">
                    {currentProfile.preferredLocations.length > 0 ? (
                        currentProfile.preferredLocations.map((loc, index) => (
                            <span key={index} className="px-3 py-1 bg-yellow-200 text-yellow-800 text-xs font-semibold rounded-full shadow-sm">
                                {loc}
                            </span>
                        ))
                    ) : (
                        <span className="text-sm text-gray-500">No specific location set</span>
                    )}
                </div>
            </div>
          </div>

          {/* Description */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
             <h3 className="text-xl font-bold text-gray-700 mb-2">About Me</h3>
             <p className="text-gray-600 leading-relaxed">{currentProfile.description}</p>
          </div>

        </div>
      </div>
      
      {/* Control Buttons */}
      <div className="flex justify-between w-full max-w-lg mt-8 space-x-4">
        
        {/* Reject Button (Coral) */}
        <button
          onClick={() => handleSwipe('REJECT')}
          disabled={isLoading || !currentProfile.tenantId}
          className="flex-1 flex items-center justify-center p-3 text-lg font-bold text-white bg-red-500 hover:bg-red-600 transition duration-150 rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.03]"
        >
          <X className="w-6 h-6 mr-2" />
          Reject
        </button>

        {/* Bookmark/Like Button (Teal) */}
        <button
          onClick={() => handleSwipe('LIKE')}
          disabled={isLoading || !currentProfile.tenantId}
          className="flex-1 flex items-center justify-center p-3 text-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition duration-150 rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.03]"
        >
          <Bookmark className="w-6 h-6 mr-2" />
          Bookmark
        </button>
      </div>

      <div className="mt-6 text-sm text-gray-500">
        * This page operates under the assumption that authentication (login) is complete. API calls are mocked.
      </div>
      
      {isMatchModalVisible && <MatchModal 
          profile={matchData} 
          onClose={() => setIsMatchModalVisible(false)} 
      />}

    </div>
  );
};

export default FindRoommatesPage;