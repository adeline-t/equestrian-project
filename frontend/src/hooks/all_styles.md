# 📁 Project Files Export

Generated on: Fri Jan 23 06:07:44 CET 2026

## 📄 index.js

**Path:** `index.js`

```
/**
 * Centralized export for all custom hooks (barrel file)
 */

// Calendar & Events
export * from './useCalendarView.js';
export * from './useCreateEvent.js';
export * from './useEventBlockedCreate.js';
export * from './useEventDetails.js';
export * from './useEventEdit.js';
export * from './useBlockedEventEdit.js';
export * from './useScheduledEvents.js';
export * from './useEventSlotDetails.js';

// Horses
export * from './useHorseActions.js';
export * from './useHorseForm.js';
export * from './useHorseRiders.js';
export * from './useHorsesList.js';
export * from './useHorseCard.js';

// Packages
export * from './usePackageActions.js';
export * from './usePackageForm.js';

// Pairings
export * from './usePairingActions.js';
export * from './usePairingForm.js';

// Riders
export * from './useRiderCard.js';
export * from './useRiderForm.js';
export * from './useRidersList.js';
export * from './useRiderHorses.js';
```

---

## 📄 useBlockedEventEdit.js

**Path:** `useBlockedEventEdit.js`

```
import { useState, useEffect } from 'react';
import { calendarService } from '../services/calendarService';
import { formatTimeForInput, formatTimeForDatabase } from '../lib/helpers/formatters';

/**
 * Hook pour gérer l'édition d'un événement bloqué
 */
export function useBlockedEventEdit(slotId) {
  const [slot, setSlot] = useState(null);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const refresh = async () => {
    setLoading(true);
    try {
      const fullSlot = await calendarService.getSlotFullDetails(slotId);
      setSlot(fullSlot.slot);
      setEvent(fullSlot.event);

      setEditData({
        name: fullSlot.event?.name || '',
        description: fullSlot.event?.description || '',
        actual_instructor_id: fullSlot.slot?.actual_instructor_id || 1,
        slot_date: fullSlot.slot?.slot_date || '',
        start_time: formatTimeForInput(fullSlot.slot?.start_time) || '09:00',
        end_time: formatTimeForInput(fullSlot.slot?.end_time) || '10:00',
        is_all_day: fullSlot.slot?.is_all_day || false,
        slot_status: fullSlot.slot?.slot_status || 'scheduled',
        cancellation_reason: fullSlot.slot?.cancellation_reason || '',
      });
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement du slot');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, [slotId]);

  const startEdit = () => {
    setIsEditing(true);
    setEditError(null);
  };

  const cancelEdit = () => {
    if (slot && event) {
      setEditData({
        name: event.name || '',
        description: event.description || '',
        actual_instructor_id: slot.actual_instructor_id || 1,
        slot_date: slot.slot_date || '',
        start_time: formatTimeForInput(slot.start_time) || '09:00',
        end_time: formatTimeForInput(slot.end_time) || '10:00',
        is_all_day: slot.is_all_day || false,
        slot_status: slot.slot_status || 'scheduled',
        cancellation_reason: slot.cancellation_reason || '',
      });
    }
    setEditError(null);
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const validateTimes = () => {
    if (!editData.is_all_day) {
      const startTime = formatTimeForInput(editData.start_time);
      const endTime = formatTimeForInput(editData.end_time);

      if (startTime >= endTime) {
        setEditError('L heure de début doit être inférieure à l heure de fin.');
        return false;
      }
    }
    return true;
  };

  const saveEdit = async () => {
    if (!validateTimes()) return false;

    try {
      setSaving(true);

      const slotPayload = {
        slot_date: editData.slot_date,
        actual_instructor_id: editData.actual_instructor_id,
        is_all_day: editData.is_all_day,
        slot_status: editData.slot_status,
        cancellation_reason: editData.cancellation_reason || null,
      };

      if (!editData.is_all_day) {
        slotPayload.start_time = formatTimeForDatabase(editData.start_time);
        slotPayload.end_time = formatTimeForDatabase(editData.end_time);
      } else {
        slotPayload.start_time = null;
        slotPayload.end_time = null;
      }

      await calendarService.updateSlot(slot.id, slotPayload);

      if (event) {
        const eventPayload = {
          name: editData.name,
          description: editData.description || null,
          instructor_id: editData.actual_instructor_id,
        };
        await calendarService.updateEvent(event.id, eventPayload);
      }

      await refresh();
      setIsEditing(false);
      setEditError(null);
      return true;
    } catch (err) {
      setEditError(err.message || 'Erreur lors de la sauvegarde');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const deleteSlot = async () => {
    try {
      setDeleting(true);
      setDeleteError(null);
      await calendarService.deleteSlot(slotId);
      return true;
    } catch (err) {
      setDeleteError(err.message || 'Erreur lors de la suppression');
      return false;
    } finally {
      setDeleting(false);
    }
  };

  return {
    slot,
    event,
    loading,
    error,
    isEditing,
    editData,
    saving,
    editError,
    deleting,
    deleteError,
    startEdit,
    cancelEdit,
    handleChange,
    saveEdit,
    deleteSlot,
    refresh,
  };
}
```

---

## 📄 useCalendarView.js

**Path:** `useCalendarView.js`

