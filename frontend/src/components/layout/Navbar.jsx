// FE/src/components/navigation/Navbar.jsx

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMessages } from '../../contexts/MessageContext';

function Navbar({ onOpenMessenger }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  // ✅ Get unread CONVERSATIONS count
  const { unreadConversationsCount } = useMessages();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = user.role;

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('user');
      localStorage.removeItem('token'); 
      navigate('/login');
    }
  };

  const isActive = (path) => location.pathname.includes(path);

  const dashboardRoute = userRole === 'TENANT' ? '/dashboard/tenant' : '/dashboard/landlord';
  const accountRoute = userRole === 'TENANT' ? '/dashboard/tenant/account' : '/dashboard/landlord/account';

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(dashboardRoute)}>
        <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-teal-400 rounded-full flex items-center justify-center">
          <span className="text-xl">🏠</span>
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-teal-500 bg-clip-text text-transparent">
          Broomate
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate(dashboardRoute)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            location.pathname === dashboardRoute
              ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          🏠 Home
        </button>

        {/* ✅ Messages with Unread CONVERSATIONS Badge */}
        <button
          onClick={onOpenMessenger}
          className="relative px-4 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-all"
          title="Messages"
        >
          💬 Messages
          
          {/* ✅ Badge shows number of unread CONVERSATIONS */}
          {unreadConversationsCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1 animate-pulse">
              {unreadConversationsCount > 99 ? '99+' : unreadConversationsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => navigate(accountRoute)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            isActive('account')
              ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          👤 Account
        </button>

        <button
          onClick={handleLogout}
          className="ml-2 px-4 py-2 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-all"
        >
          🚪 Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;