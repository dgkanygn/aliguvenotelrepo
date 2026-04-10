import axiosInstance from './axiosInstance';

export const authService = {
  login: async (username, password) => {
    const response = await axiosInstance.post('/auth/login', { username, password });
    return response.data;
  },
  
  logout: async () => {
    const response = await axiosInstance.post('/auth/logout');
    return response.data;
  },
  
  me: async () => {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  }
};