```
import { useState, useEffect, useCallback, useMemo } from 'react';
import { addWeeks, subWeeks, startOfWeek, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { EVENT_TYPES, SLOT_STATUSES, isBlockedEvent } from '../lib/domain/events';
import { calendarService } from '../services/calendarService';
import { timeToMinutes, formatTimeForInput } from '../lib/helpers/formatters';

/**
 * Normalize slot times for UI display (HH:mm from HH:mm:ss)
 */
const normalizeSlotTimes = (slot) => {
  if (!slot) return slot;

  const start_time = formatTimeForInput(slot.start_time) || '09:00';
  const end_time = formatTimeForInput(slot.end_time) || '10:00';
  const duration_minutes =
    slot.duration_minutes ?? timeToMinutes(end_time) - timeToMinutes(start_time);

  return { ...slot, start_time, end_time, duration_minutes };
};

/**
 * Custom hook for calendar view functionality
 * Manages week navigation, data loading, and slot interactions
 */
export function useCalendarView() {
  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );

  const [weekData, setWeekData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [showCreateBlockedModal, setShowCreateBlockedModal] = useState(false);
  const [showScheduledModal, setShowScheduledModal] = useState(false);

  const [createEventData, setCreateEventData] = useState(null);

  const [filters, setFilters] = useState({ eventType: '', status: '' });

  /* -------------------------------------------------------
   * LOAD WEEK DATA
   * ----------------------------------------------------- */
  const loadWeekData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await calendarService.getWeekData(currentWeekStart);
      // Normalize slot times for UI display and filter out cancelled slots
      const enrichedDays = (data.days || []).map((day) => ({
        ...day,
        slots: (day.slots || [])
          .filter((slot) => slot.slot_status !== SLOT_STATUSES.CANCELLED)
          .map(normalizeSlotTimes),
      }));
      setWeekData({ ...data, days: enrichedDays });
      console.debug('[loadWeekData]] data', {
        data,
      });
      console.debug('[loadWeekData]] enrichedDays', {
        enrichedDays,
      });
    } catch (err) {
      console.error('Error loading week data:', err);
      setError(err.response?.data?.message || err.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }, [currentWeekStart]);

  useEffect(() => {
    loadWeekData();
  }, [loadWeekData]);

  /* -------------------------------------------------------
   * NAVIGATION
   * ----------------------------------------------------- */
  const handlePrevWeek = useCallback(() => setCurrentWeekStart((prev) => subWeeks(prev, 1)), []);
  const handleNextWeek = useCallback(() => setCurrentWeekStart((prev) => addWeeks(prev, 1)), []);
  const handleToday = useCallback(
    () => setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 })),
    []
  );

  /* -------------------------------------------------------
   * SLOT / EVENT MODAL HANDLERS
   * ----------------------------------------------------- */
  const handleSlotClick = useCallback((slot) => {
    setSelectedSlot(slot);
    setShowSlotModal(true);
  }, []);

  const handleCreateEvent = useCallback(
    (selectionData) => {
      setCreateEventData({
        date: selectionData?.date || format(currentWeekStart, 'yyyy-MM-dd'),
        start_time: selectionData?.start_time || '09:00',
        end_time: selectionData?.end_time || '10:00',
      });
      setShowCreateEventModal(true);
    },
    [currentWeekStart]
  );

  const handleCreateBlockedTime = useCallback(() => {
    setCreateEventData({
      date: format(new Date(), 'yyyy-MM-dd'),
      start_time: '09:00',
      end_time: '10:00',
    });
    setShowCreateBlockedModal(true);
  }, []);

  const handleShowScheduled = useCallback(() => {
    setShowScheduledModal(true);
  }, []);

  const closeSlotModal = useCallback(() => {
    setShowSlotModal(false);
    setSelectedSlot(null);
  }, []);

  const closeCreateEventModal = useCallback(() => {
    setShowCreateEventModal(false);
    setCreateEventData(null);
  }, []);

  const closeCreateBlockedModal = useCallback(() => {
    setShowCreateBlockedModal(false);
    setCreateEventData(null);
  }, []);

  const closeScheduledModal = useCallback(() => {
    setShowScheduledModal(false);
  }, []);

  const handleModalSuccess = useCallback(() => {
    loadWeekData();
    closeSlotModal();
    closeCreateEventModal();
    closeCreateBlockedModal();
    closeScheduledModal();
  }, [
    loadWeekData,
    closeSlotModal,
    closeCreateEventModal,
    closeCreateBlockedModal,
    closeScheduledModal,
  ]);

  /* -------------------------------------------------------
   * FILTER HANDLERS
   * ----------------------------------------------------- */
  const handleFilterChange = useCallback((filterKey, value) => {
    setFilters((prev) => ({ ...prev, [filterKey]: value }));
  }, []);
  const clearFilters = useCallback(() => setFilters({ eventType: '', status: '' }), []);

  /* -------------------------------------------------------
   * COMPUTED VALUES
   * ----------------------------------------------------- */
  const weekTitle = useMemo(() => {
    const weekEnd = addWeeks(currentWeekStart, 1);
    const startDay = format(currentWeekStart, 'd MMM', { locale: fr });
    const endDay = format(new Date(weekEnd.getTime() - 1), 'd MMM yyyy', { locale: fr });
    return `Semaine du ${startDay} au ${endDay}`;
  }, [currentWeekStart]);

  const filteredWeekData = useMemo(() => {
    if (!weekData?.days) return null;
    if (!filters.eventType && !filters.status) return weekData;

    const filteredDays = weekData.days.map((day) => ({
      ...day,
      slots: day.slots.filter((slot) => {
        let matches = true;
        const eventType = isBlockedEvent(slot.events);

        if (filters.eventType && eventType !== filters.eventType) matches = false;
        if (filters.status && slot.slot_status !== filters.status) matches = false;
        return matches;
      }),
    }));

    return { ...weekData, days: filteredDays };
  }, [weekData, filters]);

  const stats = useMemo(() => {
    if (!weekData?.days)
      return {
        confirmed: 0,
        scheduled: 0,
        privateLessons: 0,
        groupedLessons: 0,
        services: 0,
        blocked: 0,
        total: 0,
      };
    const result = {
      confirmed: 0,
      scheduled: 0,
      privateLessons: 0,
      groupedLessons: 0,
      services: 0,
      blocked: 0,
      total: 0,
    };

    weekData.days.forEach((day) =>
      day.slots?.forEach((slot) => {
        result.total++;
        if (slot.slot_status === SLOT_STATUSES.CONFIRMED) result.confirmed++;
        if (slot.slot_status === SLOT_STATUSES.SCHEDULED) result.scheduled++;

        const eventType = slot.events?.event_type ?? EVENT_TYPES.BLOCKED;

        switch (eventType) {
          case EVENT_TYPES.PRIVATE_LESSON:
            result.privateLessons++;
            break;
          case EVENT_TYPES.GROUPED_LESSON:
            result.groupedLessons++;
            break;
          case EVENT_TYPES.SERVICE:
            result.services++;
            break;
          case EVENT_TYPES.BLOCKED:
            result.blocked++;
            break;
        }
      })
    );

    return result;
  }, [weekData]);

  const hasActiveFilters = useMemo(() => Boolean(filters.eventType || filters.status), [filters]);

  /* -------------------------------------------------------
   * RETURN API
   * ----------------------------------------------------- */
  return {
    weekData: filteredWeekData,
    loading,
    error,
    selectedSlot,
    createEventData,
    showSlotModal,
    showCreateEventModal,
    showCreateBlockedModal,
    showScheduledModal,
    filters,
    hasActiveFilters,
    weekTitle,
    stats,
    handlePrevWeek,
    handleNextWeek,
    handleToday,
    handleSlotClick,
    handleCreateEvent,
    handleCreateBlockedTime,
    handleShowScheduled,
    handleFilterChange,
    clearFilters,
    closeSlotModal,
    closeCreateEventModal,
    closeCreateBlockedModal,
    closeScheduledModal,
    handleModalSuccess,
    loadWeekData,
    currentWeekStart,
  };
}
```

---

## 📄 useEventBlockedCreate.js

**Path:** `useEventBlockedCreate.js`

```
import { useState, useCallback } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { calendarService } from '../services/calendarService';
import { EVENT_TYPES, SLOT_STATUSES } from '../lib/domain/events';
import { getTodayISO } from '../lib/helpers/index.js';

/**
 * Hook to manage blocked time creation
 * Uses Event → Slot order (event_id required in planning_slots)
 */
export function useEventBlockedCreate() {
  const [formData, setFormData] = useState({
    slot_date: getTodayISO(),
    start_time: '09:00',
    end_time: '10:00',
    is_all_day: false,
    slot_status: SLOT_STATUSES.SCHEDULED,
    event_type: EVENT_TYPES.BLOCKED,
    instructor_id: 1,
    name: '',
    description: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;

      // Auto-generate name if user hasn't set a custom one
      if (name !== 'name' && !formData.name) {
        const dateStr = format(new Date(formData.slot_date), 'dd/MM', { locale: fr });
        const autoName = formData.is_all_day
          ? `Bloqué - ${dateStr}`
          : `Bloqué - ${dateStr} ${formData.start_time}`;
        setFormData((prev) => ({ ...prev, [name]: value, name: autoName }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    },
    [formData.name, formData.slot_date, formData.start_time, formData.is_all_day]
  );

  const resetForm = useCallback((initialDate) => {
    setFormData({
      slot_date: initialDate || getTodayISO(),
      start_time: '09:00',
      end_time: '10:00',
      is_all_day: false,
      slot_status: SLOT_STATUSES.SCHEDULED,
      event_type: EVENT_TYPES.BLOCKED,
      instructor_id: 1,
      name: '',
      description: '',
    });
    setError(null);
  }, []);

  const createBlockedTime = useCallback(async () => {
    setError(null);

    try {
      setLoading(true);

      // Generate final name
      const dateStr = format(new Date(formData.slot_date), 'dd/MM', { locale: fr });
      const finalName =
        formData.name ||
        (formData.is_all_day
          ? `Bloqué - ${dateStr}`
          : `Bloqué - ${dateStr} ${formData.start_time}`);

      // ⚠️ STEP 1: Create EVENT first (required for foreign key constraint)
      const eventPayload = {
        event_type: EVENT_TYPES.BLOCKED,
        instructor_id: formData.instructor_id,
        min_participants: 0,
        max_participants: 0,
        name: finalName,
        description: formData.description || null,
      };

      console.log('📤 Blocked Event Payload:', eventPayload);

      const eventResponse = await calendarService.createEvent(eventPayload);
      const eventId = eventResponse.id;

      console.log('✅ Blocked Event created:', eventId);

      // ⚠️ STEP 2: Create SLOT with event_id (required FK)
      const slotPayload = {
        event_id: eventId, // ⚠️ CRITICAL: Required foreign key
        slot_date: formData.slot_date,
        start_time: formData.is_all_day ? '00:00:00' : `${formData.start_time}:00`,
        end_time: formData.is_all_day ? '23:59:59' : `${formData.end_time}:00`,
        is_all_day: formData.is_all_day,
        slot_status: formData.slot_status || SLOT_STATUSES.SCHEDULED,
        actual_instructor_id: formData.instructor_id,
        cancellation_reason: null,
      };

      console.log('📤 Blocked Slot Payload:', slotPayload);

      const slotResponse = await calendarService.createSlot(slotPayload);
      const slotId = slotResponse.id;

      console.log('✅ Blocked Slot created:', slotId);

      return { success: true, slotId, eventId };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Erreur lors de la création';
      setError(errorMsg);
      console.error('❌ Blocked time creation error:', err);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [formData]);

  return {
    formData,
    loading,
    error,
    handleChange,
    resetForm,
    createBlockedTime,
    setFormData,
  };
}
```

---

## 📄 useCreateEvent.js

**Path:** `useCreateEvent.js`

