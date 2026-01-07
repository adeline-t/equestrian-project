/**
 * Core API Service - Handles all HTTP communication
 */
import axios from 'axios';
import { API_SETTINGS, ERROR_MESSAGES, HTTP_STATUS } from '../lib/config';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787/api';

// Create axios instance with configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: API_SETTINGS?.TIMEOUT || 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`🟢 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    if (config.data) {
      console.log('📤 Request Data:', config.data);
      console.log(
        '📤 Request Data Types:',
        Object.keys(config.data).reduce((acc, key) => {
          acc[key] = typeof config.data[key];
          return acc;
        }, {})
      );
    }
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
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ Response error:', error);
    return Promise.reject(handleApiError(error));
  }
);

// Error handler
const handleApiError = (error) => {
  if (error.response) {
    const status = error.response.status;
    const message = error.response.data?.error || error.response.data?.message || ERROR_MESSAGES?.UNKNOWN || 'Une erreur est survenue';
    
    let errorMessage = message;
    switch (status) {
      case HTTP_STATUS?.BAD_REQUEST || 400:
        errorMessage = message;
        break;
      case HTTP_STATUS?.UNAUTHORIZED || 401:
        errorMessage = `${message} (Non autorisé)`;
        break;
      case HTTP_STATUS?.FORBIDDEN || 403:
        errorMessage = `${message} (Accès refusé)`;
        break;
      case HTTP_STATUS?.NOT_FOUND || 404:
        errorMessage = `${message} (Non trouvé)`;
        break;
      case HTTP_STATUS?.INTERNAL_SERVER_ERROR || 500:
        errorMessage = `${message} (Erreur serveur)`;
        break;
      default:
        errorMessage = `${message} (${status})`;
    }

    const customError = new Error(errorMessage);
    customError.response = error.response;
    customError.status = status;
    return customError;
  } else if (error.request) {
    return new Error(ERROR_MESSAGES?.NETWORK || 'Impossible de contacter le serveur. Vérifiez votre connexion.');
  } else {
    return new Error(error.message || ERROR_MESSAGES?.UNKNOWN || 'Une erreur est survenue lors de la requête.');
  }
};

// Generic CRUD operations
const createCrudOperations = (resource) => ({
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

export { api, createCrudOperations };
export default api;