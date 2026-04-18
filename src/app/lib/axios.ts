import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const stored = localStorage.getItem('vzir-user-store-v1') ?? localStorage.getItem('meridian-user-store-v2');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.state?.token) {
          config.headers['Authorization'] = `Bearer ${parsed.state.token}`;
        }
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
    const status = error.response?.status;
    const detail = error.response?.data?.detail;
    // Clear session on token errors (401) or missing token (403 "Not authenticated")
    if (status === 401 || (status === 403 && detail === 'Not authenticated')) {
      localStorage.removeItem('vzir-user-store-v1');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
