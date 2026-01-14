/**
 * Core API Service - Axios wrapper with error handling
 */
import axios from 'axios';
import { API_SETTINGS, ERROR_MESSAGES, HTTP_STATUS } from '../lib/config';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: API_SETTINGS.TIMEOUT,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`🟢 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    if (config.data) console.log('📤 Data:', config.data);
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ Response error:', error);
    return Promise.reject(handleApiError(error));
  }
);

/**
 * Handle API errors
 * @param {Error} error - Axios error
 * @returns {Error} Formatted error
 */
const handleApiError = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    const message = data?.error || data?.message || ERROR_MESSAGES.UNKNOWN;

    const statusMessages = {
      [HTTP_STATUS.BAD_REQUEST]: message,
      [HTTP_STATUS.UNAUTHORIZED]: `${message} (Non autorisé)`,
      [HTTP_STATUS.FORBIDDEN]: `${message} (Accès refusé)`,
      [HTTP_STATUS.NOT_FOUND]: `${message} (Non trouvé)`,
      [HTTP_STATUS.INTERNAL_SERVER_ERROR]: `${message} (Erreur serveur)`,
    };

    const errorMessage = statusMessages[status] || `${message} (${status})`;
    const customError = new Error(errorMessage);
    customError.response = error.response;
    customError.status = status;
    return customError;
  }

  if (error.request) {
    return new Error(ERROR_MESSAGES.NETWORK);
  }

  return new Error(error.message || ERROR_MESSAGES.UNKNOWN);
};

/**
 * Create CRUD operations for a resource
 * @param {string} resource - Resource name (e.g., 'horses', 'riders')
 * @returns {Object} CRUD operations
 */
export const createCrudOperations = (resource) => ({
  getAll: async (params = {}) => {
    const response = await api.get(`/${resource}`, { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/${resource}/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post(`/${resource}`, data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/${resource}/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/${resource}/${id}`);
    return response.data;
  },
});

export { api };
export default api;
