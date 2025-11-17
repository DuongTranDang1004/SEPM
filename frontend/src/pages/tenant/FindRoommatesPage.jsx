import React, { useState, useEffect, useCallback } from 'react';
import { X, Heart, Loader, MapPin, DollarSign, Calendar, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// API Configuration
const API_BASE_URL = 'http://localhost:8080/api';
const MOCK_AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZW5hbnQtdGVzdCIsImlhdCI6MTY3ODg4NjQwMH0.B91pA0z_R5T2oE8QvA8K6pE9A1X9o7V8HqN1jT0";

// Initial loading state
const initialMockProfile = {
  tenantId: null,
  name: "Loading Profile...",
  age: '??',
  gender: '??',
  stayLength: '??',
  movingDate: 'DD/MM/YYYY',
  isSmoker: false,
  isCook: false,
  budgetPerMonth: '??',
  preferredLocations: [],
  description: "Fetching the next roommate profile from the server.",
  avatarUrl: "https://placehold.co/200x200/A0AEC0/FFFFFF?text=Loading",
};

// API Simulation Functions
const fetchNextProfile = async (token) => {
  const names = ["Minjun Kim", "Seoyeon Lee", "Jihun Park", "Yujin Choi", "Emma Wilson", "Michael Chen", "Sarah Miller", "David Park"];
  const avatars = [
    "https://i.pravatar.cc/200?img=1",
    "https://i.pravatar.cc/200?img=2",
    "https://i.pravatar.cc/200?img=3",
    "https://i.pravatar.cc/200?img=4",
    "https://i.pravatar.cc/200?img=5",
    "https://i.pravatar.cc/200?img=6",
    "https://i.pravatar.cc/200?img=7",
    "https://i.pravatar.cc/200?img=8"
  ];

  const descriptions = [
    "I prefer a clean and quiet roommate. I work from home often during the day and value a peaceful environment.",
    "Graduate student looking for a friendly roommate. I enjoy cooking and keeping the place tidy.",
    "Software engineer with flexible hours. Non-smoker, love to cook, and enjoy occasional social gatherings.",
    "I'm an early bird who enjoys morning runs. Looking for someone with similar habits and respect for shared spaces.",
    "Creative professional working in design. I appreciate good music, clean spaces, and thoughtful conversations.",
    "Medical student with a busy schedule. Need a quiet place to study and a respectful roommate.",
    "Marketing professional who travels occasionally. Looking for someone responsible and easy-going.",
    "Teacher with regular hours. I enjoy reading, cooking, and keeping an organized home."
  ];

  const locations = [
    ["District 1", "District 2", "Binh Thanh"],
    ["District 3", "District 7", "Phu Nhuan"],
    ["District 2", "District 9", "Thu Duc"],
    ["District 1", "District 3", "District 10"],
    ["Binh Thanh", "Go Vap", "District 12"],
    ["District 7", "Tan Binh", "Tan Phu"]
  ];

  try {
    await new Promise(resolve => setTimeout(resolve, 800));
    const isLastProfile = Math.random() < 0.05;
    if (isLastProfile) return null;

    const randomIndex = Math.floor(Math.random() * names.length);
    const profile = {
      id: "tenant" + Math.floor(Math.random() * 10000),
      name: names[randomIndex],
      avatar: avatars[randomIndex],
      age: Math.floor(Math.random() * 15) + 22, // 22-36
      gender: Math.random() < 0.5 ? "Male" : "Female",
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      budgetPerMonth: Math.floor(Math.random() * 300) + 350, // $350-$650
      stayLength: Math.floor(Math.random() * 12) + 3, // 3-14 months
      moveInDate: new Date(2025, Math.floor(Math.random() * 6), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
      preferredLocations: locations[Math.floor(Math.random() * locations.length)],
      isSmoker: Math.random() < 0.2,
      isCook: Math.random() < 0.8,
    };

    return {
      tenantId: profile.id,
      name: profile.name,
      age: profile.age,
      gender: profile.gender,
      stayLength: `${profile.stayLength} months`,
      movingDate: profile.moveInDate,
      isSmoker: profile.isSmoker,
      isCook: profile.isCook,
      budgetPerMonth: `$${profile.budgetPerMonth}`,
      preferredLocations: profile.preferredLocations,
      description: profile.description,
      avatarUrl: profile.avatar,
    };
  } catch (error) {
    console.error("Fetch Error:", error.message);
    return null;
  }
};

const sendSwipeAction = async (token, targetId, action) => {
  if (!targetId) return false;
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    return true;
  } catch (error) {
    console.error("Swipe API Error:", error.message);
    return false;
  }
};

// Match Modal Component
const MatchModal = ({ profile, onClose, onOpenChat }) => {
  if (!profile) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-scaleIn"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-center">
          <div className="mb-6">
            <Heart className="w-20 h-20 text-pink-500 mx-auto animate-pulse" fill="currentColor" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">🎉 It's a Match!</h2>
          <p className="text-gray-600 mb-6">
            You and <span className="font-semibold text-pink-600">{profile.name}</span> liked each other!
          </p>
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="w-24 h-24 rounded-full mx-auto mb-6 border-4 border-pink-200 shadow-lg"
            onError={(e) => { e.target.src = "https://placehold.co/96x96/FF8598/FFFFFF?text=Avatar"; }}
          />
          <div className="space-y-3">
            <button
              onClick={onOpenChat}
              className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold py-3 rounded-xl hover:from-pink-600 hover:to-pink-700 transition transform hover:scale-105"
            >
              Start Chatting
            </button>
            <button
              onClick={onClose}
              className="w-full bg-gray-100 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-200 transition"
            >
              Keep Swiping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
const FindRoommatesPage = () => {
  const navigate = useNavigate();
  const [currentProfile, setCurrentProfile] = useState(initialMockProfile);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState('Fetching roommate profiles...');
  const [isMatchModalVisible, setIsMatchModalVisible] = useState(false);
  const [matchData, setMatchData] = useState(null);
  const [swipeCount, setSwipeCount] = useState(0);

  const loadNextProfile = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);

    const profile = await fetchNextProfile(MOCK_AUTH_TOKEN);

    if (profile) {
      setCurrentProfile(profile);
      setMessage('');
    } else if (profile === null) {
      setMessage('No more roommates available right now. Check back later! 🔄');
      setCurrentProfile({
        ...initialMockProfile,
        name: 'No More Profiles',
        description: 'You\'ve seen all available roommates. New profiles are added daily!'
      });
    } else {
      setIsError(true);
      setMessage('Unable to load profiles. Please check your connection.');
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadNextProfile();
  }, [loadNextProfile]);

  const handleSwipe = async (action) => {
    if (isLoading || !currentProfile.tenantId) return;

    const success = await sendSwipeAction(MOCK_AUTH_TOKEN, currentProfile.tenantId, action);
    const isMatch = action === 'LIKE' && Math.random() < 0.3; // 30% match rate

    if (success) {
      setSwipeCount(prev => prev + 1);
      if (isMatch) {
        setMatchData(currentProfile);
        setIsMatchModalVisible(true);
      } else {
        loadNextProfile();
      }
    } else {
      setMessage("Action failed. Please try again.");
    }
  };

  const handleOpenChat = () => {
    setIsMatchModalVisible(false);
    navigate('/dashboard/messages');
  };

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard/tenant')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">Back to Dashboard</span>
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Find Roommates 💕</h1>
          <p className="text-gray-600">Swipe right to connect with potential roommates</p>
          {swipeCount > 0 && (
            <p className="text-sm text-purple-600 mt-2">You've swiped on {swipeCount} profile{swipeCount !== 1 ? 's' : ''} today</p>
          )}
        </div>

        {/* Status Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl text-center font-medium ${
            isError ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
          }`}>
            {message}
          </div>
        )}

        {/* Profile Card */}
        <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center z-10">
              <Loader className="w-12 h-12 text-purple-500 animate-spin mb-4" />
              <p className="text-gray-600 font-medium">Loading next profile...</p>
            </div>
          )}

          {/* Profile Content */}
          <div className="p-6 md:p-8">
            {/* Avatar and Name Section */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative mb-4">
                <img
                  src={currentProfile.avatarUrl}
                  alt={currentProfile.name}
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-purple-200 shadow-lg"
                  onError={(e) => { e.target.src = "https://placehold.co/160x160/A78BFA/FFFFFF?text=Avatar"; }}
                />
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full px-4 py-1 shadow-lg font-semibold text-sm">
                  {currentProfile.age}
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{currentProfile.name}</h2>
              <p className="text-gray-500">{currentProfile.gender}</p>
            </div>

            {/* Quick Info Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                  <span className="text-sm text-gray-600 font-medium">Budget</span>
                </div>
                <p className="text-lg font-bold text-gray-900">{currentProfile.budgetPerMonth}/mo</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-gray-600 font-medium">Stay Length</span>
                </div>
                <p className="text-lg font-bold text-gray-900">{currentProfile.stayLength}</p>
              </div>
            </div>

            {/* Move-in Date */}
            <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl p-4 mb-6 border border-teal-100">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 font-medium">Move-in Date</span>
                <span className="text-base font-bold text-gray-900">{currentProfile.movingDate}</span>
              </div>
            </div>

            {/* Lifestyle Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                currentProfile.isSmoker
                  ? 'bg-orange-100 text-orange-700 border border-orange-200'
                  : 'bg-green-100 text-green-700 border border-green-200'
              }`}>
                {currentProfile.isSmoker ? '🚬 Smoker' : '🚭 Non-smoker'}
              </span>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                currentProfile.isCook
                  ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                  : 'bg-gray-100 text-gray-700 border border-gray-200'
              }`}>
                {currentProfile.isCook ? '👨‍🍳 Loves cooking' : '🍕 Rarely cooks'}
              </span>
            </div>

            {/* Preferred Locations */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-gray-900">Preferred Locations</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentProfile.preferredLocations.length > 0 ? (
                  currentProfile.preferredLocations.map((loc, index) => (
                    <span key={index} className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium border border-purple-200">
                      📍 {loc}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">Flexible with location</span>
                )}
              </div>
            </div>

            {/* Bio Section */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span>✨</span>
                About Me
              </h3>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <p className="text-gray-700 leading-relaxed">{currentProfile.description}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center pt-4">
              <button
                onClick={() => handleSwipe('REJECT')}
                disabled={isLoading || !currentProfile.tenantId}
                className="flex-1 max-w-[160px] bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-semibold py-4 rounded-2xl hover:from-gray-200 hover:to-gray-300 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
              >
                <X className="w-6 h-6" />
                <span>Pass</span>
              </button>

              <button
                onClick={() => handleSwipe('LIKE')}
                disabled={isLoading || !currentProfile.tenantId}
                className="flex-1 max-w-[160px] bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold py-4 rounded-2xl hover:from-pink-600 hover:to-purple-600 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
              >
                <Heart className="w-6 h-6" fill="currentColor" />
                <span>Like</span>
              </button>
            </div>
          </div>
        </div>

        {/* Info Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>💡 Tip: Swipe right on profiles you'd like to connect with</p>
          <p className="mt-1">🔒 Your preferences are private until you match</p>
        </div>
      </div>

      {/* Match Modal */}
      {isMatchModalVisible && (
        <MatchModal
          profile={matchData}
          onClose={() => {
            setIsMatchModalVisible(false);
            loadNextProfile();
          }}
          onOpenChat={handleOpenChat}
        />
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default FindRoommatesPage;