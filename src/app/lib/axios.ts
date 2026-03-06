import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const stored = localStorage.getItem('meridian-user-store-v2');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.state?.userId) {
          config.headers['X-User-Id'] = parsed.state.userId;
          config.headers['X-Hotel-Id'] = parsed.state.hotelId;
        }
      } catch {
        // ignore parse errors
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('meridian-user-store-v2');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
