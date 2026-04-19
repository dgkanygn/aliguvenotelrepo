import axiosInstance from './axiosInstance';

export const restaurantService = {
  getRestaurant: async () => (await axiosInstance.get('/restaurant')).data,
  updateRestaurant: async (id, data) => (await axiosInstance.put(`/restaurant/${id}`, data)).data,
};
