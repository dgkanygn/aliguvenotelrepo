import axiosInstance from './axiosInstance';

export const homeService = {
  // Hero (Slider)
  getHeroes: async () => (await axiosInstance.get('/home-hero')).data,
  getHero: async (id) => (await axiosInstance.get(`/home-hero/${id}`)).data,
  createHero: async (data) => (await axiosInstance.post('/home-hero', data)).data,
  updateHero: async (id, data) => (await axiosInstance.put(`/home-hero/${id}`, data)).data,
  deleteHero: async (id) => (await axiosInstance.delete(`/home-hero/${id}`)).data,

  // Counters
  getCounters: async () => (await axiosInstance.get('/home-counters')).data,
  getCounter: async (id) => (await axiosInstance.get(`/home-counters/${id}`)).data,
  createCounter: async (data) => (await axiosInstance.post('/home-counters', data)).data,
  updateCounter: async (id, data) => (await axiosInstance.put(`/home-counters/${id}`, data)).data,
  deleteCounter: async (id) => (await axiosInstance.delete(`/home-counters/${id}`)).data,

  // Features
  getFeatures: async () => (await axiosInstance.get('/home-features')).data,
  getFeature: async (id) => (await axiosInstance.get(`/home-features/${id}`)).data,
  createFeature: async (data) => (await axiosInstance.post('/home-features', data)).data,
  updateFeature: async (id, data) => (await axiosInstance.put(`/home-features/${id}`, data)).data,
  deleteFeature: async (id) => (await axiosInstance.delete(`/home-features/${id}`)).data,

  // Overview (Update Only)
  getOverview: async () => (await axiosInstance.get('/home-overview')).data,
  updateOverview: async (id, data) => (await axiosInstance.put(`/home-overview/${id}`, data)).data,

  // Founder (Update Only)
  getFounder: async () => (await axiosInstance.get('/home-founder')).data,
  updateFounder: async (id, data) => (await axiosInstance.put(`/home-founder/${id}`, data)).data,
};
