import axiosInstance from './axiosInstance';

export const bannerService = {
  getBanners: async () => (await axiosInstance.get('/page-banners')).data,
  getBanner: async (id) => (await axiosInstance.get(`/page-banners/${id}`)).data,
  updateBanner: async (id, data) => (await axiosInstance.put(`/page-banners/${id}`, data)).data,
};
