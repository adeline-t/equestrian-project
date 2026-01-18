# 📁 Project Files Export

Generated on: Sun Jan 18 03:58:12 CET 2026

## 📄 apiService.js
**Path:** `apiService.js`

```
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
```

---

## 📄 calendarApi.js
**Path:** `calendarApi.js`

```
/**
 * Calendar API - Adjusted for updated DB schema
 */
import axios from 'axios';
import { EVENT_STATUSES, EVENT_TYPES, PLANNING_SLOT_TYPES } from '../lib/domain/domain-constants';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787/api';

const calendarApi = axios.create({
  baseURL: `${API_BASE_URL}/calendar`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// Request interceptor
calendarApi.interceptors.request.use(
  (config) => {
    console.log(`🟢 Calendar API: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Lessons API - /calendar/events
 */
export const eventsApi = {
  getAll: async (startDate, endDate, filters = {}) => {
    const params = { start_date: startDate, end_date: endDate, ...filters };
    const response = await calendarApi.get('/events', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await calendarApi.get(`/events/${id}`);
    return response.data;
  },

  create: async (data) => {
    const eventType = EVENT_TYPES.find((t) => t.value === data.event_type);
    if (!eventType) throw new Error('Type de leçon invalide');

    const validated = {
      planning_slot_id: Number(data.planning_slot_id),
      event_type: data.event_type,
      status: data.status || EVENT_STATUSES.SCHEDULED,
      instructor_id: Number(data.instructor_id),
      actual_instructor_id: data.actual_instructor_id ? Number(data.actual_instructor_id) : null,
      min_participants: data.min_participants ? Number(data.min_participants) : null,
      max_participants: data.max_participants
        ? Number(data.max_participants)
        : eventType.defaultMax,
      cancellation_reason: data.cancellation_reason || null,
    };

    const response = await calendarApi.post('/events', validated);
    return response.data;
  },

  update: async (id, data) => {
    if (data.event_type && !EVENT_TYPES.find((t) => t.value === data.event_type)) {
      throw new Error('Type de leçon invalide');
    }

    const validated = {
      event_type: data.event_type,
      status: data.status,
      instructor_id: data.instructor_id ? Number(data.instructor_id) : undefined,
      actual_instructor_id: data.actual_instructor_id
        ? Number(data.actual_instructor_id)
        : undefined,
      min_participants: data.min_participants ? Number(data.min_participants) : undefined,
      max_participants: data.max_participants ? Number(data.max_participants) : undefined,
      cancellation_reason: data.cancellation_reason,
    };

    Object.keys(validated).forEach((k) => validated[k] === undefined && delete validated[k]);

    const response = await calendarApi.put(`/events/${id}`, validated);
    return response.data;
  },

  getParticipants: async (id) => {
    const response = await calendarApi.get(`/events/${id}/participants`);
    return response.data;
  },

  addParticipant: async (eventId, participant) => {
    const validated = {
      rider_id: Number(participant.rider_id),
      horse_id: participant.horse_id ? Number(participant.horse_id) : null,
      horse_assignment_type: participant.horse_assignment_type,
    };
    const response = await calendarApi.post(`/events/${eventId}/participants`, validated);
    return response.data;
  },

  removeParticipant: async (eventId, participantId) => {
    const response = await calendarApi.delete(`/events/${eventId}/participants/${participantId}`);
    return response.data;
  },

  getLessonTypes: () => EVENT_TYPES,
  getLessonStatuses: () => EVENT_STATUSES,
};

/**
 * Planning Slots API - /calendar/slots
 */
export const slotsApi = {
  getAll: async (params = {}) => {
    const response = await calendarApi.get('/slots', { params });
    return response.data;
  },

  create: async (data) => {
    const validated = {
      start_time: data.start_time,
      end_time: data.end_time,
      is_all_day: data.is_all_day || false,
      slot_status: data.slot_status,
      actual_instructor_id: data.actual_instructor_id ? Number(data.actual_instructor_id) : null,
      cancellation_reason: data.cancellation_reason || null,
    };

    if (!Object.values(PLANNING_SLOT_TYPES).includes(validated.slot_status)) {
      throw new Error('Status de slot invalide');
    }

    if (new Date(validated.end_time) <= new Date(validated.start_time)) {
      throw new Error('La date de fin doit être après la date de début');
    }

    const response = await calendarApi.post('/slots', validated);
    return response.data;
  },

  getSlotTypes: () => PLANNING_SLOT_TYPES,
};

export const recurrencesApi = {
  getAll: async () => {
    const response = await calendarApi.get('/recurrences');
    return response.data;
  },

  getById: async (id) => {
    const response = await calendarApi.get(`/recurrences/${id}`);
    return response.data;
  },

  create: async (data) => {
    const validated = {
      frequency: data.frequency,
      interval: data.interval ?? 1,
      by_week_days: Array.isArray(data.by_week_days) ? data.by_week_days : null,
      start_time: data.start_time ?? null,
      end_time: data.end_time ?? null,
    };
    const response = await calendarApi.post('/recurrences', validated);
    return response.data;
  },

  update: async (id, data) => {
    const validated = { ...data };
    const response = await calendarApi.put(`/recurrences/${id}`, validated);
    return response.data;
  },

  delete: async (id) => {
    const response = await calendarApi.delete(`/recurrences/${id}`);
    return response.data;
  },
};

export default { eventsApi, slotsApi, recurrencesApi };
```

---

## 📄 calendarService.js
**Path:** `calendarService.js`

```
import { format } from 'date-fns';
import { calendarWeekApi } from './calendarWeekApi';

/**
 * Calendar Service
 * Business entry point for hooks
 */
export const calendarService = {
  getWeekData: async (weekStartDate) => {
    const formatted = format(weekStartDate, 'yyyy-MM-dd');
    return calendarWeekApi.getWeek(formatted);
  },
};
```

---

## 📄 calendarWeekApi.js
**Path:** `calendarWeekApi.js`

```
import { calendarApi } from './calendarApi';

/**
 * Calendar – Week endpoints
 * This is what useCalendarView consumes
 */
export const calendarWeekApi = {
  /**
   * GET /calendar/week
   */
  getWeek: async (startDate) => {
    const response = await calendarApi.get('/week', {
      params: { start: startDate },
    });
    return response.data;
  },
};
```

---

## 📄 eventsApi.js
**Path:** `eventsApi.js`

```
import { calendarApi } from './calendarApi';
import { EVENT_TYPES, SLOT_STATUSES } from '../lib/domains/events';

export const eventsApi = {
  getById: async (id) => {
    const response = await calendarApi.get(`/events/${id}`);
    return response.data;
  },

  create: async (data) => {
    if (!Object.values(EVENT_TYPES).includes(data.event_type)) {
      throw new Error('Type d’événement invalide');
    }

    const payload = {
      planning_slot_id: Number(data.planning_slot_id),
      event_type: data.event_type,
      status: data.status || SLOT_STATUSES.SCHEDULED,
      instructor_id: Number(data.instructor_id),
      actual_instructor_id: data.actual_instructor_id ? Number(data.actual_instructor_id) : null,
      min_participants: data.min_participants ?? null,
      max_participants: data.max_participants ?? null,
      cancellation_reason: data.cancellation_reason ?? null,
    };

    const response = await calendarApi.post('/events', payload);
    return response.data;
  },

  update: async (id, data) => {
    if (data.event_type && !Object.values(EVENT_TYPES).includes(data.event_type)) {
      throw new Error('Type d’événement invalide');
    }

    const payload = {
      event_type: data.event_type,
      status: data.status,
      instructor_id: data.instructor_id ? Number(data.instructor_id) : undefined,
      actual_instructor_id: data.actual_instructor_id
        ? Number(data.actual_instructor_id)
        : undefined,
      min_participants: data.min_participants,
      max_participants: data.max_participants,
      cancellation_reason: data.cancellation_reason,
    };

    Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);

    const response = await calendarApi.put(`/events/${id}`, payload);
    return response.data;
  },

  getParticipants: async (id) => {
    const response = await calendarApi.get(`/events/${id}/participants`);
    return response.data;
  },

  addParticipant: async (eventId, participant) => {
    const payload = {
      rider_id: Number(participant.rider_id),
      horse_id: participant.horse_id ? Number(participant.horse_id) : null,
      horse_assignment_type: participant.horse_assignment_type,
    };

    const response = await calendarApi.post(`/events/${eventId}/participants`, payload);
    return response.data;
  },

  removeParticipant: async (eventId, participantId) => {
    const response = await calendarApi.delete(`/events/${eventId}/participants/${participantId}`);
    return response.data;
  },
};
```

---

## 📄 eventService.js
**Path:** `eventService.js`

```
/**
 * Lesson Service - Updated for DB schema
 */
