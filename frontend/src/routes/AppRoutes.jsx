import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import SignupPage from '../pages/auth/SignupPage';
import DashboardLayout from '../layouts/DashboardLayout';
import TenantDashboard from '../pages/tenant/TenantDashboard';
import LandlordDashboard from '../pages/landlord/LandlordDashboard';
import MessagePage from '../pages/shared/MessagePage';
import AccountPage from '../pages/shared/AccountPage'; // ✅ Unified dynamic account page
import RoomDetailPage from '../pages/RoomDetailPage';
import MatchPage from '../pages/tenant/MatchPage';
import FindRoomsPage from '../pages/tenant/FindRoomsPage';
import FindRoommatesPage from '../pages/tenant/FindRoommatesPage';
import BookmarksPage from '../pages/tenant/BookmarksPage'; // ✅ NEW: Real BookmarksPage with API

// Placeholder components for future development

const UploadRoomPage = () => (
  <div className="h-full flex items-center justify-center p-8">
    <div className="text-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">➕ Upload Room</h2>
      <p className="text-gray-600">Create a new room listing (Coming Soon)</p>
    </div>
  </div>
);

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
      {/* Auth routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      
      {/* Dashboard routes with layout */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        {/* Default redirect to tenant dashboard */}
        <Route index element={<Navigate to="/dashboard/tenant" replace />} />
        
        {/* Tenant routes */}
        <Route path="tenant" element={<TenantDashboard />} />
        <Route path="tenant/find-rooms" element={<FindRoomsPage />} />
        <Route path="tenant/find-roommates" element={<FindRoommatesPage />} />
        <Route path="tenant/bookmarks" element={<BookmarksPage />} /> {/* ✅ UPDATED: Now uses real component */}
        <Route path="tenant/match" element={<MatchPage />} />
        <Route path="tenant/room/:roomId" element={<RoomDetailPage />} />
        <Route path="tenant/account" element={<AccountPage />} />
        
        {/* Landlord routes */}
        <Route path="landlord" element={<LandlordDashboard />} />
        <Route path="landlord/upload-room" element={<UploadRoomPage />} />
        <Route path="landlord/my-rooms" element={<MyRoomsPage />} />
        <Route path="landlord/browse-rooms" element={<BrowseRoomsPage />} />
        <Route path="landlord/room/:roomId" element={<RoomDetailPage />} />
        <Route path="landlord/edit-room/:roomId" element={<UploadRoomPage />} />
        <Route path="landlord/account" element={<AccountPage />} />
        
        {/* Shared routes (no sidebar) */}
        <Route path="messages" element={<MessagePage />} />
      </Route>
      
      {/* Default route */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRoutes;