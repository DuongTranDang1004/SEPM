// src/services/roomService.js
import api from './api';

const roomService = {
  // Get all rooms
  getAllRooms: async () => {
    const response = await api.get('/user/rooms');
    return response.data;
  },

  // Get room by ID
  getRoomById: async (roomId) => {
    const response = await api.get(`/user/rooms/${roomId}`);
    return response.data;
  },

  // Search/filter rooms
  searchRooms: async (filters) => {
    const response = await api.get('/user/rooms', {
      params: filters
    });
    return response.data;
  }
};

export default roomService;