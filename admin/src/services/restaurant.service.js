import axiosInstance from './axiosInstance';

export const restaurantService = {
  getRestaurant: async () => (await axiosInstance.get('/restaurant-page')).data,
  updateRestaurant: async (id, data) => (await axiosInstance.put(`/restaurant-page/${id}`, data)).data,
};