import { EVENT_STATUSES, EVENT_TYPES } from '../lib/domain/domain-constants.js';
import { api, createCrudOperations } from './apiService.js';

const eventService = {
  ...createCrudOperations('events'),

  create: async (data) => {
    const eventType = EVENT_TYPES.find((t) => t.value === data.event_type);
    if (!eventType) throw new Error('Type de leçon invalide');

    const validated = {
      planning_slot_id: Number(data.planning_slot_id),
      event_type: data.event_type,
      status: data.status || EVENT_STATUSES.SCHEDULED,
      instructor_id: Number(data.instructor_id),
      actual_instructor_id: data.actual_instructor_id ? Number(data.actual_instructor_id) : null,
      min_participants: data.min_participants ? Number(data.min_participants) : null,
      max_participants: data.max_participants
        ? Number(data.max_participants)
        : eventType.defaultMax,
      cancellation_reason: data.cancellation_reason || null,
    };

    const response = await api.post('/events', validated);
    return response.data;
  },

  update: async (id, data) => {
    if (data.event_type && !EVENT_TYPES.find((t) => t.value === data.event_type)) {
      throw new Error('Type de leçon invalide');
    }

    const validated = {
      event_type: data.event_type,
      status: data.status,
      instructor_id: data.instructor_id ? Number(data.instructor_id) : undefined,
      actual_instructor_id: data.actual_instructor_id
        ? Number(data.actual_instructor_id)
        : undefined,
      min_participants: data.min_participants ? Number(data.min_participants) : undefined,
      max_participants: data.max_participants ? Number(data.max_participants) : undefined,
      cancellation_reason: data.cancellation_reason,
    };

    Object.keys(validated).forEach((k) => validated[k] === undefined && delete validated[k]);

    const response = await api.put(`/events/${id}`, validated);
    return response.data;
  },

  getParticipants: async (id) => {
    const response = await api.get(`/events/${id}/participants`);
    return response.data;
  },

  addParticipant: async (eventId, participant) => {
    const validated = {
      rider_id: Number(participant.rider_id),
      horse_id: participant.horse_id ? Number(participant.horse_id) : null,
      horse_assignment_type: participant.horse_assignment_type,
    };
    const response = await api.post(`/events/${eventId}/participants`, validated);
    return response.data;
  },

  removeParticipant: async (eventId, participantId) => {
    const response = await api.delete(`/events/${eventId}/participants/${participantId}`);
    return response.data;
  },

  getByDateRange: async (startDate, endDate) => {
    const response = await api.get('/calendar/events', {
      params: { start_date: startDate, end_date: endDate },
    });
    return response.data;
  },

  getLessonTypes: () => EVENT_TYPES,
  getLessonStatuses: () => EVENT_STATUSES,
};