```
import { useState, useCallback } from 'react';
import { format } from 'date-fns';
import { calendarService } from '../services/calendarService';
import { EVENT_TYPES, SLOT_STATUSES } from '../lib/domain/events';
import { formatTimeForDatabase, calculateDurationMinutes } from '../lib/helpers/formatters';

const validateEventForm = (formData, participants) => {
  const errors = {};

  // Required fields validation
  if (!formData.event_date) errors.event_date = 'La date est requise';
  if (!formData.start_time && !formData.is_all_day)
    errors.start_time = "L'heure de début est requise";
  if (!formData.end_time && !formData.is_all_day) errors.end_time = "L'heure de fin est requise";
  if (!formData.event_type) errors.event_type = "Le type d'événement est requis";
  if (!formData.slot_status) errors.slot_status = 'Le statut est requis';

  // Time validation (only if not all-day)
  if (!formData.is_all_day && formData.start_time && formData.end_time) {
    const duration = calculateDurationMinutes(formData.start_time, formData.end_time);
    if (duration <= 0) {
      errors.end_time = "L'heure de fin doit être après l'heure de début";
    }
  }

  // Participants validation (only if not blocked)
  if (formData.event_type !== EVENT_TYPES.BLOCKED) {
    const min = parseInt(formData.min_participants || 0);
    const max = parseInt(formData.max_participants || 0);
    if (min > max) errors.min_participants = 'Le minimum ne peut pas dépasser le maximum';
    if (participants && participants.length > max)
      errors.participants = `Il y a ${participants.length} participants mais le maximum est de ${max}`;
  }

  return { isValid: Object.keys(errors).length === 0, errors };
};

/**
 * Hook to manage event form data and creation logic
 */
export function useCreateEvent(initialDate, initialStartTime, initialEndTime) {
  const [formData, setFormData] = useState(() => ({
    event_date: initialDate || format(new Date(), 'yyyy-MM-dd'),
    start_time: initialStartTime || '09:00',
    end_time: initialEndTime || '10:00',
    is_all_day: false,
    slot_status: SLOT_STATUSES.SCHEDULED,
    actual_instructor_id: null,
    cancellation_reason: '',
    event_type: EVENT_TYPES.PRIVATE_LESSON,
    instructor_id: 1,
    min_participants: 1,
    max_participants: 1,
    name: '',
    description: '',
  }));

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFormChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target;
      const newValue = type === 'checkbox' ? checked : value;

      // Auto-adjust end_time when start_time changes to maintain duration
      if (name === 'start_time' && formData.start_time && formData.end_time) {
        const duration = calculateDurationMinutes(formData.start_time, formData.end_time);

        const [nh, nm] = value.split(':').map(Number);
        const totalEnd = nh * 60 + nm + duration;
        const newEnd = `${String(Math.floor(totalEnd / 60)).padStart(2, '0')}:${String(
          totalEnd % 60
        ).padStart(2, '0')}`;

        setFormData((prev) => ({ ...prev, [name]: value, end_time: newEnd }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: newValue }));
      }
    },
    [formData.start_time, formData.end_time]
  );

  const resetForm = useCallback((initialDate) => {
    setFormData({
      event_date: initialDate || format(new Date(), 'yyyy-MM-dd'),
      start_time: '09:00',
      end_time: '10:00',
      is_all_day: false,
      slot_status: SLOT_STATUSES.SCHEDULED,
      actual_instructor_id: null,
      cancellation_reason: '',
      event_type: EVENT_TYPES.PRIVATE_LESSON,
      instructor_id: 1,
      min_participants: 1,
      max_participants: 1,
      name: '',
      description: '',
    });
    setError(null);
  }, []);

  const createEvent = useCallback(
    async (participants = []) => {
      setError(null);
      const validation = validateEventForm(formData, participants);
      if (!validation.isValid) {
        const msg = Object.values(validation.errors).join(', ');
        setError(msg);
        return { success: false, error: msg };
      }

      try {
        setLoading(true);

        // STEP 1: Create event first (required for foreign key constraint)
        const eventPayload = {
          event_type: formData.event_type,
          instructor_id: formData.instructor_id || null,
          min_participants: formData.min_participants,
          max_participants: formData.max_participants,
          name: formData.name || 'Événement',
          description: formData.description || null,
        };

        console.log('📤 Event Payload:', eventPayload);

        const eventResponse = await calendarService.createEvent(eventPayload);
        const eventId = eventResponse.id;

        console.log('✅ Event created:', eventId);

        // STEP 2: Create planning slot with event_id
        const slotPayload = {
          event_id: eventId, // Required foreign key
          slot_date: formData.event_date,
          is_all_day: formData.is_all_day,
          slot_status: formData.slot_status,
          actual_instructor_id: formData.actual_instructor_id || null,
          cancellation_reason: formData.cancellation_reason || null,
        };

        // Add time fields only if not all-day
        if (!formData.is_all_day) {
          slotPayload.start_time = formatTimeForDatabase(formData.start_time);
          slotPayload.end_time = formatTimeForDatabase(formData.end_time);
        } else {
          // For all-day events, provide default times
          slotPayload.start_time = '00:00:00';
          slotPayload.end_time = '23:59:59';
        }

        console.log('📤 Slot Payload:', slotPayload);

        const slotResponse = await calendarService.createSlot(slotPayload);
        const slotId = slotResponse.id;

        console.log('✅ Slot created:', slotId);

        // STEP 3: Add participants (if any)
        if (participants.length > 0) {
          await Promise.all(
            participants.map((p) =>
              calendarService.addParticipant({
                event_id: eventId,
                planning_slot_id: slotId,
                rider_id: p.rider_id,
                horse_id: p.horse_id,
                horse_assignment_type: p.horse_assignment_type,
              })
            )
          );
        }

        return { success: true, slotId, eventId };
      } catch (err) {
        const errorMsg =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          'Erreur lors de la création';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [formData]
  );

  return {
    formData,
    setFormData,
    handleFormChange,
    resetForm,
    createEvent,
    loading,
    error,
  };
}
```

---

## 📄 useEventDetails.js

**Path:** `useEventDetails.js`

```
import { useState, useCallback, useEffect } from 'react';
import { calendarService } from '../services/calendarService';
import { formatTimeForInput } from '../lib/helpers/formatters';

/**
 * Hook to fetch and manage event details
 * @param {string|number} slotId - The slot ID
 */
export function useEventDetails(slotId) {
  const [data, setData] = useState({
    slot: null,
    event: null,
    participants: [],
    recurrence: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async (id) => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);

      const fullDetails = await calendarService.getSlotFullDetails(id);

      // Normalize slot times for UI
      if (fullDetails.slot) {
        fullDetails.slot.start_time = formatTimeForInput(fullDetails.slot.start_time);
        fullDetails.slot.end_time = formatTimeForInput(fullDetails.slot.end_time);
      }

      setData(fullDetails);
    } catch (err) {
      console.error('Error loading event details:', err);
      setError(err.response?.data?.message || err.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(slotId);
  }, [slotId, loadData]);

  const refresh = useCallback(() => {
    loadData(slotId);
  }, [slotId, loadData]);

  return {
    ...data,
    loading,
    error,
    refresh,
  };
}
```

---

## 📄 useEventEdit.js

**Path:** `useEventEdit.js`

```
import { useState, useCallback } from 'react';
import { calendarService } from '../services/calendarService';

/**
 * Hook to manage event editing
 * @param {Object} slot - The slot object
 * @param {Object} event - The event object
 */
export function useEventEdit(slot, event) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const startEdit = useCallback(() => {
    setEditData({
      slot_status: slot?.slot_status || 'scheduled',
      event_type: event?.event_type || 'private_lesson',
      instructor_id: event?.instructor_id || slot?.actual_instructor_id || 1,
      min_participants: event?.min_participants || 0,
      max_participants: event?.max_participants || 1,
      name: event?.name || '',
      description: event?.description || '',
    });
    setIsEditing(true);
    setError(null);
  }, [slot, event]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }, []);

  const saveEdit = useCallback(
    async (slotId, eventId, onSuccess) => {
      if (!slotId) return false;
      try {
        setSaving(true);
        setError(null);

        // Update slot
        await calendarService.updateSlot(slotId, {
          slot_status: editData.slot_status,
          actual_instructor_id: editData.instructor_id,
        });

        // Update event if exists
        if (eventId) {
          await calendarService.updateEvent(eventId, {
            event_type: editData.event_type,
            instructor_id: editData.instructor_id,
            min_participants: parseInt(editData.min_participants) || 0,
            max_participants: parseInt(editData.max_participants) || 1,
            name: editData.name,
            description: editData.description,
          });
        }

        if (onSuccess) await onSuccess();
        setIsEditing(false);
        return true;
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Erreur lors de la sauvegarde');
        return false;
      } finally {
        setSaving(false);
      }
    },
    [editData]
  );

  const cancelEdit = useCallback(() => {
    setIsEditing(false);
    setEditData({});
    setError(null);
  }, []);

  return {
    isEditing,
    editData,
    saving,
    error,
    startEdit,
    handleChange,
    saveEdit,
    cancelEdit,
  };
}
```

---

## 📄 useHorseActions.js

**Path:** `useHorseActions.js`

