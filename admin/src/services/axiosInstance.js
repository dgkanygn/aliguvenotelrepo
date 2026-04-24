import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ============================================================
// Response interceptor — Silent Token Refresh
// ============================================================
// Eğer bir istek 401 alırsa:
//   1. /auth/refresh endpoint'ine mevcut token ile yeni token iste
//   2. Yeni token'ı localStorage'a yaz
//   3. Başarısız olan isteği yeni token ile tekrar dene
//   4. Aynı anda birden fazla 401 gelirse, sadece 1 refresh isteği gönder
//      ve diğer istekleri beklet (queue)
// ============================================================

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 değilse veya zaten retry edilmişse devam etme
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Refresh veya login isteği 401 aldıysa, sonsuz döngüye girme
    if (
      originalRequest.url?.includes('/auth/refresh') ||
      originalRequest.url?.includes('/auth/login')
    ) {
      return Promise.reject(error);
    }

    // Zaten bir refresh devam ediyorsa, kuyruğa ekle
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const currentToken = localStorage.getItem('token');
      if (!currentToken) {
        throw new Error('No token available');
      }

      const response = await axios.post(
        `${axiosInstance.defaults.baseURL}/auth/refresh`,
        {},
        {
          headers: {
            Authorization: `Bearer ${currentToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data?.success && response.data?.token) {
        const newToken = response.data.token;
        localStorage.setItem('token', newToken);

        // Kuyrukta bekleyen istekleri yeni token ile devam ettir
        processQueue(null, newToken);

        // Başarısız olan orijinal isteği yeni token ile tekrar dene
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } else {
        throw new Error('Refresh failed');
      }
    } catch (refreshError) {
      // Refresh de başarısız olduysa → kullanıcıyı login'e at
      processQueue(refreshError, null);
      localStorage.removeItem('token');

      // Login sayfasında değilsek yönlendir
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosInstance;
