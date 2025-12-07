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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ Response error:', error);
    if (error.response) {
      console.error('❌ Response data:', error.response.data);
      console.error('❌ Response status:', error.response.status);
    }
    return Promise.reject(error);
  }
);

// Error handler helper
const handleError = (error) => {
  if (error.response) {
    // Server responded with error status
    const message =
      error.response.data?.error || error.response.data?.message || 'Une erreur est survenue';
    const status = error.response.status;

    console.error('🔴 API Error Details:', {
      status,
      message,
      data: error.response.data,
      url: error.config?.url,
      method: error.config?.method,
      requestData: error.config?.data,
    });

    let errorMessage = message;
    switch (status) {
      case 400:
        errorMessage = message; // Don't add extra text, just use the backend message
        break;
      case 401:
        errorMessage = `${message} (Non autorisé)`;
        break;
      case 403:
        errorMessage = `${message} (Accès refusé)`;
        break;
      case 404:
        errorMessage = `${message} (Non trouvé)`;
        break;
      case 409:
        errorMessage = `${message} (Conflit)`;
        break;
      case 429:
        errorMessage = `${message} (Trop de requêtes)`;
        break;
      case 500:
        errorMessage = `${message} (Erreur serveur)`;
        break;
      default:
        errorMessage = `${message} (${status})`;
    }

    const customError = new Error(errorMessage);
    customError.response = error.response;
    customError.status = status;
    throw customError;
  } else if (error.request) {
    // Request was made but no response received
    throw new Error('Impossible de contacter le serveur. Vérifiez votre connexion.');
  } else {
    // Something else happened
    throw new Error(error.message || 'Une erreur est survenue lors de la requête.');
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
  getPackages: async (id) => {
    try {
      const response = await api.get(`/riders/${id}/packages`);
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

export const pairingsApi = createCrudApi('pairings');

export const packagesApi = {
  getAll: async () => {
    try {
      const response = await api.get('/packages');
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/packages/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  create: async (data) => {
    console.log('📦 packagesApi.create called with:', data);

    // Ensure numeric fields are numbers
    const validatedData = {
      rider_id: Number(data.rider_id),
      private_lesson_count: Number(data.private_lesson_count) || 0,
      joint_lesson_count: Number(data.joint_lesson_count) || 0,
      activity_start_date: data.activity_start_date || null,
      activity_end_date: data.activity_end_date || null,
    };

    console.log('📦 Validated data:', validatedData);
    console.log('📦 Data types:', {
      rider_id: typeof validatedData.rider_id,
      private_lesson_count: typeof validatedData.private_lesson_count,
      joint_lesson_count: typeof validatedData.joint_lesson_count,
    });

    try {
      const response = await api.post('/packages', validatedData);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  update: async (id, data) => {
    console.log('📦 packagesApi.update called with:', { id, data });

    // Ensure numeric fields are numbers
    const validatedData = {
      rider_id: Number(data.rider_id),
      private_lesson_count: Number(data.private_lesson_count) || 0,
      joint_lesson_count: Number(data.joint_lesson_count) || 0,
      activity_start_date: data.activity_start_date || null,
      activity_end_date: data.activity_end_date || null,
    };

    console.log('📦 Validated data:', validatedData);

    try {
      const response = await api.put(`/packages/${id}`, validatedData);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/packages/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  createForRider: async (riderId, packageData) => {
    try {
      const response = await api.post('/packages', {
        ...packageData,
        rider_id: Number(riderId),
        private_lesson_count: Number(packageData.private_lesson_count) || 0,
        joint_lesson_count: Number(packageData.joint_lesson_count) || 0,
      });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
};

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