export default eventService;
```

---

## 📄 horseService.js
**Path:** `horseService.js`

```
/**
 * Horse Service - Handles all horse-related API operations
 */
import { HORSE_TYPES, OWNER_TYPES } from '../lib/domain/domain-constants.js';
import { validateHorseForm } from '../lib/helpers/index.js';
import { api, createCrudOperations } from './apiService.js';

const horseService = {
  // Basic CRUD operations
  ...createCrudOperations('horses'),

  /**
   * Create horse with validation
   * @param {Object} data - Horse data
   * @returns {Promise<Object>} Created horse
   */
  create: async (data) => {
    const validation = validateHorseForm(data);
    if (!validation.isValid) {
      throw new Error(JSON.stringify(validation.errors));
    }

    // Validate ownership_type
    if (!Object.values(OWNER_TYPES).includes(data.ownership_type)) {
      throw new Error(
        JSON.stringify({
          ownership_type: 'Le propriétaire doit être "laury", "private_owner", "club" ou "other"',
        })
      );
    }

    // Validate kind
    if (!Object.values(HORSE_TYPES).includes(data.kind)) {
      throw new Error(
        JSON.stringify({
          kind: 'Le type doit être "horse" ou "pony"',
        })
      );
    }

    const validatedData = {
      name: data.name.trim(),
      kind: data.kind,
      ownership_type: data.ownership_type,
      activity_start_date: data.activity_start_date || null,
      activity_end_date: data.activity_end_date || null,
    };

    const response = await api.post('/horses', validatedData);
    return response.data;
  },

  /**
   * Update horse with validation
   * @param {number} id - Horse ID
   * @param {Object} data - Horse data
   * @returns {Promise<Object>} Updated horse
   */
  update: async (id, data) => {
    const validation = validateHorseForm(data);
    if (!validation.isValid) {
      throw new Error(JSON.stringify(validation.errors));
    }

    // Validate ownership_type if provided
    if (data.ownership_type && !Object.values(OWNER_TYPES).includes(data.ownership_type)) {
      throw new Error(
        JSON.stringify({
          ownership_type: 'Le propriétaire doit être "laury", "private_owner", "club" ou "other"',
        })
      );
    }

    // Validate kind if provided
    if (data.kind && !Object.values(HORSE_TYPES).includes(data.kind)) {
      throw new Error(
        JSON.stringify({
          kind: 'Le type doit être "horse" ou "pony"',
        })
      );
    }

    const validatedData = {
      name: data.name?.trim(),
      kind: data.kind,
      ownership_type: data.ownership_type,
      activity_start_date: data.activity_start_date || null,
      activity_end_date: data.activity_end_date || null,
    };

    // Remove undefined values
    Object.keys(validatedData).forEach(
      (key) => validatedData[key] === undefined && delete validatedData[key]
    );

    const response = await api.put(`/horses/${id}`, validatedData);
    return response.data;
  },

  /**
   * Get riders for a horse
   * @param {number} id - Horse ID
   * @returns {Promise<Array>} Horse riders
   */
  getRiders: async (id) => {
    const response = await api.get(`/horses/${id}/riders`);
    return response.data;
  },

  /**
   * Get horse types
   * @returns {Array} Horse types
   */
  getHorseTypes: () => Object.values(HORSE_TYPES),

  /**
   * Get owner types
   * @returns {Array} Owner types
   */
  getOwnerTypes: () => Object.values(OWNER_TYPES),
};

