import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787/api';

// Create axios instance for calendar API
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
    const params = new URLSearchParams();

    // Only add parameters if they have values
    if (filters.active !== undefined) {
      params.append('active', filters.active);
    }
    if (filters.lessonType) {
      params.append('lesson_type', filters.lessonType);
    }
    if (filters.excludeBlocked) {
      params.append('exclude_blocked', 'true');
    }

    const queryString = params.toString();
    const url = queryString ? `/templates?${queryString}` : '/templates';

    const response = await calendarApi.get(url);
    return response.data;
  },

  /**
   * Get a single template by ID
   */
  getById: async (id) => {
    const response = await calendarApi.get(`/templates/${id}`);
    return response.data;
  },

  /**
   * Create a new template
   */
  create: async (data) => {
    const response = await calendarApi.post('/templates', data);
    return response.data;
  },

  /**
   * Update a template
   */
  update: async (id, data) => {
    const response = await calendarApi.put(`/templates/${id}`, data);
    return response.data;
  },

  /**
   * Delete a template
   */
  delete: async (id, deleteFutureInstances = false) => {
    const params = deleteFutureInstances ? '?delete_future_instances=true' : '';
    const response = await calendarApi.delete(`/templates/${id}${params}`);
    return response.data;
  },

  /**
   * Get default participants for a template
   */
  getParticipants: async (id) => {
    const response = await calendarApi.get(`/templates/${id}/participants`);
    return response.data;
  },

  /**
   * Generate instances for a template
   */
  generate: async (id, startDate, endDate) => {
    const response = await calendarApi.post(`/templates/${id}/generate`, {
      start_date: startDate,
      end_date: endDate,
    });
    return response.data;
  },

  /**
   * Preview occurrences for a template
   */
  preview: async (id, startDate, endDate) => {
    const response = await calendarApi.post(`/templates/${id}/preview`, {
      start_date: startDate,
      end_date: endDate,
    });
    return response.data;
  },
};

// ============================================
// LESSONS API
// ============================================

export const lessonsApi = {
  /**
   * Get lessons in a date range
   */
  getAll: async (startDate, endDate, filters = {}) => {
    const params = new URLSearchParams({
      start_date: startDate,
      end_date: endDate,
    });
    if (filters.lessonType) params.append('lesson_type', filters.lessonType);
    if (filters.status) params.append('status', filters.status);
    if (filters.excludeBlocked) params.append('exclude_blocked', 'true');

    const response = await calendarApi.get(`/lessons?${params.toString()}`);
    return response.data;
  },

  /**
   * Get a single lesson by ID
   */
  getById: async (id) => {
    const response = await calendarApi.get(`/lessons/${id}`);
    return response.data;
  },

  /**
   * Create a new lesson
   */
  create: async (data) => {
    const response = await calendarApi.post('/lessons', data);
    return response.data;
  },

  /**
   * Update a lesson
   */
  update: async (id, data) => {
    const response = await calendarApi.put(`/lessons/${id}`, data);
    return response.data;
  },

  /**
   * Cancel a lesson
   */
  cancel: async (id, reason) => {
    const response = await calendarApi.delete(`/lessons/${id}`, {
      data: { reason },
    });
    return response.data;
  },

  /**
   * Mark a lesson as not given by Laury
   */
  markNotGiven: async (id, reason) => {
    const response = await calendarApi.post(`/lessons/${id}/mark-not-given`, {
      reason,
    });
    return response.data;
  },

  /**
   * Add a participant to a lesson
   */
  addParticipant: async (lessonId, participantData) => {
    const response = await calendarApi.post(`/lessons/${lessonId}/participants`, participantData);
    return response.data;
  },

  /**
   * Update a participant
   */
  updateParticipant: async (lessonId, participantId, data) => {
    const response = await calendarApi.put(
      `/lessons/${lessonId}/participants/${participantId}`,
      data
    );
    return response.data;
  },

  /**
   * Remove a participant from a lesson
   */
  removeParticipant: async (lessonId, participantId) => {
    const response = await calendarApi.delete(`/lessons/${lessonId}/participants/${participantId}`);
    return response.data;
  },
};

// ============================================
// SCHEDULE API
// ============================================

export const scheduleApi = {
  /**
   * Get week schedule
   */
  getWeek: async (date, excludeBlocked = false) => {
    const params = new URLSearchParams({ date });
    if (excludeBlocked) params.append('exclude_blocked', 'true');

    const response = await calendarApi.get(`/schedule/week?${params.toString()}`);
    return response.data;
  },

  /**
   * Get blocked periods
   */
  getBlockedPeriods: async (startDate, endDate) => {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);

    const response = await calendarApi.get(`/schedule/blocked-periods?${params.toString()}`);
    return response.data;
  },

  /**
   * Get lessons not given by Laury
   */
  getNotGiven: async (startDate, endDate) => {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);

    const response = await calendarApi.get(`/schedule/not-given?${params.toString()}`);
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

// Export default object with all APIs
export default {
  templates: templatesApi,
  lessons: lessonsApi,
  schedule: scheduleApi,
  generation: generationApi,
};
