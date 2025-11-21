import api from './api';

const userService = {
  // ===== TENANT PROFILE =====
  async getTenantProfile() {
    const response = await api.get('/tenant/profile');
    return response.data;
  },

  async updateTenantProfile(formData) {
    const response = await api.put('/tenant/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // ===== LANDLORD PROFILE =====
  async getLandlordProfile(userId) {
    const response = await api.get(`/landlord/profile/${userId}`);
    return response.data;
  },

  async updateLandlordProfile(formData) {
    const response = await api.put('/landlord/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // ===== ACCOUNT MANAGEMENT =====
  async deactivateAccount() {
    const response = await api.put('/user/deactivate');
    return response.data;
  },

  async activateAccount(userId) {
    const response = await api.put(`/user/activate/${userId}`);
    return response.data;
  },

  // ===== PASSWORD =====
  async changePassword(currentPassword, newPassword, confirmPassword) {
    const response = await api.put('/user/change-password', {
      currentPassword,
      newPassword,
      confirmPassword
    });
    return response.data;
  }
};

export default userService;
