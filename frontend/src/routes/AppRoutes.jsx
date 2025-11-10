import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import SignupPage from '../pages/auth/SignupPage';
import DashboardLayout from '../layouts/DashboardLayout';
import MessagePage from '../pages/shared/MessagePage';
import AccountPage from '../pages/shared/AccountPage';

// Placeholder components - you'll create these later
const TenantDashboard = () => (
  <div className="p-8">
    <h2 className="text-2xl font-bold">Tenant Dashboard</h2>
    <p>Find Rooms, Find Roommates, etc.</p>
  </div>
);

const LandlordDashboard = () => (
  <div className="p-8">
    <h2 className="text-2xl font-bold">Landlord Dashboard</h2>
    <p>My Rooms, Upload Room, etc.</p>
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
        {/* Default dashboard redirect based on user role */}
        <Route index element={<Navigate to="/dashboard/tenant" replace />} />
        
        {/* Tenant routes */}
        <Route path="tenant" element={<TenantDashboard />} />
        
        {/* Landlord routes */}
        <Route path="landlord" element={<LandlordDashboard />} />
        
        {/* Shared routes */}
        <Route path="messages" element={<MessagePage />} />
        <Route path="account" element={<AccountPage />} />
      </Route>
      
      {/* Default route */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRoutes;