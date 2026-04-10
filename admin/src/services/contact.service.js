import axiosInstance from './axiosInstance';

export const contactService = {
  getContact: async () => {
    const response = await axiosInstance.get('/company-contacts');
    return response.data;
  },
  
  updateContact: async (id, data) => {
    const response = await axiosInstance.put(`/company-contacts/${id}`, data);
    return response.data;
  }
};
