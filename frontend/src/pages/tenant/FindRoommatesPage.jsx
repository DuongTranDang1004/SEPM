import React, { useState, useEffect, useCallback } from 'react';
import { X, Heart, Loader, MapPin, DollarSign, Calendar, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// API Configuration
const API_BASE_URL = 'http://localhost:8080/api';

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
            src={profile.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&size=96&background=FF8598&color=fff`}
            alt={profile.name}
            className="w-24 h-24 rounded-full mx-auto mb-6 border-4 border-pink-200 shadow-lg object-cover"
            onError={(e) => { 
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&size=96&background=FF8598&color=fff`;
            }}
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
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState('Fetching roommate profiles...');
  const [isMatchModalVisible, setIsMatchModalVisible] = useState(false);
  const [matchData, setMatchData] = useState(null);
  const [swipeCount, setSwipeCount] = useState(0);
  const [isSwipeInProgress, setIsSwipeInProgress] = useState(false);

  const currentProfile = profiles[currentIndex];

  // Fetch all tenant profiles
  const fetchProfiles = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setMessage('Fetching roommate profiles...');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/tenant/profiles`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
          return;
        }
        throw new Error('Failed to fetch profiles');
      }

      const data = await response.json();
      console.log('Fetched profiles:', data); // Debug log

      if (!data.tenants || data.tenants.length === 0) {
        setMessage('No more roommates available right now. Check back later! 🔄');
        setProfiles([]);
      } else {
        setProfiles(data.tenants);
        setCurrentIndex(0);
        setMessage('');
      }

    } catch (error) {
      console.error('Error fetching profiles:', error);
      setIsError(true);
      setMessage('Unable to load profiles. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const handleSwipe = async (action) => {
    if (isSwipeInProgress || !currentProfile) return;

    setIsSwipeInProgress(true);

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/tenant/swipe`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          targetTenantId: currentProfile.id,
          swipeAction: action === 'LIKE' ? 'ACCEPT' : 'REJECT'
        })
      });

      if (!response.ok) {
        throw new Error('Swipe action failed');
      }

      const data = await response.json();
      console.log('Swipe response:', data); // Debug log

      setSwipeCount(prev => prev + 1);

      // Check if it's a match
      if (data.isMatch) {
        setMatchData(currentProfile);
        setIsMatchModalVisible(true);
      } else {
        // Move to next profile
        moveToNextProfile();
      }

    } catch (error) {
      console.error('Error swiping:', error);
      setMessage("Action failed. Please try again.");
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setIsSwipeInProgress(false);
    }
  };

  const moveToNextProfile = () => {
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // No more profiles
      setMessage('No more roommates available right now. Check back later! 🔄');
      setProfiles([]);
    }
  };

  const handleOpenChat = () => {
    setIsMatchModalVisible(false);
    navigate('/dashboard/messages');
  };

  const handleCloseMatch = () => {
    setIsMatchModalVisible(false);
    moveToNextProfile();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <div className="text-center">
          <Loader className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading profiles...</p>
        </div>
      </div>
    );
  }

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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Find Roommates</h1>
          <p className="text-gray-600">Swipe right to connect with potential roommates</p>
          {swipeCount > 0 && (
            <p className="text-sm text-purple-600 mt-2">
              You've swiped on {swipeCount} profile{swipeCount !== 1 ? 's' : ''} today
            </p>
          )}
          {profiles.length > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              {profiles.length - currentIndex} profile{profiles.length - currentIndex !== 1 ? 's' : ''} remaining
            </p>
          )}
        </div>

        {/* Status Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl text-center font-medium ${
            isError ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
          }`}>
            {message}
            {isError && (
              <button
                onClick={fetchProfiles}
                className="block mx-auto mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Retry
              </button>
            )}
          </div>
        )}

        {/* Profile Card */}
        {currentProfile ? (
          <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Swipe Progress Overlay */}
            {isSwipeInProgress && (
              <div className="absolute inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center z-10">
                <Loader className="w-12 h-12 text-purple-500 animate-spin mb-4" />
                <p className="text-gray-600 font-medium">Processing...</p>
              </div>
            )}

            {/* Profile Content */}
            <div className="p-6 md:p-8">
              {/* Avatar and Name Section */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative mb-4">
                  <img
                    src={currentProfile.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentProfile.name)}&size=160&background=A78BFA&color=fff`}
                    alt={currentProfile.name}
                    className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-purple-200 shadow-lg"
                    onError={(e) => { 
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentProfile.name)}&size=160&background=A78BFA&color=fff`;
                    }}
                  />
                  {currentProfile.isActive !== undefined && (
                    <div className={`absolute -bottom-2 -right-2 ${currentProfile.isActive ? 'bg-green-500' : 'bg-gray-400'} text-white rounded-full px-3 py-1 shadow-lg font-semibold text-xs`}>
                      {currentProfile.isActive ? 'Active' : 'Inactive'}
                    </div>
                  )}
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{currentProfile.name}</h2>
                {currentProfile.email && (
                  <p className="text-sm text-gray-500">{currentProfile.email}</p>
                )}
              </div>

              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {currentProfile.budgetPerMonth && (
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="w-5 h-5 text-purple-600" />
                      <span className="text-sm text-gray-600 font-medium">Budget</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                      {currentProfile.budgetPerMonth.toLocaleString()} VND/mo
                    </p>
                  </div>
                )}
                {currentProfile.stayLength && (
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <span className="text-sm text-gray-600 font-medium">Stay Length</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">{currentProfile.stayLength} months</p>
                  </div>
                )}
              </div>

              {/* Move-in Date */}
              {currentProfile.moveInDate && (
                <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl p-4 mb-6 border border-teal-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 font-medium">Move-in Date</span>
                    <span className="text-base font-bold text-gray-900">{currentProfile.moveInDate}</span>
                  </div>
                </div>
              )}

              {/* Contact Info */}
              {currentProfile.phone && (
                <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 font-medium">📞 Phone</span>
                    <span className="text-base font-semibold text-gray-900">{currentProfile.phone}</span>
                  </div>
                </div>
              )}

              {/* Preferred Locations */}
              {currentProfile.preferredLocations && currentProfile.preferredLocations.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-gray-900">Preferred Locations</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {currentProfile.preferredLocations.map((loc, index) => (
                      <span key={index} className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium border border-purple-200">
                        📍 {loc}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Bio Section */}
              {currentProfile.description && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span>✨</span>
                    About Me
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <p className="text-gray-700 leading-relaxed">{currentProfile.description}</p>
                  </div>
                </div>
              )}

              {/* Timestamps */}
              {(currentProfile.createdAt || currentProfile.updatedAt) && (
                <div className="mb-6 text-xs text-gray-500 space-y-1">
                  {currentProfile.createdAt && (
                    <p>Member since: {new Date(currentProfile.createdAt).toLocaleDateString()}</p>
                  )}
                  {currentProfile.updatedAt && (
                    <p>Profile updated: {new Date(currentProfile.updatedAt).toLocaleDateString()}</p>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center pt-4">
                <button
                  onClick={() => handleSwipe('REJECT')}
                  disabled={isSwipeInProgress}
                  className="flex-1 max-w-[160px] bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-semibold py-4 rounded-2xl hover:from-gray-200 hover:to-gray-300 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                >
                  <X className="w-6 h-6" />
                  <span>Pass</span>
                </button>

                <button
                  onClick={() => handleSwipe('LIKE')}
                  disabled={isSwipeInProgress}
                  className="flex-1 max-w-[160px] bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold py-4 rounded-2xl hover:from-pink-600 hover:to-purple-600 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                >
                  <Heart className="w-6 h-6" fill="currentColor" />
                  <span>Like</span>
                </button>
              </div>
            </div>
          </div>
        ) : !isLoading && !isError && (
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
            <div className="text-6xl mb-4">😊</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">All Done!</h3>
            <p className="text-gray-600 mb-6">
              You've seen all available profiles. New profiles are added daily!
            </p>
            <button
              onClick={fetchProfiles}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-purple-600 hover:to-pink-600 transition"
            >
              Refresh Profiles
            </button>
          </div>
        )}

        {/* Info Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>💡 Tip: Swipe right on profiles you'd like to connect with</p>
          <p className="mt-1">🔒 Your preferences are private until you match</p>
        </div>
      </div>

      {/* Match Modal */}
      {isMatchModalVisible && matchData && (
        <MatchModal
          profile={matchData}
          onClose={handleCloseMatch}
          onOpenChat={handleOpenChat}
        />
      )}

      <style>{`
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