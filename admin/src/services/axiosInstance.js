import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // We can add global error handling here if necessary
    return Promise.reject(error);
  }
);

export default axiosInstance;
