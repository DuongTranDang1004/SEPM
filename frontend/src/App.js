import React from 'react';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import './App.css';

// Tenant page component imports
import TenantDashboard from './pages/tenant/TenantDashboard'; 
import FindRoomsPage from './pages/tenant/FindRoomPage';
import Messages from './pages/shared/MessagePage'; // MessageDetail Page
import NotFoundPage from './pages/NotFoundPage'; // 404

// 2. Routing. Add Navbar once it is built
function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <main className="flex-grow max-w-7xl w-full mx-auto p-0 sm:p-4">
      <BrowserRouter>
        {/* Main router configuration */}
        <Routes>
          {/* Default/Root Route Redirects to Dashboard */}
          <Route path="/" element={<TenantDashboard />} /> 
          
          {/* Dashboard Route */}
          <Route path="/dashboard" element={<TenantDashboard />} />
          
          {/* Message Detail Route (with dynamic ID) */}
          <Route path="/messages/:id" element={<Messages />} /> 

          {/* Message Detail Route (with dynamic ID) */}
          <Route path="/room" element={<FindRoomsPage />} /> 
          
          {/* Fallback route for 404 */}
          <Route path="*" element={<NotFoundPage />} /> 
        </Routes>
      </BrowserRouter>
      </main>
    </div>
  );
}

export default App;
