import React from 'react';

function TenantDashboard() {
  return (
    <div className="h-full overflow-y-auto p-8 bg-gradient-to-br from-teal-50 to-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, Tenant!</h1>
          <p className="text-gray-600">Find your perfect room and ideal roommate</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-teal-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Bookmarks</h3>
              <span className="text-3xl">💾</span>
            </div>
            <p className="text-3xl font-bold text-teal-600">5</p>
            <p className="text-sm text-gray-500 mt-2">Saved rooms</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Matches</h3>
              <span className="text-3xl">👥</span>
            </div>
            <p className="text-3xl font-bold text-pink-600">3</p>
            <p className="text-sm text-gray-500 mt-2">Potential roommates</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Messages</h3>
              <span className="text-3xl">💬</span>
            </div>
            <p className="text-3xl font-bold text-purple-600">8</p>
            <p className="text-sm text-gray-500 mt-2">Unread conversations</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button className="flex items-center gap-4 p-6 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl hover:shadow-xl transition transform hover:scale-105">
              <span className="text-4xl">🔍</span>
              <div className="text-left">
                <h3 className="font-bold text-lg">Find Rooms</h3>
                <p className="text-sm text-teal-100">Browse available listings</p>
              </div>
            </button>

            <button className="flex items-center gap-4 p-6 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl hover:shadow-xl transition transform hover:scale-105">
              <span className="text-4xl">👥</span>
              <div className="text-left">
                <h3 className="font-bold text-lg">Find Roommates</h3>
                <p className="text-sm text-pink-100">Swipe and match</p>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <span className="text-2xl">✅</span>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">New match!</p>
                <p className="text-sm text-gray-600">You matched with Sarah Miller - 85% compatibility</p>
              </div>
              <span className="text-xs text-gray-500">2 hours ago</span>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <span className="text-2xl">💾</span>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Room bookmarked</p>
                <p className="text-sm text-gray-600">Cozy studio in District 1 - $450/month</p>
              </div>
              <span className="text-xs text-gray-500">5 hours ago</span>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <span className="text-2xl">💬</span>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">New message</p>
                <p className="text-sm text-gray-600">John Doe sent you a message</p>
              </div>
              <span className="text-xs text-gray-500">Yesterday</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TenantDashboard;