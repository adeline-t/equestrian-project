import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787/api';

export const calendarApi = axios.create({
  baseURL: `${API_BASE_URL}/calendar`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

calendarApi.interceptors.request.use(
  (config) => {
    console.log(`🟢 Calendar API: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);