export default horseService;
```

---

## 📄 index.js
**Path:** `index.js`

```
/**
 * Services - Main Export
 */

// Core API service
export { api, createCrudOperations } from './apiService.js';

// Domain-specific services
export { default as horseService } from './horseService.js';
export { default as riderService } from './riderService.js';
export { default as eventService } from './eventService.js';
export { default as packageService } from './packageService.js';
export { default as pairingService } from './pairingService.js';
```

---

## 📄 packageService.js
**Path:** `packageService.js`

```
import { api, createCrudOperations } from './apiService.js';

const packageService = {
  ...createCrudOperations('packages'),

  create: async (data) => {
    const payload = {
      rider_id: Number(data.rider_id),
      services_per_week: Number(data.services_per_week),
      group_lessons_per_week: Number(data.group_lessons_per_week),
      is_active: data.is_active ?? true,
    };

    try {
      const response = await api.post('/packages', payload);
      return response.data;
    } catch (error) {
      if (error.response?.status === 409) {
        const e = new Error(error.response.data.message);
        e.code = 'ACTIVE_PACKAGE_EXISTS';
        e.existingPackage = error.response.data.existingPackage;
        throw e;
      }
      throw error;
    }
  },

  createForRider: async (riderId, data) => {
    return packageService.create({
      ...data,
      rider_id: riderId,
    });
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/packages/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting package:', error);
      throw error;
    }
  },

  getByRider: async (riderId) => {
    const response = await api.get(`/riders/${riderId}/packages`);
    return response.data;
  },
};

