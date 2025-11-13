import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import SignupPage from '../pages/auth/SignupPage';
import LandlordDashboard from '../pages/landlord/LandlordDashboard';
import FindRoomPage from '../pages/tenant/FindRoomPage';
function AppRoutes() {
  return (
    <Routes>
      {/* Default route - redirect to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* Auth routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      
      {/* Catch all - redirect to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
      <Route path = "/findroom" element = {<FindRoomPage />}/>
      <Route path = "/landlord/dashboard" element = {<LandlordDashboard />}/>
    </Routes>
  );
}

export default AppRoutes;