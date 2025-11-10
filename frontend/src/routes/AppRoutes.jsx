import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import SignupPage from '../pages/auth/SignupPage';
import MessagePage from '../pages/shared/MessagePage';
import AccountPage from '../pages/shared/AccountPage';

function AppRoutes() {
  return (
    <Routes>
      {/* Default route - redirect to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* Auth routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      
      {/* Main app routes */}
      <Route path="/messages" element={<MessagePage />} />
      <Route path="/account" element={<AccountPage />} />
      
      {/* Catch all - redirect to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRoutes;