import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LandlordGreeting from "../../components/landlord/LandlordGreeting";
import LandlordOverview from "../../components/landlord/LandlordOverview";
import LandlordPublished from "../../components/landlord/LandlordPublished";
import landlordService from "../../services/landlordService";
import userService from "../../services/userService";

function LandlordDashboard() {
  const { landlordId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [landlordProfile, setLandlordProfile] = useState(null);
  const [rooms, setRooms] = useState([]);

  // Get current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isOwnDashboard = !landlordId || landlordId === currentUser.userId;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch landlord profile
        const profile = await userService.getLandlordProfile();
        setLandlordProfile(profile);

        // Fetch landlord's rooms
        const roomsData = await landlordService.getMyRooms();
        setRooms(roomsData);

      } catch (err) {
        console.error('Failed to load dashboard:', err);
        setError(err.response?.data?.message || 'Failed to load dashboard data');

        // Redirect to login if unauthorized
        if (err.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [landlordId, navigate]);

  const overview = useMemo(() => {
    const total = rooms.length;
    const available = rooms.filter(r => r.status === 'PUBLISHED' || r.status === 'AVAILABLE').length;
    const rented = rooms.filter(r => r.status === 'RENTED').length;
    return { total, available, rented };
  }, [rooms]);

  if (loading) {
    return (
      <div className="h-full overflow-y-auto p-8 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '40px',
            textAlign: 'center',
            boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid #e5e7eb',
              borderTopColor: '#2563eb',
              borderRadius: '50%',
              margin: '0 auto 16px',
              animation: 'spin 0.8s linear infinite'
            }} />
            <p style={{ fontSize: '16px', color: '#6b7280' }}>Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full overflow-y-auto p-8 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div style={{
            background: '#fee2e2',
            border: '1px solid #ef4444',
            borderRadius: '20px',
            padding: '24px',
            marginBottom: '16px'
          }}>
            <h3 style={{ color: '#991b1b', marginBottom: '8px' }}>Error Loading Dashboard</h3>
            <p style={{ color: '#991b1b', marginBottom: '16px' }}>{error}</p>
            <button
              onClick={() => navigate('/login')}
              style={{
                background: '#ef4444',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  const formatLastLogin = () => {
    if (!isOwnDashboard) return "N/A • viewing public dashboard";
    return "Just now";
  };

  return (
    <div className="h-full overflow-y-auto p-8 bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-6xl mx-auto">
        <LandlordGreeting
          name={landlordProfile?.name || 'Landlord'}
          lastLogin={formatLastLogin()}
        />

        <LandlordOverview
          stats={overview}
          isOwnDashboard={isOwnDashboard}
          name={landlordProfile?.name || 'Landlord'}
        />

        <LandlordPublished
          title={isOwnDashboard ? "My Published Rooms" : `${landlordProfile?.name}'s Published Rooms`}
          rooms={rooms.slice(0, 6)}
        />
      </div>
    </div>
  );
}

export default LandlordDashboard;