export default packageService;
```

---

## 📄 pairingService.js
**Path:** `pairingService.js`

```
import {
  RIDER_HORSE_LINK_TYPE,
  isValidLoanDays,
  isValidLoanDaysPerWeek,
} from '../lib/domain/domain-constants.js';
import { api, createCrudOperations } from './apiService.js';

const pairingService = {
  ...createCrudOperations('pairings'),

  _normalizePayload: (data) => {
    const payload = {
      rider_id: data.rider_id !== undefined ? Number(data.rider_id) : undefined,
      horse_id: data.horse_id !== undefined ? Number(data.horse_id) : undefined,
      pairing_start_date: data.pairing_start_date ?? undefined,
      pairing_end_date: data.pairing_end_date ?? undefined,
      link_type: data.link_type ?? RIDER_HORSE_LINK_TYPE.OWN,
      loan_days_per_week:
        data.loan_days_per_week !== undefined ? Number(data.loan_days_per_week) : undefined,
      loan_days: Array.isArray(data.loan_days) ? data.loan_days : undefined,
    };

    // link_type validation
    if (!Object.values(RIDER_HORSE_LINK_TYPE).includes(payload.link_type)) {
      delete payload.link_type;
    }

    // loan_days_per_week validation
    if (payload.link_type === RIDER_HORSE_LINK_TYPE.LOAN) {
      if (!isValidLoanDaysPerWeek(payload.loan_days_per_week)) {
        delete payload.loan_days_per_week;
      }
      if (!isValidLoanDays(payload.loan_days)) {
        delete payload.loan_days;
      }
    } else {
      delete payload.loan_days_per_week;
      delete payload.loan_days;
    }

    Object.keys(payload).forEach((key) => payload[key] === undefined && delete payload[key]);
    return payload;
  },

  create: async (data) => {
    const payload = pairingService._normalizePayload(data);
    if (!payload.rider_id || !payload.horse_id) {
      throw new Error('rider_id et horse_id sont requis');
    }
    const response = await api.post('/pairings', payload);
    return response.data;
  },

  update: async (id, data) => {
    const payload = pairingService._normalizePayload(data);
    if (!id || isNaN(Number(id))) throw new Error('ID de pairing invalide');
    const response = await api.put(`/pairings/${id}`, payload);
    return response.data;
  },

  getByRider: async (riderId) => {
    if (!riderId || isNaN(Number(riderId))) throw new Error('ID cavalier invalide');
    const response = await api.get(`/riders/${riderId}/horses`);
    return response.data;
  },

  getByHorse: async (horseId) => {
    if (!horseId || isNaN(Number(horseId))) throw new Error('ID cheval invalide');
    const response = await api.get(`/horses/${horseId}/riders`);
    return response.data;
  },
};

export default pairingService;
```

---

## 📄 riderService.js
**Path:** `riderService.js`

```
/**
 * Rider Service - Handles all rider-related API operations
 */
import { RIDER_TYPES } from '../lib/domain/domain-constants.js';
import { validateRiderForm } from '../lib/helpers/index.js';
import { api, createCrudOperations } from './apiService.js';

