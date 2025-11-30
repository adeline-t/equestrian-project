import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787/api';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    return Promise.reject(error);
  }
);

// Error handler helper
const handleError = (error) => {
  if (error.response) {
    // Server responded with error status
    const message = error.response.data?.error || 'Une erreur est survenue';
    const status = error.response.status;
    
    switch (status) {
      case 400:
        throw new Error(`${message} (Requête invalide)`);
      case 401:
        throw new Error(`${message} (Non autorisé)`);
      case 403:
        throw new Error(`${message} (Accès refusé)`);
      case 404:
        throw new Error(`${message} (Non trouvé)`);
      case 409:
        throw new Error(`${message} (Conflit)`);
      case 429:
        throw new Error(`${message} (Trop de requêtes)`);
      case 500:
        throw new Error(`${message} (Erreur serveur)`);
      default:
        throw new Error(`${message} (${status})`);
    }
  } else if (error.request) {
    // Request was made but no response received
    throw new Error('Impossible de contacter le serveur. Vérifiez votre connexion.');
  } else {
    // Something else happened
    throw new Error('Une erreur est survenue lors de la requête.');
  }
};

// Generic CRUD helper
const createCrudApi = (resource) => ({
  getAll: async () => {
    try {
      const response = await api.get(`/${resource}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/${resource}/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  create: async (data) => {
    try {
      const response = await api.post(`/${resource}`, data);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  update: async (id, data) => {
    try {
      const response = await api.put(`/${resource}/${id}`, data);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/${resource}/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
});

// Create specific API instances
export const ridersApi = {
  ...createCrudApi('riders'),
  getHorses: async (id) => {
    try {
      const response = await api.get(`/riders/${id}/horses`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
};

export const horsesApi = {
  ...createCrudApi('horses'),
  getRiders: async (id) => {
    try {
      const response = await api.get(`/horses/${id}/riders`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
};

export const associationsApi = createCrudApi('associations');

// Utility API
export const utilityApi = {
  health: async () => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  docs: async () => {
    try {
      const response = await api.get('/docs');
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
};

export default api;