import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Tenant page component imports
import TenantDashboard from './pages/tenant/TenantDashboard'; 
import ProfileMatch from './pages/tenant/FindRoommatesPage'; // FindRoommatesPage.jsx
import Messages from './pages/tenant/MessagePage'; // MessageDetail Page
import NotFoundPage from './pages/NotFoundPage'; // 404

// 2. Routing
function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <NavBar />
      <main className="flex-grow max-w-7xl w-full mx-auto p-0 sm:p-4">
        {/* Main router configuration */}
        <Routes>
          {/* Default/Root Route Redirects to Dashboard */}
          <Route path="/" element={<TenantDashboard />} /> 
          
          {/* Dashboard Route */}
          <Route path="/dashboard" element={<TenantDashboard />} />
          
          {/* Main Swiping/Matching View Route */}
          <Route path="/match" element={<ProfileMatch />} />
          
          {/* Message Detail Route (with dynamic ID) */}
          <Route path="/messages/:id" element={<Messages />} /> 
          
          {/* Fallback route for 404 */}
          <Route path="*" element={<NotFoundPage />} /> 
        </Routes>
      </main>
    </div>
  );
}

export default App;