```
import { useState } from 'react';
import { horseService } from '../services/index.js';
import { getTodayISO } from '../lib/helpers/index.js';

/**
 * Custom hook for managing horse CRUD operations
 * @param {Function} onSuccess - Callback function to execute on successful operation
 * @returns {Object} Horse action handlers and state
 */
export function useHorseActions(onSuccess) {
  const [showModal, setShowModal] = useState(false);
  const [editingHorse, setEditingHorse] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [horseToDelete, setHorseToDelete] = useState(null);

  // HorseCard modal state
  const [showHorseCard, setShowHorseCard] = useState(false);
  const [selectedHorse, setSelectedHorse] = useState(null);

  const handleCreate = () => {
    setEditingHorse(null);
    setShowModal(true);
  };

  const handleEdit = (horse) => {
    setEditingHorse(horse);
    setShowModal(true);
  };

  const handleDeleteClick = (horse) => {
    setHorseToDelete(horse);
    setShowDeleteModal(true);
  };

  const handleSubmit = async (horseData) => {
    try {
      if (editingHorse) {
        await horseService.update(editingHorse.id, horseData);
        onSuccess('Cheval modifié avec succès');
      } else {
        await horseService.create(horseData);
        onSuccess('Cheval créé avec succès');
      }
      closeModal();
    } catch (err) {
      throw err;
    }
  };

  const handleRemoveFromInventory = async () => {
    if (!horseToDelete) return;
    try {
      await horseService.update(horseToDelete.id, {
        activity_end_date: getTodayISO(),
      });
      onSuccess(`${horseToDelete.name} a été retiré de l'inventaire`);
      closeDeleteModal();
    } catch (err) {
      throw err;
    }
  };

  const handlePermanentDelete = async () => {
    if (!horseToDelete) return;
    try {
      await horseService.delete(horseToDelete.id);
      onSuccess(`${horseToDelete.name} a été supprimé définitivement`);
      closeDeleteModal();
    } catch (err) {
      throw err;
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingHorse(null);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setHorseToDelete(null);
  };

  // HorseCard modal handlers
  const openHorseCard = (horse) => {
    setSelectedHorse(horse);
    setShowHorseCard(true);
  };

  const closeHorseCard = () => {
    setShowHorseCard(false);
    setSelectedHorse(null);
  };

  return {
    // Form modal
    showModal,
    editingHorse,
    handleCreate,
    handleEdit,
    handleSubmit,
    closeModal,

    // Delete modal
    showDeleteModal,
    horseToDelete,
    handleDeleteClick,
    handleRemoveFromInventory,
    handlePermanentDelete,
    closeDeleteModal,

    // HorseCard modal
    showHorseCard,
    selectedHorse,
    openHorseCard,
    closeHorseCard,
  };
}
```

---

## 📄 useHorseCard.js

**Path:** `useHorseCard.js`

```
import { useState, useEffect } from 'react';
import { horseService } from '../services/index.js';
import { pairingService } from '../services/index.js';

/**
 * Custom hook for loading complete horse data with pairings for HorseCard
 * @param {number|string} horseId - The horse ID
 * @returns {Object} Horse data with pairings and state management
 */
