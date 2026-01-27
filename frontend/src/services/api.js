/**
 * Core API & calendar API instances with interceptors
 */
import axios from 'axios';
import { API_SETTINGS, ERROR_MESSAGES, HTTP_STATUS } from '../lib/config';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787/api';

// -------------------------------------------------------
// Core API Instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: API_SETTINGS?.TIMEOUT || 30000,
});

// -------------------------------------------------------
// Calendar API Instance
export const calendarApi = axios.create({
  baseURL: `${API_BASE_URL}/calendar`,
  headers: { 'Content-Type': 'application/json' },
  timeout: API_SETTINGS?.TIMEOUT || 30000,
});

// -------------------------------------------------------
// Interceptors for logging & error handling
const logRequest = (prefix) => (config) => {
  console.log(`🟢 ${prefix}: ${config.method?.toUpperCase()} ${config.url}`);
  if (config.data) console.log(`📤 ${prefix} Data:`, config.data);
  return config;
};

api.interceptors.request.use(logRequest('API'));
calendarApi.interceptors.request.use(logRequest('Calendar API'));

const handleResponseError = (prefix) => (error) => {
  if (error.response) {
    console.error(`🔴 ${prefix} Error [${error.response.status}]`, {
      url: error.config?.url,
      data: error.response.data,
    });
  } else if (error.request) {
    console.error(`🔴 ${prefix} Network Error`, { url: error.config?.url });
  } else {
    console.error(`🔴 ${prefix} Request Error:`, error.message);
  }
  return Promise.reject(handleApiError(error));
};

api.interceptors.response.use((r) => r, handleResponseError('API'));
calendarApi.interceptors.response.use((r) => r, handleResponseError('Calendar API'));

// -------------------------------------------------------
// Unified error handler
const handleApiError = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    const message = data?.error || data?.message || ERROR_MESSAGES?.UNKNOWN || 'Erreur inconnue';
    const statusMessages = {
      [HTTP_STATUS.BAD_REQUEST]: `${message} (Requête invalide)`,
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
  if (error.request) return new Error(ERROR_MESSAGES?.NETWORK || 'Erreur réseau');
  return new Error(error.message || ERROR_MESSAGES?.UNKNOWN || 'Erreur inconnue');
};

// -------------------------------------------------------
// Universal CRUD Operations Factory
/* ----------------------------------------------------- */
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

export default api;
