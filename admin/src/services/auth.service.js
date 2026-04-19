import axiosInstance from './axiosInstance';

export const authService = {
  login: async (username, password) => {
    const response = await axiosInstance.post('/auth/login', { username, password });
    if (response.data?.success && response.data?.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },
  
  logout: async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (e) {
      console.error('Logout request failed:', e);
    }
    localStorage.removeItem('token');
    return { success: true, message: "Çıkış yapıldı." };
  },
  
  me: async () => {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  }
};
