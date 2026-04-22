import axios from 'axios';
import { BASE_URL } from './pathApi';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor — attach Bearer token
axiosInstance.interceptors.request.use(
  (config) => {
    console.log('Requesting:', config.baseURL + config.url);
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle global errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        // Clear stale auth and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('verdant_user');
        window.location.href = '/login';
      } else if (error.response.status === 500) {
        console.error('Server error, please try again');
      }
    } else if (error.code === 'ECONNABORTED') {
      console.error('Request timeout. Please try again.');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;