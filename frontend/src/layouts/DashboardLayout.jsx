import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/layout/Navbar.jsx';
import TenantSidebar from '../components/layout/TenantSidebar.jsx';
import LandlordSidebar from '../components/layout/LandlordSidebar.jsx';
import MessengerPopup from '../components/layout/MessengerPopup.jsx';

function DashboardLayout() {
  const [isMessengerOpen, setIsMessengerOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();

  // Determine user role from the route
  // In a real app, you'd get this from context/auth state
  const isTenant = location.pathname.includes('/tenant');
  const isLandlord = location.pathname.includes('/landlord');

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-pink-50 via-white to-teal-50">
      {/* Navigation Bar */}
      <Navbar 
        onOpenMessenger={() => setIsMessengerOpen(true)} 
        unreadCount={3} 
      />

      {/* Main Content with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Conditional Sidebar - Only show on tenant/landlord routes */}
        {(isTenant || isLandlord) && (
          <>
            {isTenant && (
              <TenantSidebar 
                isCollapsed={isSidebarCollapsed}
                onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              />
            )}
            {isLandlord && (
              <LandlordSidebar 
                isCollapsed={isSidebarCollapsed}
                onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              />
            )}
          </>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>

      {/* Messenger Popup (Facebook-style) */}
      <MessengerPopup 
        isOpen={isMessengerOpen}
        onClose={() => setIsMessengerOpen(false)}
      />
    </div>
  );
}

export default DashboardLayout;