const riderService = {
  // Basic CRUD operations
  ...createCrudOperations('riders'),

  /**
   * Create rider with validation
   * @param {Object} data - Rider data
   * @returns {Promise<Object>} Created rider
   */
  create: async (data) => {
    const validation = validateRiderForm(data);
    if (!validation.isValid) {
      throw new Error(JSON.stringify(validation.errors));
    }

    // Validate rider_type
    if (!Object.values(RIDER_TYPES).includes(data.rider_type)) {
      throw new Error(
        JSON.stringify({
          rider_type: 'Le type doit être "owner", "club" ou "loaner"',
        })
      );
    }

    const validatedData = {
      name: data.name.trim(),
      rider_type: data.rider_type,
      phone: data.phone?.trim() || null,
      email: data.email?.trim().toLowerCase() || null,
      activity_start_date: data.activity_start_date || null,
      activity_end_date: data.activity_end_date || null,
    };

    const response = await api.post('/riders', validatedData);
    return response.data;
  },

  /**
   * Update rider with validation
   * @param {number} id - Rider ID
   * @param {Object} data - Rider data
   * @returns {Promise<Object>} Updated rider
   */
  update: async (id, data) => {
    const validation = validateRiderForm(data);
    if (!validation.isValid) {
      throw new Error(JSON.stringify(validation.errors));
    }

    // Validate rider_type if provided
    if (data.rider_type && !Object.values(RIDER_TYPES).includes(data.rider_type)) {
      throw new Error(
        JSON.stringify({
          rider_type: 'Le type doit être "owner", "club" ou "loaner"',
        })
      );
    }

    const validatedData = {
      name: data.name?.trim(),
      rider_type: data.rider_type,
      phone: data.phone?.trim() || null,
      email: data.email?.trim().toLowerCase() || null,
      activity_start_date: data.activity_start_date || null,
      activity_end_date: data.activity_end_date || null,
    };

    // Remove undefined values
    Object.keys(validatedData).forEach(
      (key) => validatedData[key] === undefined && delete validatedData[key]
    );

    const response = await api.put(`/riders/${id}`, validatedData);
    return response.data;
  },

  /**
   * Get horses for a rider
   * @param {number} id - Rider ID
   * @returns {Promise<Array>} Rider horses
   */
  getHorses: async (id) => {
    const response = await api.get(`/riders/${id}/horses`);
    return response.data;
  },

  /**
   * Get packages for a rider
   * @param {number} id - Rider ID
   * @returns {Promise<Array>} Rider packages
   */
  getPackages: async (id) => {
    const response = await api.get(`/riders/${id}/packages`);
    return response.data;
  },

  /**
   * Create package for a rider
   * @param {number} riderId - Rider ID
   * @param {Object} packageData - Package data
   * @returns {Promise<Object>} Created package
   */
  createPackage: async (riderId, packageData) => {
    const validatedData = {
      rider_id: Number(riderId),
      services_per_week: Number(packageData.services_per_week) || 0,
      group_lessons_per_week: Number(packageData.group_lessons_per_week) || 0,
      is_active: packageData.is_active !== undefined ? Boolean(packageData.is_active) : true,
      activity_start_date: packageData.activity_start_date || null,
      activity_end_date: packageData.activity_end_date || null,
    };

    const response = await api.post('/packages', validatedData);
    return response.data;
  },

  /**
   * Get rider types
   * @returns {Array} Rider types
   */
  getRiderTypes: () => Object.values(RIDER_TYPES),
};

export default riderService;
```

---

## 📄 slotsApi.js
**Path:** `slotsApi.js`

```
import { calendarApi } from './calendarApi';

export const slotsApi = {
  create: async (data) => {
    const payload = {
      start_time: data.start_time,
      end_time: data.end_time,
      is_all_day: data.is_all_day || false,
      cancellation_reason: data.cancellation_reason ?? null,
      actual_instructor_id: data.actual_instructor_id ? Number(data.actual_instructor_id) : null,
    };

    if (new Date(payload.end_time) <= new Date(payload.start_time)) {
      throw new Error('La date de fin doit être après la date de début');
    }

    const response = await calendarApi.post('/slots', payload);
    return response.data;
  },
};
```

---

