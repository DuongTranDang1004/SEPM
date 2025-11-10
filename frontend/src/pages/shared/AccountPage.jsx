import React, { useState } from 'react';

function AccountPage() {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Mock user data
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+84 123 456 789',
    avatarUrl: '',
    description: 'Looking for a quiet room with good natural light. I work from home and value clean, peaceful spaces.',
    role: 'TENANT',
    // Tenant-specific fields
    stayLengthMonths: 6,
    moveInDate: '2025-01-15',
    isSmoking: false,
    isCooking: true,
    budgetPerMonth: 500,
    preferredDistricts: ['District 1', 'District 2', 'Binh Thanh'],
    needWindow: true,
    needWashingMachine: true,
    bedRoomChoice: 'separate'
  });

  const [updateFormData, setUpdateFormData] = useState({...userData});
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const districts = [
    'District 1', 'District 2', 'District 3', 'District 4', 'District 5',
    'District 6', 'District 7', 'District 8', 'District 9', 'District 10',
    'Binh Thanh', 'Phu Nhuan', 'Tan Binh', 'Go Vap'
  ];

  const handleDistrictToggle = (district) => {
    setUpdateFormData(prev => ({
      ...prev,
      preferredDistricts: prev.preferredDistricts.includes(district)
        ? prev.preferredDistricts.filter(d => d !== district)
        : [...prev.preferredDistricts, district]
    }));
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    console.log('Updating profile:', updateFormData);
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
    console.log('Changing password');
    alert('Password changed successfully!');
    setShowPasswordModal(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      console.log('Logging out...');
      alert('Logout successful!');
      // Redirect to login page
    }
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('Avatar selected:', file.name);
      // In real app, upload to server and get URL
      alert(`Avatar selected: ${file.name}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-teal-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
          <p className="text-gray-600 mt-2">Manage your profile and preferences</p>
        </div>

        {/* Section 1: View Current Profile */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Current Profile</h2>
          
          {/* Avatar */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-400 to-teal-400 flex items-center justify-center text-white text-3xl font-bold">
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
              <span className="text-gray-900">
                {userData.role === 'TENANT' ? 'Tenant' : 'Landlord'}
              </span>
            </div>
            <div className="flex border-b border-gray-200 pb-3">
              <span className="font-semibold text-gray-700 w-48">Description:</span>
              <span className="text-gray-900">{userData.description}</span>
            </div>

            {/* Tenant-specific information */}
            {userData.role === 'TENANT' && (
              <>
                <div className="pt-4">
                  <h3 className="font-bold text-gray-900 mb-3">Roommate Preferences</h3>
                </div>
                <div className="flex border-b border-gray-200 pb-3">
                  <span className="font-semibold text-gray-700 w-48">Budget/Month:</span>
                  <span className="text-gray-900">${userData.budgetPerMonth}</span>
                </div>
                <div className="flex border-b border-gray-200 pb-3">
                  <span className="font-semibold text-gray-700 w-48">Stay Length:</span>
                  <span className="text-gray-900">{userData.stayLengthMonths} months</span>
                </div>
                <div className="flex border-b border-gray-200 pb-3">
                  <span className="font-semibold text-gray-700 w-48">Move-in Date:</span>
                  <span className="text-gray-900">{userData.moveInDate}</span>
                </div>
                <div className="flex border-b border-gray-200 pb-3">
                  <span className="font-semibold text-gray-700 w-48">Preferred Districts:</span>
                  <span className="text-gray-900">{userData.preferredDistricts.join(', ')}</span>
                </div>
                <div className="flex border-b border-gray-200 pb-3">
                  <span className="font-semibold text-gray-700 w-48">Smoking:</span>
                  <span className="text-gray-900">{userData.isSmoking ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex border-b border-gray-200 pb-3">
                  <span className="font-semibold text-gray-700 w-48">Cooking:</span>
                  <span className="text-gray-900">{userData.isCooking ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex border-b border-gray-200 pb-3">
                  <span className="font-semibold text-gray-700 w-48">Need Window/Balcony:</span>
                  <span className="text-gray-900">{userData.needWindow ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex border-b border-gray-200 pb-3">
                  <span className="font-semibold text-gray-700 w-48">Need Washing Machine:</span>
                  <span className="text-gray-900">{userData.needWashingMachine ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex border-b border-gray-200 pb-3">
                  <span className="font-semibold text-gray-700 w-48">Bedroom Preference:</span>
                  <span className="text-gray-900 capitalize">{userData.bedRoomChoice}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Section 2: Update Profile & Change Password */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>
          <div className="space-y-4">
            <button
              onClick={() => {
                setUpdateFormData({...userData});
                setShowUpdateModal(true);
              }}
              className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold py-3 rounded-lg hover:from-teal-600 hover:to-teal-700 transition"
            >
              Update Profile
            </button>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold py-3 rounded-lg hover:from-pink-600 hover:to-pink-700 transition"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 my-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Update Profile</h3>
              <button
                onClick={() => setShowUpdateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
              {/* Avatar Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Avatar</label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-teal-400 flex items-center justify-center text-white text-2xl font-bold">
                    {updateFormData.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <input
                    type="file"
                    onChange={handleAvatarUpload}
                    accept="image/*"
                    className="text-sm text-gray-600"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                <input
                  type="tel"
                  required
                  value={updateFormData.phone}
                  onChange={(e) => setUpdateFormData({...updateFormData, phone: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={updateFormData.description}
                  onChange={(e) => setUpdateFormData({...updateFormData, description: e.target.value})}
                  rows="3"
                  maxLength="500"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">{updateFormData.description.length}/500</p>
              </div>

              {/* Tenant-specific fields */}
              {updateFormData.role === 'TENANT' && (
                <>
                  <div className="border-t pt-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Roommate Preferences</h4>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Stay Length (months)</label>
                      <input
                        type="number"
                        min="1"
                        value={updateFormData.stayLengthMonths}
                        onChange={(e) => setUpdateFormData({...updateFormData, stayLengthMonths: parseInt(e.target.value)})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Move-in Date</label>
                      <input
                        type="date"
                        value={updateFormData.moveInDate}
                        onChange={(e) => setUpdateFormData({...updateFormData, moveInDate: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={updateFormData.isSmoking}
                        onChange={(e) => setUpdateFormData({...updateFormData, isSmoking: e.target.checked})}
                        className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                      />
                      <span className="ml-2 text-gray-700">I smoke</span>
                    </label>
                    <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={updateFormData.isCooking}
                        onChange={(e) => setUpdateFormData({...updateFormData, isCooking: e.target.checked})}
                        className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                      />
                      <span className="ml-2 text-gray-700">I cook</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Budget per Month (USD)</label>
                    <input
                      type="number"
                      min="0"
                      value={updateFormData.budgetPerMonth}
                      onChange={(e) => setUpdateFormData({...updateFormData, budgetPerMonth: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Preferred Districts</label>
                    <div className="max-h-48 overflow-y-auto p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="grid grid-cols-2 gap-2">
                        {districts.map(district => (
                          <label
                            key={district}
                            className={`flex items-center px-3 py-2 border-2 rounded-lg cursor-pointer transition ${
                              updateFormData.preferredDistricts.includes(district)
                                ? 'border-teal-500 bg-teal-50'
                                : 'border-gray-200 hover:border-teal-300 bg-white'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={updateFormData.preferredDistricts.includes(district)}
                              onChange={() => handleDistrictToggle(district)}
                              className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">{district}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={updateFormData.needWindow}
                        onChange={(e) => setUpdateFormData({...updateFormData, needWindow: e.target.checked})}
                        className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                      />
                      <span className="ml-2 text-gray-700">Need window/balcony</span>
                    </label>
                    <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={updateFormData.needWashingMachine}
                        onChange={(e) => setUpdateFormData({...updateFormData, needWashingMachine: e.target.checked})}
                        className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                      />
                      <span className="ml-2 text-gray-700">Need washing machine</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Bedroom Preference</label>
                    <div className="grid grid-cols-2 gap-4">
                      <label className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition ${
                        updateFormData.bedRoomChoice === 'separate'
                          ? 'border-teal-500 bg-teal-50'
                          : 'border-gray-200 hover:border-teal-300'
                      }`}>
                        <input
                          type="radio"
                          name="bedroom"
                          value="separate"
                          checked={updateFormData.bedRoomChoice === 'separate'}
                          onChange={(e) => setUpdateFormData({...updateFormData, bedRoomChoice: e.target.value})}
                          className="w-4 h-4 text-teal-600"
                        />
                        <span className="ml-2 font-medium text-gray-700">Separate</span>
                      </label>
                      <label className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition ${
                        updateFormData.bedRoomChoice === 'shared'
                          ? 'border-teal-500 bg-teal-50'
                          : 'border-gray-200 hover:border-teal-300'
                      }`}>
                        <input
                          type="radio"
                          name="bedroom"
                          value="shared"
                          checked={updateFormData.bedRoomChoice === 'shared'}
                          onChange={(e) => setUpdateFormData({...updateFormData, bedRoomChoice: e.target.value})}
                          className="w-4 h-4 text-teal-600"
                        />
                        <span className="ml-2 font-medium text-gray-700">Shared</span>
                      </label>
                    </div>
                  </div>
                </>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold py-3 rounded-lg hover:from-teal-600 hover:to-teal-700 transition"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Change Password</h3>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                }}
                className="text-gray-400 hover:text-gray-600"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold py-3 rounded-lg hover:from-pink-600 hover:to-pink-700 transition"
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

export default AccountPage;