export function useHorseCard(horseId) {
  const [horse, setHorse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pairing modal state
  const [showPairingModal, setShowPairingModal] = useState(false);
  const [editingPairing, setEditingPairing] = useState(null);
  const [showDeletePairingModal, setShowDeletePairingModal] = useState(false);
  const [pairingToDelete, setPairingToDelete] = useState(null);

  const loadHorse = async () => {
    if (!horseId) {
      setHorse(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Use getById to load horse with complete pairings data
      const data = await horseService.getById(horseId);

      if (!data) {
        setError('Cheval non trouvé');
        setHorse(null);
        return;
      }

      // Transform the data to flatten rider information in pairings
      const transformedHorse = {
        ...data,
        pairings: (data.rider_horse_pairings || []).map((pairing) => ({
          id: pairing.id,
          rider_id: pairing.riders?.id,
          rider_name: pairing.riders?.name || 'N/A',
          horse_id: data.id,
          link_type: pairing.link_type,
          loan_days: pairing.loan_days || [],
          loan_days_per_week: pairing.loan_days_per_week || 0,
          pairing_start_date: pairing.pairing_start_date,
          pairing_end_date: pairing.pairing_end_date,
        })),
      };

      // Remove the nested rider_horse_pairings to avoid confusion
      delete transformedHorse.rider_horse_pairings;

      setHorse(transformedHorse);
    } catch (err) {
      console.error('Error loading horse with pairings:', err);
      setError(err.message || 'Erreur lors du chargement du cheval');
      setHorse(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHorse();
  }, [horseId]);

  const reload = () => {
    loadHorse();
  };

  // Pairing action handlers
  const handleCreatePairing = () => {
    setEditingPairing({ horse_id: horseId });
    setShowPairingModal(true);
  };

  const handleEditPairing = (pairing) => {
    setEditingPairing(pairing);
    setShowPairingModal(true);
  };

  const handleDeletePairingClick = (pairing) => {
    setPairingToDelete(pairing);
    setShowDeletePairingModal(true);
  };

  const handlePairingSubmit = async (pairingData) => {
    try {
      if (editingPairing?.id) {
        // Update existing pairing
        await pairingService.update(editingPairing.id, pairingData);
      } else {
        // Create new pairing
        await pairingService.create(pairingData);
      }
      closePairingModal();
      await reload(); // Reload to get updated data
      return { success: true };
    } catch (err) {
      throw err;
    }
  };

  const handleDeletePairing = async () => {
    if (!pairingToDelete) return;

    try {
      await pairingService.delete(pairingToDelete.id);
      closeDeletePairingModal();
      await reload(); // Reload to get updated data
      return { success: true };
    } catch (err) {
      throw err;
    }
  };

  const closePairingModal = () => {
    setShowPairingModal(false);
    setEditingPairing(null);
  };

  const closeDeletePairingModal = () => {
    setShowDeletePairingModal(false);
    setPairingToDelete(null);
  };

  return {
    // Horse data
    horse,
    loading,
    error,
    reload,

    // Pairing modal state
    showPairingModal,
    editingPairing,
    showDeletePairingModal,
    pairingToDelete,

    // Pairing actions
    handleCreatePairing,
    handleEditPairing,
    handleDeletePairingClick,
    handlePairingSubmit,
    handleDeletePairing,
    closePairingModal,
    closeDeletePairingModal,
  };
}
```

---

## 📄 useHorseForm.js

**Path:** `useHorseForm.js`

```
import { useEffect, useState } from 'react';
import { HORSE_TYPES, OWNER_TYPES } from '../lib/domain/index.js';
import { validateHorseForm, getTodayISO } from '../lib/helpers/index.js';
import { riderService } from '../services';

/**
 * Custom hook for managing horse form data and operations
 * @param {Object} horse - The horse object for editing
 * @returns {Object} Form data, handlers, and state
 */
export function useHorseForm(horse) {
  const [formData, setFormData] = useState({
    name: '',
    kind: HORSE_TYPES.HORSE,
    activity_start_date: getTodayISO(),
    activity_end_date: '',
    ownership_type: OWNER_TYPES.PRIVATE_OWNER,
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [riders, setRiders] = useState([]);
  const [loadingRiders, setLoadingRiders] = useState(false);

  const loadRiders = async () => {
    try {
      setLoadingRiders(true);
      const ridersData = await riderService.getAll();
      setRiders(ridersData || []);
    } catch (err) {
      console.error('Error loading riders:', err);
      setError('Erreur lors du chargement des cavaliers');
    } finally {
      setLoadingRiders(false);
    }
  };

  useEffect(() => {
    loadRiders();
  }, []);

  useEffect(() => {
    if (horse) {
      setFormData({
        name: horse.name || '',
        kind: horse.kind || HORSE_TYPES.HORSE,
        activity_start_date: horse.activity_start_date || getTodayISO(),
        activity_end_date: horse.activity_end_date || '',
        ownership_type: horse.ownership_type || OWNER_TYPES.PRIVATE_OWNER,
      });
    } else {
      setFormData({
        name: '',
        kind: HORSE_TYPES.HORSE,
        activity_start_date: getTodayISO(),
        activity_end_date: '',
        ownership_type: OWNER_TYPES.PRIVATE_OWNER,
      });
    }
  }, [horse]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const validateForm = () => {
    const validation = validateHorseForm(formData);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      setError(firstError);
      return false;
    }
    setError('');
    return true;
  };

  const resetForm = () => {
    setFormData({
      name: '',
      kind: HORSE_TYPES.HORSE,
      activity_start_date: getTodayISO(),
      activity_end_date: '',
      ownership_type: OWNER_TYPES.PRIVATE_OWNER,
    });
    setError('');
  };

  return {
    // State
    formData,
    error,
    submitting,
    riders,
    loadingRiders,
    kindOptions: Object.values(HORSE_TYPES),
    ownershipOptions: Object.values(OWNER_TYPES),

    // Actions
    handleChange,
    validateForm,
    resetForm,

    // State setters
    setError,
    setSubmitting,
    setFormData,
  };
}
```

---

## 📄 useHorseRiders.js

**Path:** `useHorseRiders.js`

```
import { useState } from 'react';
import { horseService } from '../services/index.js';

/**
 * Custom hook for managing horse riders modal
 * @returns {Object} Riders modal state and handlers
 */
export function useHorseRiders() {
  const [showRidersModal, setShowRidersModal] = useState(false);
  const [selectedHorseRiders, setSelectedHorseRiders] = useState(null);
  const [loadingRiders, setLoadingRiders] = useState(false);
  const [error, setError] = useState(null);

  const handleRidersClick = async (horse) => {
    if (!horse || horse.active_riders_count === 0) {
      return;
    }

    try {
      setLoadingRiders(true);
      setShowRidersModal(true);
      setError(null);

      const response = await horseService.getRiders(horse.id);

      // ✅ L'API retourne { data: { horse_data, pairings: [...] } }
      // On veut récupérer les pairings qui sont dans data.pairings
      const horseData = response.data || response;
      const ridersArray = Array.isArray(horseData.pairings) ? horseData.pairings : [];

      console.log('🐴 Horse riders data:', {
        horse: horse.name,
        horseData,
        ridersArray,
        count: ridersArray.length,
      });

      setSelectedHorseRiders({
        horseName: horse.name,
        riders: ridersArray, // Maintenant c'est un tableau de pairings
      });
    } catch (err) {
      console.error('Error loading riders:', err);
      setError(err.message || 'Erreur lors du chargement des cavaliers');
      setShowRidersModal(false);
    } finally {
      setLoadingRiders(false);
    }
  };

  const closeRidersModal = () => {
    setShowRidersModal(false);
    setSelectedHorseRiders(null);
    setError(null);
  };

  return {
    showRidersModal,
    selectedHorseRiders,
    loadingRiders,
    error,
    handleRidersClick,
    closeRidersModal,
  };
}
```

---

## 📄 useHorsesList.js

**Path:** `useHorsesList.js`

```
import { useState, useEffect } from 'react';
import { horseService } from '../services';
import { isActive } from '../lib/helpers';
import { HORSE_TYPES, OWNER_TYPES } from '../lib/domain';

/**
 * Custom hook for managing horses list with filters and stats
 */
export function useHorsesList() {
  const [horses, setHorses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [includeInactive, setIncludeInactive] = useState(false);
  const [kindFilter, setKindFilter] = useState('all');
  const [ownershipFilter, setOwnershipFilter] = useState('all');

  const fetchHorses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await horseService.getAll();
      setHorses(data || []);
    } catch (err) {
      console.error('Error fetching horses:', err);
      setError(err.message || 'Erreur lors du chargement des chevaux');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHorses();
  }, []);

  // Calculate stats
  const stats = {
    total: horses.length,
    active: horses.filter((h) => isActive(h.activity_start_date, h.activity_end_date)).length,
    inactive: horses.filter((h) => !isActive(h.activity_start_date, h.activity_end_date)).length,
    horse: horses.filter((h) => h.kind === HORSE_TYPES.HORSE).length,
    pony: horses.filter((h) => h.kind === HORSE_TYPES.PONY).length,
    laury: horses.filter((h) => h.ownership_type === OWNER_TYPES.LAURY).length,
    private_owner: horses.filter((h) => h.ownership_type === OWNER_TYPES.PRIVATE_OWNER).length,
    club: horses.filter((h) => h.ownership_type === OWNER_TYPES.CLUB).length,
    other: horses.filter((h) => h.ownership_type === OWNER_TYPES.OTHER).length,
  };

  // Filter horses
  const filteredHorses = horses.filter((horse) => {
    const horseIsActive = isActive(horse.activity_start_date, horse.activity_end_date);
    if (!includeInactive && !horseIsActive) return false;

    if (kindFilter !== 'all' && horse.kind !== kindFilter) return false;
    if (ownershipFilter !== 'all' && horse.ownership_type !== ownershipFilter) return false;

    return true;
  });

  const reload = async () => {
    await fetchHorses();
  };

  const toggleIncludeInactive = () => {
    setIncludeInactive(!includeInactive);
  };

  const clearError = () => setError(null);

  return {
    horses,
    filteredHorses,
    stats,
    loading,
    error,
    includeInactive,
    kindFilter,
    ownershipFilter,
    setKindFilter,
    setOwnershipFilter,
    toggleIncludeInactive,
    reload,
    clearError,
    setError,
    setHorses,
  };
}
```

---

## 📄 usePackageActions.js

**Path:** `usePackageActions.js`

```
import { useState } from 'react';
import { packageService } from '../services/index.js';

/**
 * Custom hook for managing package CRUD operations
 * @param {Function} onSuccess - Callback function to execute on successful operation
 * @returns {Object} Package action handlers and state
 */
export function usePackageActions(onSuccess) {
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState(null);

  const handleCreate = () => {
    setEditingPackage(null);
    setShowPackageModal(true);
  };

  const handleEdit = (pkg) => {
    setEditingPackage(pkg);
    setShowPackageModal(true);
  };

  const handleDeleteClick = (pkg) => {
    setPackageToDelete(pkg);
    setShowDeleteModal(true);
  };

  const handleSubmit = async (riderId, packageData) => {
    try {
      let result;
      if (editingPackage) {
        // Soft delete old package
        await packageService.delete(editingPackage.id);

        // Create new
        result = await packageService.createForRider(riderId, packageData);

        onSuccess('Forfait modifié avec succès');
        setShowPackageModal(false);
        setEditingPackage(null);
        return result;
      }

      // Create
      result = await packageService.createForRider(riderId, packageData);

      onSuccess('Forfait créé avec succès');
      setShowPackageModal(false);
      return result;
    } catch (err) {
      // Rethrow error for parent handling
      throw err;
    }
  };

  const handleRemoveFromInventory = async () => {
    if (!packageToDelete) return;

    try {
      await packageService.delete(packageToDelete.id);
      onSuccess('Forfait supprimé');
      setShowDeleteModal(false);
      setPackageToDelete(null);
    } catch (err) {
      throw err;
    }
  };

  const handlePermanentDelete = async () => {
    await handleRemoveFromInventory();
  };

  const closeModal = () => {
    setShowPackageModal(false);
    setEditingPackage(null);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setPackageToDelete(null);
  };

  return {
    showPackageModal,
    editingPackage,
    showDeleteModal,
    packageToDelete,
    handleCreate,
    handleEdit,
    handleDeleteClick,
    handleSubmit,
    handleRemoveFromInventory,
    handlePermanentDelete,
    closeModal,
    closeDeleteModal,
  };
}
```

---

## 📄 usePackageForm.js

**Path:** `usePackageForm.js`

```
import { useState, useEffect } from 'react';

/**
 * Custom hook for managing package form data and operations
 * @param {Object} packageData - The package object for editing
 * @param {string|number} riderId - The rider ID
 * @param {Function} onSubmit - Submit handler
 * @returns {Object} Form data, handlers, and state
 */
export function usePackageForm(packageData, riderId, onSubmit) {
  const [formData, setFormData] = useState({
    services_per_week: String(packageData?.services_per_week ?? 0),
    group_lessons_per_week: String(packageData?.group_lessons_per_week ?? 0),
    is_active: packageData?.is_active ?? true,
  });

  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Reset form when packageData changes (create vs edit)
  useEffect(() => {
    setFormData({
      services_per_week: String(packageData?.services_per_week ?? 0),
      group_lessons_per_week: String(packageData?.group_lessons_per_week ?? 0),
      is_active: packageData?.is_active ?? true,
    });
    setError(null);
    setSubmitting(false);
  }, [packageData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // handleSubmit accepts either an event (HTML submit) or no argument (programmatic call)
  const handleSubmit = async (e) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }

    setError(null);
    setSubmitting(true);

    try {
      const services = parseInt(formData.services_per_week, 10);
      const lessons = parseInt(formData.group_lessons_per_week, 10);

      if (Number.isNaN(services) || Number.isNaN(lessons)) {
        throw new Error('Les champs doivent contenir des nombres entiers valides');
      }

      if (services < 0 || lessons < 0) {
        throw new Error('Les valeurs doivent être positives');
      }

      if (services === 0 && lessons === 0) {
        throw new Error('Le forfait doit contenir au moins un service ou un cours');
      }

      await onSubmit(riderId, {
        services_per_week: services,
        group_lessons_per_week: lessons,
        is_active: formData.is_active,
      });

      setSubmitting(false);
      return true;
    } catch (err) {
      setError(err?.message || "Erreur lors de l'enregistrement");
      setSubmitting(false);
      return false;
    }
  };

  return {
    formData,
    error,
    submitting,
    handleChange,
    handleSubmit,
    setFormData,
  };
}
```

---

## 📄 usePairingActions.js

**Path:** `usePairingActions.js`

```
import { useState } from 'react';
import { RIDER_HORSE_LINK_TYPE } from '../lib/domain/index.js';
import { getTodayISO } from '../lib/helpers/index.js';
import pairingService from '../services/pairingService.js';

/**
 * Custom hook for managing pairing CRUD operations
 * @param {Function} onSuccess - Callback function to execute on successful operation
 * @returns {Object} Pairing action handlers and state
 */
export function usePairingActions(onSuccess) {
  const [showPairingModal, setShowPairingModal] = useState(false);
  const [editingPairing, setEditingPairing] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pairingToDelete, setPairingToDelete] = useState(null);

  const handleCreate = () => {
    setEditingPairing(null);
    setShowPairingModal(true);
  };

  const handleEdit = (pairing) => {
    const pairingWithDays = {
      ...pairing,
      loan_days: pairing.loan_days || [],
    };
    setEditingPairing(pairingWithDays);
    setShowPairingModal(true);
  };

  const handleDeleteClick = (pairing) => {
    setPairingToDelete(pairing);
    setShowDeleteModal(true);
  };

  const handleSubmit = async (riderId, pairingData) => {
    try {
      console.log('📤 Submitting pairing data:', pairingData);

      // Default link_type based on rider
      const payload = {
        ...pairingData,
        rider_id: riderId,
        link_type: pairingData.link_type ?? RIDER_HORSE_LINK_TYPE.OWN,
      };

      console.log('📦 Final payload:', payload);

      if (editingPairing) {
        await pairingService.update(editingPairing.id, payload);
        onSuccess('Pension modifiée avec succès');
      } else {
        await pairingService.create(payload);
        onSuccess('Pension créée avec succès');
      }

      setShowPairingModal(false);
      setEditingPairing(null);
    } catch (err) {
      throw err;
    }
  };

  const handleRemoveFromInventory = async () => {
    if (!pairingToDelete) return;
    try {
      await pairingService.update(pairingToDelete.id, { pairing_end_date: getTodayISO() });
      onSuccess("Pension retirée de l'inventaire");
      setShowDeleteModal(false);
      setPairingToDelete(null);
    } catch (err) {
      throw err;
    }
  };

  const handlePermanentDelete = async () => {
    if (!pairingToDelete) return;
    try {
      await pairingService.delete(pairingToDelete.id);
      onSuccess('Pension supprimée définitivement');
      setShowDeleteModal(false);
      setPairingToDelete(null);
    } catch (err) {
      throw err;
    }
  };

  const closeModal = () => {
    setShowPairingModal(false);
    setEditingPairing(null);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setPairingToDelete(null);
  };

  return {
    showPairingModal,
    editingPairing,
    showDeleteModal,
    pairingToDelete,
    handleCreate,
    handleEdit,
    handleDeleteClick,
    handleSubmit,
    handleRemoveFromInventory,
    handlePermanentDelete,
    closeModal,
    closeDeleteModal,
  };
}
```

---

## 📄 usePairingForm.js

**Path:** `usePairingForm.js`

```
import { useEffect, useState } from 'react';
import {
  RIDER_HORSE_LINK_TYPE,
  RIDER_TYPES,
  isLoanPairing,
  isValidLoanDaysPerWeek,
} from '../lib/domain/index.js';
import { getTodayISO } from '../lib/helpers/index.js';

/**
 * Custom hook for managing pairing form data and operations
 * @param {Object} pairing - The pairing object for editing
 * @param {Object} rider - Rider object (needed for default link_type)
 * @param {string|number} riderId - Pre-selected rider ID (optional)
 * @param {string|number} horseId - Pre-selected horse ID (optional)
 * @returns {Object} Form data, handlers, and state
 */
export function usePairingForm(pairing, rider, riderId, horseId) {
  const [formData, setFormData] = useState({
    rider_id: null,
    horse_id: null,
    pairing_start_date: getTodayISO(),
    pairing_end_date: '',
    link_type: RIDER_HORSE_LINK_TYPE.OWN,
    loan_days_per_week: 1,
    loan_days: [],
  });

  const [error, setError] = useState('');

  useEffect(() => {
    // --- EDIT MODE ---
    if (pairing) {
      const extractedRiderId = pairing.rider_id
        ? parseInt(pairing.rider_id)
        : pairing.riders?.id
        ? parseInt(pairing.riders.id)
        : riderId
        ? parseInt(riderId)
        : null;

      const extractedHorseId = pairing.horse_id
        ? parseInt(pairing.horse_id)
        : pairing.horses?.id
        ? parseInt(pairing.horses.id)
        : horseId
        ? parseInt(horseId)
        : null;

      setFormData({
        rider_id: extractedRiderId,
        horse_id: extractedHorseId,
        pairing_start_date: pairing.pairing_start_date || getTodayISO(),
        pairing_end_date: pairing.pairing_end_date || '',
        link_type: pairing.link_type || RIDER_HORSE_LINK_TYPE.OWN,
        loan_days_per_week: pairing.loan_days_per_week || 1,
        loan_days: Array.isArray(pairing.loan_days) ? pairing.loan_days : [],
      });

      return;
    }

    // --- CREATION MODE ---
    const defaultLinkType =
      rider?.rider_type === RIDER_TYPES.OWNER
        ? RIDER_HORSE_LINK_TYPE.OWN
        : RIDER_HORSE_LINK_TYPE.LOAN;

    const defaultLoanDaysPerWeek = rider?.rider_type === RIDER_TYPES.OWNER ? 0 : 1;

    setFormData((prev) => ({
      ...prev,
      rider_id: riderId ? parseInt(riderId) : null,
      horse_id: horseId ? parseInt(horseId) : null,
      link_type: defaultLinkType,
      loan_days_per_week: defaultLoanDaysPerWeek,
      loan_days: [],
    }));
  }, [pairing, rider, riderId, horseId]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    const finalValue =
      name === 'rider_id' || name === 'horse_id' || name === 'loan_days_per_week'
        ? value
          ? parseInt(value)
          : null
        : value;

    setFormData((prev) => {
      const updated = { ...prev, [name]: finalValue };

      // If loan_days_per_week changes, trim loan_days array
      if (name === 'loan_days_per_week' && updated.loan_days) {
        updated.loan_days = updated.loan_days.slice(0, finalValue);
      }

      return updated;
    });

    if (error) setError('');
  };

  // Toggle selection of a day in loan_days
  const toggleLoanDay = (dayCode) => {
    if (!isLoanPairing(formData)) return;

    setFormData((prev) => {
      const daysSet = new Set(prev.loan_days || []);
      if (daysSet.has(dayCode)) {
        daysSet.delete(dayCode);
      } else if (daysSet.size < (prev.loan_days_per_week || 1)) {
        daysSet.add(dayCode);
      }
      return { ...prev, loan_days: Array.from(daysSet).sort() };
    });
  };

  // Basic validation
  const validateForm = () => {
    console.log('🔍 Validating form data:', formData);

    if (!formData.rider_id || !formData.horse_id || !formData.pairing_start_date) {
      const missingFields = [];
      if (!formData.rider_id) missingFields.push('Cavalier');
      if (!formData.horse_id) missingFields.push('Cheval');
      if (!formData.pairing_start_date) missingFields.push('Date de début');

      const errorMsg = `Les champs suivants sont requis: ${missingFields.join(', ')}`;
      console.error('❌ Validation failed:', errorMsg);
      setError(errorMsg);
      return false;
    }

    if (isLoanPairing(formData)) {
      if (!isValidLoanDaysPerWeek(formData.loan_days_per_week)) {
        setError('Le nombre de jours par semaine doit être compris entre 1 et 7');
        return false;
      }
      if ((formData.loan_days || []).length > formData.loan_days_per_week) {
        setError('Vous ne pouvez pas sélectionner plus de jours que le nombre autorisé');
        return false;
      }
    }

    console.log('✅ Validation passed');
    return true;
  };

  const resetForm = () => {
    const defaultLinkType =
      rider?.rider_type === RIDER_TYPES.OWNER
        ? RIDER_HORSE_LINK_TYPE.OWN
        : RIDER_HORSE_LINK_TYPE.LOAN;

    const defaultLoanDaysPerWeek = rider?.rider_type === RIDER_TYPES.OWNER ? 0 : 1;

    setFormData({
      rider_id: riderId ? parseInt(riderId) : null,
      horse_id: horseId ? parseInt(horseId) : null,
      pairing_start_date: getTodayISO(),
      pairing_end_date: '',
      link_type: defaultLinkType,
      loan_days_per_week: defaultLoanDaysPerWeek,
      loan_days: [],
    });
    setError('');
  };

  return {
    formData,
    error,
    setFormData,
    setError,
    handleChange,
    toggleLoanDay,
    validateForm,
    resetForm,
  };
}
```

---

## 📄 useParticipantList.js

**Path:** `useParticipantList.js`

```
import { useState, useCallback } from 'react';
import { HORSE_ASSIGNMENT_TYPES } from '../lib/domain/domain-constants';

/**
 * Hook to manage the list of participants for an event
 * Handles add, remove, update operations
 */
export function useParticipantList(initialParticipants = []) {
  const [participants, setParticipants] = useState(initialParticipants);

  const addParticipant = useCallback(
    (riderId, horseId, horseAssignmentType = HORSE_ASSIGNMENT_TYPES.MANUAL) => {
      setParticipants((prev) => {
        // Prevent duplicates
        if (prev.some((p) => p.rider_id === riderId && p.horse_id === horseId)) {
          return prev;
        }

        return [
          ...prev,
          {
            id: Date.now(),
            rider_id: riderId,
            horse_id: horseId,
            horse_assignment_type: horseAssignmentType,
          },
        ];
      });
    },
    []
  );

  const removeParticipant = useCallback((id) => {
    setParticipants((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const updateParticipant = useCallback(
    (id, riderId, horseId, horseAssignmentType = HORSE_ASSIGNMENT_TYPES.MANUAL) => {
      setParticipants((prev) => {
        // Prevent duplicate rider + horse combinations (excluding current participant)
        const hasDuplicate = prev.some(
          (p) => p.id !== id && p.rider_id === riderId && p.horse_id === horseId
        );

        if (hasDuplicate) {
          return prev;
        }

        return prev.map((p) =>
          p.id === id
            ? {
                ...p,
                rider_id: riderId,
                horse_id: horseId,
                horse_assignment_type: horseAssignmentType,
              }
            : p
        );
      });
    },
    []
  );

  const clearParticipants = useCallback(() => {
    setParticipants([]);
  }, []);

  return {
    participants,
    addParticipant,
    removeParticipant,
    updateParticipant,
    clearParticipants,
  };
}
```

---

## 📄 useParticipantSelection.js

**Path:** `useParticipantSelection.js`

```
import { useState, useEffect, useCallback, useMemo } from 'react';
import riderService from '../services/riderService';
import horseService from '../services/horseService';
import { OWNER_TYPES } from '../lib/domain/domain-constants';

const OWNER_TYPE_SORT_ORDER = {
  [OWNER_TYPES.LAURY]: 1,
  [OWNER_TYPES.CLUB]: 2,
  [OWNER_TYPES.PRIVATE_OWNER]: 3,
  [OWNER_TYPES.OTHER]: 4,
};

/**
 * Hook to manage participant selection logic
 * Handles fetching riders/horses, filtering, and selection state
 */
export function useParticipantSelection(existingParticipants = [], editingParticipantId = null) {
  const [riders, setRiders] = useState([]);
  const [horses, setHorses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedRiderId, setSelectedRiderId] = useState(null);
  const [selectedHorseId, setSelectedHorseId] = useState(null);
  const [riderHorses, setRiderHorses] = useState([]);

  // Fetch riders and horses on mount
  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [ridersData, horsesData] = await Promise.all([
          riderService.getAll(),
          horseService.getAll(),
        ]);

        if (!cancelled) {
          setRiders(Array.isArray(ridersData) ? ridersData : []);
          setHorses(Array.isArray(horsesData) ? horsesData : []);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Error fetching participants data:', err);
          setError('Erreur lors du chargement des données');
          setRiders([]);
          setHorses([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch horses for selected rider
  useEffect(() => {
    if (!selectedRiderId) {
      setRiderHorses([]);
      return;
    }

    const fetchRiderHorses = async () => {
      try {
        const data = await riderService.getHorses(selectedRiderId);
        if (Array.isArray(data)) {
          const horsesData = data
            .map((pairing) => pairing.horses)
            .filter((horse) => horse && horse.id);
          setRiderHorses(horsesData);

          // Auto-select first horse if available and none selected
          if (horsesData.length > 0 && !selectedHorseId) {
            setSelectedHorseId(horsesData[0].id);
          }
        } else {
          setRiderHorses([]);
        }
      } catch (err) {
        console.error('Error fetching rider horses:', err);
        setRiderHorses([]);
      }
    };

    fetchRiderHorses();
  }, [selectedRiderId, selectedHorseId]);

  // Get available riders (excluding already selected ones)
  const getAvailableRiders = useCallback(
    (riderTypeFilter = 'all', searchTerm = '') => {
      return riders.filter((r) => {
        // Filter by type
        if (riderTypeFilter !== 'all' && r.rider_type !== riderTypeFilter) {
          return false;
        }

        // Filter by search term
        if (searchTerm) {
          const riderNameNormalized = r.name
            .toLowerCase()
            .normalize('NFD')
            .replace(/\p{Diacritic}/gu, '');
          const searchNormalized = searchTerm
            .toLowerCase()
            .normalize('NFD')
            .replace(/\p{Diacritic}/gu, '');

          if (!riderNameNormalized.includes(searchNormalized)) {
            return false;
          }
        }

        // Exclude already selected riders (unless editing that participant)
        if (
          existingParticipants.some((p) => p.rider_id === r.id && p.id !== editingParticipantId)
        ) {
          return false;
        }

        return true;
      });
    },
    [riders, existingParticipants, editingParticipantId]
  );

  // Get available horses (sorted and filtered)
  const getAvailableHorses = useCallback(
    (ownershipFilter = 'all') => {
      // Combine rider horses (prioritized) with all other horses
      const sortedHorses = [
        ...riderHorses,
        ...horses.filter((h) => !riderHorses.some((rh) => rh.id === h.id)),
      ]
        // Exclude already selected horses (unless editing that participant)
        .filter(
          (h) =>
            !existingParticipants.some((p) => p.horse_id === h.id && p.id !== editingParticipantId)
        )
        // Sort by ownership type
        .sort((h1, h2) => {
          const order1 = OWNER_TYPE_SORT_ORDER[h1.ownership_type] ?? 99;
          const order2 = OWNER_TYPE_SORT_ORDER[h2.ownership_type] ?? 99;
          return order1 - order2;
        });

      // Apply ownership filter
      if (ownershipFilter === 'all') {
        return sortedHorses;
      }

      return sortedHorses.filter((h) => h.ownership_type === ownershipFilter);
    },
    [horses, riderHorses, existingParticipants, editingParticipantId]
  );

  const resetSelection = useCallback(() => {
    setSelectedRiderId(null);
    setSelectedHorseId(null);
    setRiderHorses([]);
  }, []);

  const setSelection = useCallback((riderId, horseId) => {
    setSelectedRiderId(riderId);
    setSelectedHorseId(horseId);
  }, []);

  return {
    // Data
    riders,
    horses,
    loading,
    error,

    // Selection state
    selectedRiderId,
    selectedHorseId,
    setSelectedRiderId,
    setSelectedHorseId,
    setSelection,
    resetSelection,

    // Filtered/sorted data
    getAvailableRiders,
    getAvailableHorses,

    // Helper to get names
    getRiderName: useCallback((id) => riders.find((r) => r.id === id)?.name || '—', [riders]),
    getHorseName: useCallback((id) => horses.find((h) => h.id === id)?.name || '—', [horses]),
  };
}
```

---

## 📄 useRiderCard.js

**Path:** `useRiderCard.js`

```
import { useState, useEffect } from 'react';
import { riderService, horseService } from '../services/index.js';

/**
 * Custom hook for managing rider card data and operations
 * @param {number} riderId - The rider ID
 * @returns {Object} Rider data, loading state, error, and handler functions
 */
export function useRiderCard(riderId) {
  const [rider, setRider] = useState(null);
  const [packages, setPackages] = useState([]);
  const [pairings, setPairings] = useState([]);
  const [riders, setRiders] = useState([]);
  const [horses, setHorses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (riderId) {
      fetchRiderData();
    }
  }, [riderId]);

  const fetchRiderData = async () => {
    try {
      setLoading(true);
      setError(null);

      const riderResponse = await riderService.getById(riderId);
      setRider(riderResponse);

      await Promise.all([fetchPackages(), fetchPairings(), fetchAllRiders(), fetchAllHorses()]);
    } catch (error) {
      console.error('❌ Error fetching rider data:', error);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const fetchPackages = async () => {
    try {
      const data = await riderService.getPackages(riderId);
      console.log('📦 Packages fetched:', data);

      // Filter out deleted packages client-side if needed
      const activePackages = Array.isArray(data) ? data.filter((pkg) => !pkg.deleted_at) : [];

      setPackages(activePackages);

      if (activePackages.length > 0) {
        console.log(
          '✅ Active package:',
          activePackages.find((pkg) => pkg.is_active)
        );
      }
    } catch (error) {
      console.error('❌ Error fetching packages:', error);
      setPackages([]);
    }
  };

  const fetchPairings = async () => {
    try {
      const data = await riderService.getHorses(riderId);
      console.log('🐴 Pairings fetched:', data);
      setPairings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('❌ Error fetching pairings:', error);
      setPairings([]);
    }
  };

  const fetchAllRiders = async () => {
    try {
      const response = await riderService.getAll();
      setRiders(response || []);
    } catch (error) {
      console.error('❌ Error fetching all riders:', error);
      setRiders([]);
    }
  };

  const fetchAllHorses = async () => {
    try {
      const response = await horseService.getAll();
      setHorses(response || []);
    } catch (error) {
      console.error('❌ Error fetching all horses:', error);
      setHorses([]);
    }
  };

  const reload = () => {
    console.log('🔄 Reloading rider data...');
    fetchRiderData();
  };

  return {
    rider,
    packages,
    pairings,
    riders,
    horses,
    loading,
    error,
    reload,
  };
}
```

---

## 📄 useRiderForm.js

**Path:** `useRiderForm.js`

```
import { useEffect, useState } from 'react';
import { RIDER_TYPES } from '../lib/domain/index.js';
import { validateRiderForm, getTodayISO } from '../lib/helpers/index.js';

/**
 * Custom hook for managing rider form data and operations
 * @param {Object} rider - The rider object for editing
 * @param {Function} onSubmit - Submit handler
 * @param {Function} onCancel - Cancel handler
 * @returns {Object} Form data, handlers, and state
 */
export function useRiderForm(rider, onSubmit, onCancel) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    activity_start_date: getTodayISO(),
    activity_end_date: '',
    rider_type: RIDER_TYPES.LOANER,
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (rider) {
      setFormData({
        name: rider.name || '',
        phone: rider.phone || '',
        email: rider.email || '',
        activity_start_date: rider.activity_start_date || getTodayISO(),
        activity_end_date: rider.activity_end_date || '',
        rider_type: rider.rider_type || RIDER_TYPES.LOANER,
      });
    } else {
      resetForm();
    }
  }, [rider]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const validation = validateRiderForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      if (onSubmit) await onSubmit(formData);
    } catch (err) {
      setErrors({ submit: err.message || 'Une erreur est survenue lors de la sauvegarde' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setErrors({});
    if (onCancel) onCancel();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      activity_start_date: getTodayISO(),
      activity_end_date: '',
      rider_type: RIDER_TYPES.LOANER,
    });
    setErrors({});
  };

  return {
    formData,
    errors,
    submitting,
    riderTypeOptions: Object.values(RIDER_TYPES),
    handleChange,
    handleSubmit,
    handleCancel,
    validateForm,
    resetForm,
    setErrors,
    setFormData,
  };
}
```

---

## 📄 useRiderHorses.js

**Path:** `useRiderHorses.js`

```
import { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * Hook to fetch horses associated with a specific rider
 * @param {string|number} riderId - The selected rider ID
 */
export function useRiderHorses(riderId) {
  const [riderPairedHorses, setRiderPairedHorses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!riderId) {
      setRiderPairedHorses([]);
      return;
    }

    const fetchRiderHorses = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch rider-horse pairings
        const response = await axios.get(`/api/riders/${riderId}/horses`);

        // The backend returns an array of pairings with nested horses
        // Each pairing has: { id, rider_id, horse_id, link_type, horses: { id, name, ... } }
        let horsesData = [];

        if (Array.isArray(response.data)) {
          // Extract horses from pairings and filter out null/deleted horses
          horsesData = response.data
            .map((pairing) => pairing.horses)
            .filter((horse) => horse && horse.id); // Filter out null or invalid horses
        }

        setRiderPairedHorses(horsesData);
      } catch (err) {
        console.error('Error fetching rider horses:', err);
        setError('Erreur lors du chargement des chevaux du cavalier');
        setRiderPairedHorses([]); // Ensure it's always an array
      } finally {
        setLoading(false);
      }
    };

    fetchRiderHorses();
  }, [riderId]);

  return {
    riderPairedHorses,
    loading,
    error,
  };
}
```

---

## 📄 useRidersList.js

**Path:** `useRidersList.js`

```
import { useEffect, useState } from 'react';
import { calculateRiderStats, filterRiders } from '../lib/helpers';
import { COMMON_FILTERS } from '../lib/helpers/filters/activityFilters';
import { riderService } from '../services';

/**
 * Custom hook for managing riders list data and operations
 */
export function useRidersList() {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingRider, setEditingRider] = useState(null);
  const [selectedRiderId, setSelectedRiderId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [riderToDelete, setRiderToDelete] = useState(null);

  // Separate state for each filter
  const [riderTypeFilter, setRiderTypeFilter] = useState(COMMON_FILTERS.ALL);
  const [includeInactive, setIncludeInactive] = useState(false);

  // Load riders from service
  useEffect(() => {
    loadRiders();
  }, []);

  const loadRiders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await riderService.getAllWithPairings();
      setRiders(data);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des cavaliers');
    } finally {
      setLoading(false);
    }
  };

  // Filtered list using current filter values
  const filteredRiders = filterRiders(riders, {
    riderType: riderTypeFilter,
    includeInactive,
  });

  // Stats
  const stats = calculateRiderStats(riders);

  // Filter handlers
  const toggleIncludeInactive = () => setIncludeInactive((prev) => !prev);

  // CRUD Handlers
  const handleCreate = () => {
    setEditingRider(null);
    setShowModal(true);
  };

  const handleEdit = (rider) => {
    setEditingRider(rider);
    setShowModal(true);
  };

  const handleViewDetails = (riderId) => setSelectedRiderId(riderId);

  const handleDeleteClick = (rider) => {
    setRiderToDelete(rider);
    setShowDeleteModal(true);
  };

  const handleRemoveFromInventory = async () => {
    if (!riderToDelete) return;
    try {
      const today = new Date().toISOString().split('T')[0];
      await riderService.update(riderToDelete.id, { activity_end_date: today });
      setSuccessMessage("Cavalier retiré de l'inventaire");
      setShowDeleteModal(false);
      await loadRiders();
    } catch (err) {
      setError(err.message);
      setShowDeleteModal(false);
    }
  };

  const handlePermanentDelete = async () => {
    if (!riderToDelete) return;
    try {
      await riderService.delete(riderToDelete.id);
      setSuccessMessage('Cavalier supprimé définitivement');
      setShowDeleteModal(false);
      await loadRiders();
    } catch (err) {
      setError(err.message);
      setShowDeleteModal(false);
    }
  };

  const handleFormSubmit = async (riderData) => {
    try {
      if (editingRider) {
        await riderService.update(editingRider.id, riderData);
        setSuccessMessage('Cavalier modifié avec succès');
      } else {
        await riderService.create(riderData);
        setSuccessMessage('Cavalier créé avec succès');
      }
      setShowModal(false);
      setEditingRider(null);
      await loadRiders();
    } catch (err) {
      setError(err.message);
    }
  };

  // Modal handlers
  const closeRiderModal = () => {
    setShowModal(false);
    setEditingRider(null);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setRiderToDelete(null);
  };

  const closeRiderCard = () => setSelectedRiderId(null);

  // Message handlers
  const clearSuccessMessage = () => setSuccessMessage('');
  const clearError = () => setError(null);

  /**
   * Retourne la liste unique des jours de tous les pairings d'un cavalier
   */
  const getRiderPairingDays = (rider) => {
    if (!rider.pairings || rider.pairings.length === 0) return [];
    const daysSet = new Set();
    rider.pairings.forEach((pairing) => {
      const days = pairing.days || pairing.loan_days || [];
      days.forEach((day) => daysSet.add(day));
    });
    return Array.from(daysSet);
  };

  return {
    riders,
    filteredRiders,
    stats,
    loading,
    error,
    showModal,
    editingRider,
    selectedRiderId,
    showDeleteModal,
    riderToDelete,
    successMessage,
    riderTypeFilter,
    includeInactive,
    toggleIncludeInactive,
    setRiderTypeFilter,
    handleCreate,
    handleEdit,
    handleViewDetails,
    handleDeleteClick,
    handleRemoveFromInventory,
    handlePermanentDelete,
    handleFormSubmit,
    closeRiderModal,
    closeDeleteModal,
    closeRiderCard,
    getRiderPairingDays,
    clearSuccessMessage,
    clearError,
  };
}
```

---

## 📄 useScheduledEvents.js

**Path:** `useScheduledEvents.js`

```
import { useState, useCallback, useEffect } from 'react';
import { calendarService } from '../services/calendarService';

/**
 * Hook to manage scheduled events
 */
export function useScheduledEvents() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null); // ID of slot being processed
  const [actionError, setActionError] = useState(null);

  const loadScheduledSlots = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await calendarService.getScheduledSlots();
      console.log('Loaded scheduled slots:', data);
      setSlots(data || []);
    } catch (err) {
      console.error('Error loading scheduled events:', err);
      setError(err.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load on mount
  useEffect(() => {
    loadScheduledSlots();
  }, [loadScheduledSlots]);

  const validateSlot = useCallback(
    async (slotId) => {
      try {
        setActionLoading(slotId);
        setActionError(null);
        await calendarService.updateSlot(slotId, { slot_status: 'confirmed' });
        await loadScheduledSlots(); // Reload the list
        return true;
      } catch (err) {
        console.error('Error validating slot:', err);
        setActionError(err.message || 'Erreur lors de la validation');
        return false;
      } finally {
        setActionLoading(null);
      }
    },
    [loadScheduledSlots]
  );

  const deleteSlot = useCallback(
    async (slotId) => {
      try {
        setActionLoading(slotId);
        setActionError(null);
        await calendarService.deleteSlot(slotId);
        await loadScheduledSlots(); // Reload the list
        return true;
      } catch (err) {
        console.error('Error deleting slot:', err);
        setActionError(err.message || 'Erreur lors de la suppression');
        return false;
      } finally {
        setActionLoading(null);
      }
    },
    [loadScheduledSlots]
  );

  const refresh = useCallback(() => {
    loadScheduledSlots();
  }, [loadScheduledSlots]);

  return {
    slots,
    loading,
    error,
    actionLoading,
    actionError,
    validateSlot,
    deleteSlot,
    refresh,
  };
}
```

---

## 📄 useEventSlotDetails.js

**Path:** `useEventSlotDetails.js`

```
import { useState, useEffect } from 'react';
import { calendarService } from '../services/calendarService';

/**
 * Hook to fetch event associated with a slot
 * @param {Object} slot - The slot object
 */
export function useEventSlotDetails(slot) {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(Boolean(slot?.event_id));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slot?.event_id) {
      setEvent(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchEvent() {
      try {
        setLoading(true);
        setError(null);
        const data = await calendarService.getEvent(slot.event_id);
        if (!cancelled) {
          setEvent(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchEvent();
    return () => {
      cancelled = true;
    };
  }, [slot?.event_id]);

  return { event, loading, error };
}
```

---
