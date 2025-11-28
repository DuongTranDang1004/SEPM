import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import DashboardLayout from './components/layout/DashboardLayout';
import TenantDashboard from './pages/tenant/TenantDashboard';
import LandlordDashboard from './pages/landlord/LandlordDashboard';
import UploadRoomPage from './pages/landlord/UploadRoomPage'; // ✅ NOW REAL
import MessagePage from './pages/shared/MessagesPage';
import AccountPage from './pages/shared/AccountPage';
import RoomDetailPage from './pages/shared/RoomDetailPage';
import MatchPage from './pages/tenant/MatchPage';
import FindRoomsPage from './pages/tenant/FindRoomsPage';
import FindRoommatesPage from './pages/tenant/FindRoommatesPage';
import BookmarksPage from './pages/tenant/BookmarksPage';

// Placeholder components for future development
const MyRoomsPage = () => (
  <div className="h-full flex items-center justify-center p-8">
    <div className="text-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">🏘️ My Rooms</h2>
      <p className="text-gray-600">Manage your published listings (Coming Soon)</p>
    </div>
  </div>
);

const BrowseRoomsPage = () => (
  <div className="h-full flex items-center justify-center p-8">
    <div className="text-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">🔍 Browse Rooms</h2>
      <p className="text-gray-600">View rooms from other landlords (Coming Soon)</p>
    </div>
  </div>
);

function AppRoutes() {
  return (
    <Routes>
      {/* Auth routes - NO LAYOUT */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      
      {/* Dashboard routes - WITH LAYOUT */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        {/* Default redirect to tenant dashboard */}
        <Route index element={<Navigate to="/dashboard/tenant" replace />} />
        
        {/* ===== TENANT ROUTES ===== */}
        <Route path="tenant" element={<TenantDashboard />} />
        <Route path="tenant/find-rooms" element={<FindRoomsPage />} />
        <Route path="tenant/find-roommates" element={<FindRoommatesPage />} />
        <Route path="tenant/bookmarks" element={<BookmarksPage />} />
        <Route path="tenant/match" element={<MatchPage />} />
        <Route path="tenant/room/:roomId" element={<RoomDetailPage />} />
        <Route path="tenant/account" element={<AccountPage />} />
        
        {/* ===== LANDLORD ROUTES ===== */}
        <Route path="landlord" element={<LandlordDashboard />} />
        <Route path="landlord/upload-room" element={<UploadRoomPage />} /> {/* ✅ NOW REAL */}
        <Route path="landlord/my-rooms" element={<MyRoomsPage />} />
        <Route path="landlord/browse-rooms" element={<BrowseRoomsPage />} />
        <Route path="landlord/room/:roomId" element={<RoomDetailPage />} />
        <Route path="landlord/edit-room/:roomId" element={<UploadRoomPage />} /> {/* ✅ Reuse upload page for editing */}
        <Route path="landlord/account" element={<AccountPage />} />
        
        {/* ===== SHARED ROUTES ===== */}
        <Route path="messages" element={<MessagePage />} />
      </Route>
      
      {/* ===== STANDALONE ROUTES (outside dashboard layout) ===== */}
      {/* These routes from your teammate's file - preserved for compatibility */}
      <Route path="/rooms/:roomId" element={<RoomDetailPage />} /> {/* ✅ Direct room access */}
      <Route path="/landlord/:landlordId" element={<LandlordDashboard />} /> {/* ✅ Public landlord view */}
      
      {/* Default & catch-all routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRoutes;