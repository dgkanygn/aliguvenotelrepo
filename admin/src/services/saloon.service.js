import axiosInstance from './axiosInstance';

export const saloonService = {
  getSaloons: async () => (await axiosInstance.get('/saloons')).data,
  getSaloon: async (id) => (await axiosInstance.get(`/saloons/${id}`)).data,
  createSaloon: async (data) => (await axiosInstance.post('/saloons', data)).data,
  updateSaloon: async (id, data) => (await axiosInstance.put(`/saloons/${id}`, data)).data,
  deleteSaloon: async (id) => (await axiosInstance.delete(`/saloons/${id}`)).data,
};
