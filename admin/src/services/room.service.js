import axiosInstance from './axiosInstance';

export const roomService = {
  getRooms: async () => (await axiosInstance.get('/rooms')).data,
  getRoom: async (id) => (await axiosInstance.get(`/rooms/${id}`)).data,
  createRoom: async (data) => (await axiosInstance.post('/rooms', data)).data,
  updateRoom: async (id, data) => (await axiosInstance.put(`/rooms/${id}`, data)).data,
  deleteRoom: async (id) => (await axiosInstance.delete(`/rooms/${id}`)).data,
};
