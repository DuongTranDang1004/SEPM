import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LandlordAccountPage() {
  const navigate = useNavigate();
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Mock landlord data
  const [userData, setUserData] = useState({
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+84 987 654 321',
    avatarUrl: '',
    description: 'Experienced landlord with 5 properties in HCMC. I ensure all my properties are well-maintained and tenants are treated fairly.',
    role: 'LANDLORD'
  });

  const [updateFormData, setUpdateFormData] = useState({...userData});
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setUserData(updateFormData);
    alert('Profile updated successfully!');
    setShowUpdateModal(false);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    alert('Password changed successfully!');
    setShowPasswordModal(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      alert(`Avatar selected: ${file.name}`);
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-pink-50 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Landlord Account</h1>
          <p className="text-gray-600 mt-2">Manage your landlord profile</p>
        </div>

        {/* Section 1: Current Profile */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Current Profile</h2>
          
          {/* Avatar */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white text-3xl font-bold">
              {userData.name.split(' ').map(n => n[0]).join('')}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex border-b border-gray-200 pb-3">
              <span className="font-semibold text-gray-700 w-48">Name:</span>
              <span className="text-gray-900">{userData.name}</span>
            </div>
            <div className="flex border-b border-gray-200 pb-3">
              <span className="font-semibold text-gray-700 w-48">Email:</span>
              <span className="text-gray-900">{userData.email}</span>
            </div>
            <div className="flex border-b border-gray-200 pb-3">
              <span className="font-semibold text-gray-700 w-48">Phone:</span>
              <span className="text-gray-900">{userData.phone}</span>
            </div>
            <div className="flex border-b border-gray-200 pb-3">
              <span className="font-semibold text-gray-700 w-48">Account Type:</span>
              <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-semibold">
                Landlord
              </span>
            </div>
            <div className="flex border-b border-gray-200 pb-3">
              <span className="font-semibold text-gray-700 w-48">Description:</span>
              <span className="text-gray-900">{userData.description}</span>
            </div>

            {/* Landlord Information */}
            <div className="pt-4">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-xl">🏠</span>
                Landlord Information
              </h3>
            </div>
            <div className="flex border-b border-gray-200 pb-3">
              <span className="font-semibold text-gray-700 w-48">Total Properties:</span>
              <span className="text-gray-900">5 rooms</span>
            </div>
            <div className="flex border-b border-gray-200 pb-3">
              <span className="font-semibold text-gray-700 w-48">Active Listings:</span>
              <span className="text-gray-900">3 available</span>
            </div>
            <div className="flex border-b border-gray-200 pb-3">
              <span className="font-semibold text-gray-700 w-48">Rented Out:</span>
              <span className="text-gray-900">2 currently rented</span>
            </div>
            <div className="flex border-b border-gray-200 pb-3">
              <span className="font-semibold text-gray-700 w-48">Member Since:</span>
              <span className="text-gray-900">January 2024</span>
            </div>
          </div>
        </div>

        {/* Section 2: Account Settings */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>
          <div className="space-y-4">
            <button
              onClick={() => {
                setUpdateFormData({...userData});
                setShowUpdateModal(true);
              }}
              className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold py-3 rounded-lg hover:from-pink-600 hover:to-pink-700 transition"
            >
              Update Profile
            </button>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold py-3 rounded-lg hover:from-purple-600 hover:to-purple-700 transition"
            >
              Change Password
            </button>
          </div>
        </div>

        {/* Section 3: Logout */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Danger Zone</h2>
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white font-semibold py-3 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Update Profile Modal */}
      {showUpdateModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowUpdateModal(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Update Profile</h3>
              <button
                onClick={() => setShowUpdateModal(false)}
                className="text-gray-400 hover:text-gray-600"
                type="button"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              {/* Avatar */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Avatar</label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white text-2xl font-bold">
                    {updateFormData.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <input
                    type="file"
                    onChange={handleAvatarUpload}
                    accept="image/*"
                    className="text-sm"
                  />
                </div>
              </div>

              {/* Basic Info */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  required
                  value={updateFormData.name}
                  onChange={(e) => setUpdateFormData({...updateFormData, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                <input
                  type="tel"
                  required
                  value={updateFormData.phone}
                  onChange={(e) => setUpdateFormData({...updateFormData, phone: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={updateFormData.description}
                  onChange={(e) => setUpdateFormData({...updateFormData, description: e.target.value})}
                  rows="4"
                  maxLength="500"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                  placeholder="Tell tenants about your properties and management style..."
                />
                <p className="text-xs text-gray-500 mt-1">{updateFormData.description.length}/500</p>
              </div>

              {/* Landlord Info Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  📊 <strong>Property Statistics:</strong> Your property stats (Total Properties, Active Listings, etc.) are automatically updated based on your room listings.
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold py-3 rounded-lg hover:from-pink-600 hover:to-pink-700 transition"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => {
            setShowPasswordModal(false);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
          }}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Change Password</h3>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                }}
                className="text-gray-400 hover:text-gray-600"
                type="button"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password *</label>
                <input
                  type="password"
                  required
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password *</label>
                <input
                  type="password"
                  required
                  minLength="8"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password *</label>
                <input
                  type="password"
                  required
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold py-3 rounded-lg hover:from-purple-600 hover:to-purple-700 transition"
              >
                Change Password
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default LandlordAccountPage;