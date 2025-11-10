import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Navbar({ onOpenMessenger, unreadCount = 3 }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  const isActive = (path) => location.pathname.includes(path);

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
      {/* Logo */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
        <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-teal-400 rounded-full flex items-center justify-center">
          <span className="text-xl">🏠</span>
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-teal-500 bg-clip-text text-transparent">
          Broomate
        </h1>
      </div>

      {/* Navigation Items */}
      <div className="flex items-center gap-2">
        {/* Dashboard/Home */}
        <button
          onClick={() => navigate('/dashboard')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            location.pathname === '/dashboard'
              ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          🏠 Home
        </button>

        {/* Messages Pop-up Trigger */}
        <button
          onClick={onOpenMessenger}
          className="relative px-4 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-all"
          title="Messages"
        >
          <span className="flex items-center gap-2">
            💬 Messages
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </span>
        </button>

        {/* Account */}
        <button
          onClick={() => navigate('/dashboard/account')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            isActive('account')
              ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          👤 Account
        </button>

        {/* Logout */}
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