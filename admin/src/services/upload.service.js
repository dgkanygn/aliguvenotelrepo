import axiosInstance from './axiosInstance';

export const uploadService = {
  uploadFiles: async (files, folder = 'general') => {
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append('files[]', file);
    });
    formData.append('folder', folder);

    const response = await axiosInstance.post('/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data; // { success: true, data: [url1, url2...] }
  }
};
