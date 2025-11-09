import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function SignupPage() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    avatarUrl: '',
    description: '',
    stayLengthMonths: 6,
    moveInDate: '',
    isSmoking: false,
    isCooking: false,
    budgetPerMonth: '',
    preferredDistricts: [],
    needWindow: false,
    needWashingMachine: false,
    bedRoomChoice: 'separate'
  });

  const districts = [
    'District 1', 'District 2', 'District 3', 'District 4', 'District 5',
    'District 6', 'District 7', 'District 8', 'District 9', 'District 10',
    'Binh Thanh', 'Phu Nhuan', 'Tan Binh', 'Go Vap'
  ];

  const handleDistrictToggle = (district) => {
    setFormData(prev => ({
      ...prev,
      preferredDistricts: prev.preferredDistricts.includes(district)
        ? prev.preferredDistricts.filter(d => d !== district)
        : [...prev.preferredDistricts, district]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (step === 2 && role === 'TENANT') {
      setStep(3);
      return;
    }
    
    console.log('Signup submitted:', { ...formData, role });
    alert('Signup functionality - Data logged to console');
  };

  // ==================== STEP 1: ROLE SELECTION ====================
  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-teal-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-400 to-teal-400 rounded-full mb-4">
              <span className="text-2xl">🏠</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Join Broomate</h1>
            <p className="text-gray-600 mt-2">Choose how you want to use Broomate</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Tenant Card */}
            <button
              onClick={() => {
                setRole('TENANT');
                setStep(2);
              }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all border-2 border-transparent hover:border-pink-400 text-left"
            >
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">👥</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">For Tenants</h3>
              <p className="text-gray-600 mb-4">
                I'm looking for a place to stay and want to find compatible roommates
              </p>
              <div className="flex items-center text-pink-600 font-semibold">
                Get Started <span className="ml-2">→</span>
              </div>
            </button>

            {/* Landlord Card */}
            <button
              onClick={() => {
                setRole('LANDLORD');
                setStep(2);
              }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all border-2 border-transparent hover:border-teal-400 text-left"
            >
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">🏠</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">For Landlords</h3>
              <p className="text-gray-600 mb-4">
                I have rooms to rent out and want to find quality tenants
              </p>
              <div className="flex items-center text-teal-600 font-semibold">
                Get Started <span className="ml-2">→</span>
              </div>
            </button>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-teal-600 hover:text-teal-700 font-semibold">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ==================== STEP 2: BASIC INFORMATION ====================
  if (step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-teal-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Step 2 of {role === 'TENANT' ? '3' : '2'}</span>
              <span className="text-sm text-gray-500">Basic Information</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-pink-400 to-teal-400 h-2 rounded-full transition-all"
                style={{width: role === 'TENANT' ? '66%' : '100%'}}
              ></div>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Your Account</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="+84 123 456 7890"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="At least 8 characters"
                  minLength="8"
                />
                <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Re-enter your password"
                />
              </div>

              {/* Avatar URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo URL (Optional)</label>
                <input
                  type="url"
                  value={formData.avatarUrl}
                  onChange={(e) => setFormData({...formData, avatarUrl: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="https://example.com/photo.jpg"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">About You (Optional)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
                  maxLength="500"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                  placeholder="Tell us a bit about yourself..."
                />
                <p className="text-xs text-gray-500 mt-1">{formData.description.length}/500 characters</p>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold py-3 rounded-lg hover:from-teal-600 hover:to-teal-700 transform hover:scale-[1.02] transition-all shadow-lg"
                >
                  {role === 'TENANT' ? 'Continue' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ==================== STEP 3: TENANT PREFERENCES ====================
  if (step === 3 && role === 'TENANT') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-teal-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Step 3 of 3</span>
              <span className="text-sm text-gray-500">Your Preferences</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-pink-400 to-teal-400 h-2 rounded-full" style={{width: '100%'}}></div>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Roommate Preferences</h2>
              <p className="text-sm text-gray-500 mt-1">💡 You can change these later in settings</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Living Preferences */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Living Preferences</h3>
                
                {/* Budget */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Budget per Month (USD) *</label>
                  <input
                    type="number"
                    required
                    value={formData.budgetPerMonth}
                    onChange={(e) => setFormData({...formData, budgetPerMonth: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="500"
                    min="0"
                  />
                </div>

                {/* Preferred Districts */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Preferred Districts * (Select at least one)
                  </label>
                  <div className="max-h-64 overflow-y-auto p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {districts.map(district => (
                        <label
                          key={district}
                          className={`flex items-center px-3 py-2 border-2 rounded-lg cursor-pointer transition ${
                            formData.preferredDistricts.includes(district)
                              ? 'border-pink-500 bg-pink-50'
                              : 'border-gray-200 hover:border-pink-300 bg-white'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.preferredDistricts.includes(district)}
                            onChange={() => handleDistrictToggle(district)}
                            className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">{district}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {formData.preferredDistricts.length} district{formData.preferredDistricts.length !== 1 ? 's' : ''} selected
                  </p>
                </div>

                {/* Move-in Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Move-in Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.moveInDate}
                    onChange={(e) => setFormData({...formData, moveInDate: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>

                {/* Stay Length */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Intended Stay Length *</label>
                  <select
                    value={formData.stayLengthMonths}
                    onChange={(e) => setFormData({...formData, stayLengthMonths: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value={1}>1 month</option>
                    <option value={3}>3 months</option>
                    <option value={6}>6 months</option>
                    <option value={12}>12 months</option>
                    <option value={24}>24+ months</option>
                  </select>
                </div>
              </div>

              {/* Lifestyle */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Lifestyle</h3>
                
                {/* Smoking */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Do you smoke?</p>
                    <p className="text-sm text-gray-500">This helps match you with compatible roommates</p>
                  </div>
                  <div className="flex gap-4">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="smoking"
                        checked={formData.isSmoking === true}
                        onChange={() => setFormData({...formData, isSmoking: true})}
                        className="w-4 h-4 text-pink-600"
                      />
                      <span className="ml-2 text-sm font-medium">Yes</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="smoking"
                        checked={formData.isSmoking === false}
                        onChange={() => setFormData({...formData, isSmoking: false})}
                        className="w-4 h-4 text-pink-600"
                      />
                      <span className="ml-2 text-sm font-medium">No</span>
                    </label>
                  </div>
                </div>

                {/* Cooking */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Do you cook?</p>
                    <p className="text-sm text-gray-500">Important for shared kitchen usage</p>
                  </div>
                  <div className="flex gap-4">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="cooking"
                        checked={formData.isCooking === true}
                        onChange={() => setFormData({...formData, isCooking: true})}
                        className="w-4 h-4 text-pink-600"
                      />
                      <span className="ml-2 text-sm font-medium">Yes</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="cooking"
                        checked={formData.isCooking === false}
                        onChange={() => setFormData({...formData, isCooking: false})}
                        className="w-4 h-4 text-pink-600"
                      />
                      <span className="ml-2 text-sm font-medium">No</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Room Requirements */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Room Requirements</h3>
                
                {/* Checkboxes */}
                <div className="space-y-3">
                  <label className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.needWindow}
                      onChange={(e) => setFormData({...formData, needWindow: e.target.checked})}
                      className="w-5 h-5 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                    />
                    <span className="ml-3 text-gray-700">Need window/balcony</span>
                  </label>

                  <label className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.needWashingMachine}
                      onChange={(e) => setFormData({...formData, needWashingMachine: e.target.checked})}
                      className="w-5 h-5 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                    />
                    <span className="ml-3 text-gray-700">Need washing machine</span>
                  </label>
                </div>

                {/* Bedroom Preference */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Bedroom Preference *</label>
                  <div className="grid grid-cols-2 gap-4">
                    <label
                      className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition ${
                        formData.bedRoomChoice === 'separate'
                          ? 'border-pink-500 bg-pink-50'
                          : 'border-gray-200 hover:border-pink-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="bedroom"
                        value="separate"
                        checked={formData.bedRoomChoice === 'separate'}
                        onChange={(e) => setFormData({...formData, bedRoomChoice: e.target.value})}
                        className="w-4 h-4 text-pink-600"
                      />
                      <span className="ml-2 font-medium text-gray-700">Separate Room</span>
                    </label>
                    <label
                      className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition ${
                        formData.bedRoomChoice === 'shared'
                          ? 'border-pink-500 bg-pink-50'
                          : 'border-gray-200 hover:border-pink-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="bedroom"
                        value="shared"
                        checked={formData.bedRoomChoice === 'shared'}
                        onChange={(e) => setFormData({...formData, bedRoomChoice: e.target.value})}
                        className="w-4 h-4 text-pink-600"
                      />
                      <span className="ml-2 font-medium text-gray-700">Shared Room OK</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-6 py-3 border-2 border-pink-300 text-pink-600 font-semibold rounded-lg hover:bg-pink-50 transition"
                >
                  Skip for Now
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold py-3 rounded-lg hover:from-pink-600 hover:to-pink-700 transform hover:scale-[1.02] transition-all shadow-lg"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default SignupPage;