// FE/src/components/layout/DashboardLayout.jsx

import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import TenantSidebar from './TenantSidebar.jsx';
import LandlordSidebar from './LandlordSidebar.jsx';
import MessengerPopup from './MessengerPopup.jsx';
import messageService from '../../services/messageService.js';

function DashboardLayout() {
  const [isMessengerOpen, setIsMessengerOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();

  const isTenant = location.pathname.includes('/tenant');
  const isLandlord = location.pathname.includes('/landlord');

  useEffect(() => {
    fetchUnreadCount();
  }, []);

  useEffect(() => {
    if (!isMessengerOpen) {
      fetchUnreadCount();
    }
  }, [isMessengerOpen]);

  const fetchUnreadCount = async () => {
    try {
      const data = await messageService.getAllConversations();
      const conversations = data.conversations || [];
      const totalUnread = conversations.reduce((sum, conv) => {
        return sum + (conv.unreadCount || 0);
      }, 0);
      setUnreadCount(totalUnread);
    } catch (error) {
      console.error('Error fetching unread count:', error);
      setUnreadCount(0);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-pink-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"> {/* ✅ UPDATED */}
      <Navbar 
        onOpenMessenger={() => setIsMessengerOpen(true)} 
        unreadCount={unreadCount}
      />

      <div className="flex-1 flex overflow-hidden">
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

        <main className="flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>

      <MessengerPopup 
        isOpen={isMessengerOpen}
        onClose={() => setIsMessengerOpen(false)}
      />
    </div>
  );
}

export default DashboardLayout;