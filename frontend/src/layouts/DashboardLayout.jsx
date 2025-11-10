import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/NavBar.jsx';
import MessengerPopup from '../../src/components/layout/MessengerPopup.jsx';

function DashboardLayout() {
  const [isMessengerOpen, setIsMessengerOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-pink-50 via-white to-teal-50">
      {/* Navigation Bar */}
      <Navbar 
        onOpenMessenger={() => setIsMessengerOpen(true)} 
        unreadCount={3} 
      />

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>

      {/* Messenger Popup (Facebook-style) */}
      <MessengerPopup 
        isOpen={isMessengerOpen}
        onClose={() => setIsMessengerOpen(false)}
      />
    </div>
  );
}

export default DashboardLayout;