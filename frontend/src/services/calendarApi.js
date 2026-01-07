/**
 * Calendar API - Handles calendar-specific operations
 */
import axios from 'axios';
import { LESSON_TYPES } from '../lib/domains/lessons/types';
import { LESSON_STATUSES } from '../lib/domains/lessons/statuses';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787/api';

// Create axios instance for calendar API with /calendar base path
const calendarApi = axios.create({
  baseURL: `${API_BASE_URL}/calendar`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor
calendarApi.interceptors.request.use(
  (config) => {
    console.log(`🟢 Calendar API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Calendar Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
calendarApi.interceptors.response.use(
  (response) => {
    console.log(`✅ Calendar API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ Calendar Response error:', error);
    if (error.response) {
      console.error('❌ Response data:', error.response.data);
    }
    return Promise.reject(error);
  }
);

// ============================================
// TEMPLATES API
// ============================================

export const templatesApi = {
  /**
   * Get all lesson templates
   */
  getAll: async (filters = {}) => {
    const params = {};

    if (filters.active !== undefined) params.active = filters.active;
    if (filters.lessonType) params.lesson_type = filters.lessonType;
    if (filters.excludeBlocked) params.exclude_blocked = 'true';

    const response = await calendarApi.get('/templates', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await calendarApi.get(`/templates/${id}`);
    return response.data;
  },

  create: async (data) => {
    const lessonType = LESSON_TYPES.find((t) => t.value === data.type);
    if (!lessonType) {
      throw new Error('Type de leçon invalide');
    }

    const validatedData = {
      ...data,
      max_participants: Number(data.max_participants) || lessonType.defaultMax,
    };

    const response = await calendarApi.post('/templates', validatedData);
    return response.data;
  },

  update: async (id, data) => {
    if (data.type) {
      const lessonType = LESSON_TYPES.find((t) => t.value === data.type);
      if (!lessonType) {
        throw new Error('Type de leçon invalide');
      }
    }

    const validatedData = {
      ...data,
      max_participants: data.max_participants ? Number(data.max_participants) : undefined,
    };

    const response = await calendarApi.put(`/templates/${id}`, validatedData);
    return response.data;
  },

  delete: async (id, deleteFutureInstances = false) => {
    const params = deleteFutureInstances ? { delete_future_instances: 'true' } : {};
    const response = await calendarApi.delete(`/templates/${id}`, { params });
    return response.data;
  },

  getParticipants: async (id) => {
    const response = await calendarApi.get(`/templates/${id}/participants`);
    return response.data;
  },

  generate: async (id, startDate, endDate) => {
    const response = await calendarApi.post(`/templates/${id}/generate`, {
      start_date: startDate,
      end_date: endDate,
    });
    return response.data;
  },

  preview: async (id, startDate, endDate) => {
    const response = await calendarApi.post(`/templates/${id}/preview`, {
      start_date: startDate,
      end_date: endDate,
    });
    return response.data;
  },

  getLessonTypes: () => LESSON_TYPES,
};

// ============================================
// LESSONS API
// ============================================

export const lessonsApi = {
  /**
   * Get lessons in a date range
   */
  getAll: async (startDate, endDate, filters = {}) => {
    const params = {
      start_date: startDate,
      end_date: endDate,
    };

    if (filters.lessonType) params.lesson_type = filters.lessonType;
    if (filters.status) params.status = filters.status;
    if (filters.excludeBlocked) params.exclude_blocked = 'true';

    const response = await calendarApi.get('/lessons', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await calendarApi.get(`/lessons/${id}`);
    return response.data;
  },

  create: async (data) => {
    const lessonType = LESSON_TYPES.find((t) => t.value === data.type);
    if (!lessonType) {
      throw new Error('Type de leçon invalide');
    }

    const validatedData = {
      ...data,
      max_participants: Number(data.max_participants) || lessonType.defaultMax,
    };

    const response = await calendarApi.post('/lessons', validatedData);
    return response.data;
  },

  update: async (id, data) => {
    if (data.type) {
      const lessonType = LESSON_TYPES.find((t) => t.value === data.type);
      if (!lessonType) {
        throw new Error('Type de leçon invalide');
      }
    }

    const validatedData = {
      ...data,
      max_participants: data.max_participants ? Number(data.max_participants) : undefined,
    };

    const response = await calendarApi.put(`/lessons/${id}`, validatedData);
    return response.data;
  },

  cancel: async (id, reason) => {
    const response = await calendarApi.delete(`/lessons/${id}`, { data: { reason } });
    return response.data;
  },

  markNotGiven: async (id, reason) => {
    const response = await calendarApi.post(`/lessons/${id}/mark-not-given`, { reason });
    return response.data;
  },

  addParticipant: async (lessonId, participantData) => {
    const response = await calendarApi.post(`/lessons/${lessonId}/participants`, participantData);
    return response.data;
  },

  updateParticipant: async (lessonId, participantId, data) => {
    const response = await calendarApi.put(
      `/lessons/${lessonId}/participants/${participantId}`,
      data
    );
    return response.data;
  },

  removeParticipant: async (lessonId, participantId) => {
    const response = await calendarApi.delete(`/lessons/${lessonId}/participants/${participantId}`);
    return response.data;
  },

  getLessonTypes: () => LESSON_TYPES,
  getLessonStatuses: () => LESSON_STATUSES,
};

// ============================================
// SCHEDULE API
// ============================================

export const scheduleApi = {
  /**
   * Get week schedule
   */
  getWeek: async (date, excludeBlocked = false) => {
    const params = { date };
    if (excludeBlocked) params.exclude_blocked = 'true';

    const response = await calendarApi.get('/schedule/week', { params });
    return response.data;
  },

  /**
   * Get blocked periods
   */
  getBlockedPeriods: async (startDate, endDate) => {
    const params = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    const response = await calendarApi.get('/schedule/blocked-periods', { params });
    return response.data;
  },

  /**
   * Get lessons not given by Laury
   */
  getNotGiven: async (startDate, endDate) => {
    const params = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    const response = await calendarApi.get('/schedule/not-given', { params });
    return response.data;
  },

  /**
   * Check availability for a time slot
   */
  checkAvailability: async (date, startTime, duration) => {
    const response = await calendarApi.post('/schedule/check-availability', {
      date,
      start_time: startTime,
      duration,
    });
    return response.data;
  },
};

// ============================================
// GENERATION API
// ============================================

export const generationApi = {
  /**
   * Generate all lesson instances
   */
  generateAll: async (weeksAhead = 4) => {
    const response = await calendarApi.post('/generate', {
      weeks_ahead: weeksAhead,
    });
    return response.data;
  },
};
