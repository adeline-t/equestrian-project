import { useState, useEffect, useCallback, useMemo } from 'react';
import { addWeeks, subWeeks, startOfWeek, format } from 'date-fns';
import { fr } from 'date-fns/locale';

import { EVENT_TYPES, SLOT_STATUSES } from '../lib/domain/events';
import { calendarService } from '../services/calendarService';

/**
 * Custom hook for calendar view functionality
 * Manages week navigation, data loading, and event interactions
 */
export function useCalendarView() {
  /* -------------------------------------------------------
   * STATE
   * ----------------------------------------------------- */

  // Week navigation
  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );

  // Data state
  const [weekData, setWeekData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showSingleEventModal, setShowSingleEventModal] = useState(false);
  const [showBlockedTimeModal, setShowBlockedTimeModal] = useState(false);

  // Filter state
  const [filters, setFilters] = useState({
    eventType: '',
    status: '',
  });

  /* -------------------------------------------------------
   * DATA LOADING
   * ----------------------------------------------------- */

  const loadWeekData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await calendarService.getWeekData(currentWeekStart);
      setWeekData(data);
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

  useEffect(() => {
    if (weekData?.days?.[0]?.slots?.[0]) {
      console.log('📅 Sample enriched slot:', {
        original_start: 'from backend',
        enriched_start: weekData.days[0].slots[0].start_time,
        enriched_end: weekData.days[0].slots[0].end_time,
        duration: weekData.days[0].slots[0].duration_minutes,
      });
    }
  }, [weekData]);
  useEffect(() => {
    if (weekData?.days) {
      console.log('📊 Week data loaded:', {
        totalDays: weekData.days.length,
        firstDay: weekData.days[0],
        sampleSlot: weekData.days[0]?.slots?.[0],
      });
    }
  }, [weekData]);

  /* -------------------------------------------------------
   * NAVIGATION HANDLERS
   * ----------------------------------------------------- */

  const handlePrevWeek = useCallback(() => {
    setCurrentWeekStart((prev) => subWeeks(prev, 1));
  }, []);

  const handleNextWeek = useCallback(() => {
    setCurrentWeekStart((prev) => addWeeks(prev, 1));
  }, []);

  const handleToday = useCallback(() => {
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));
  }, []);

  /* -------------------------------------------------------
   * EVENT / MODAL HANDLERS
   * ----------------------------------------------------- */

  const handleEventClick = useCallback((event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  }, []);

  const handleCreateEvent = useCallback(
    (selectionData) => {
      if (selectionData?.date) {
        // L'utilisateur a sélectionné un créneau
        setSelectedEvent({
          date: selectionData.date,
          start_time: selectionData.start_time,
          end_time: selectionData.end_time,
        });
      } else {
        // Création manuelle depuis le bouton
        setSelectedEvent({
          date: format(currentWeekStart, 'yyyy-MM-dd'),
          start_time: '09:00',
          end_time: '10:00',
        });
      }
      setShowSingleEventModal(true);
    },
    [currentWeekStart]
  );

  const handleCreateBlockedTime = useCallback(() => {
    setSelectedEvent({
      date: format(new Date(), 'yyyy-MM-dd'),
      event_type: EVENT_TYPES.BLOCKED,
    });
    setShowBlockedTimeModal(true);
  }, []);

  const closeEventModal = useCallback(() => {
    setShowEventModal(false);
    setSelectedEvent(null);
  }, []);

  const closeSingleEventModal = useCallback(() => {
    setShowSingleEventModal(false);
    setSelectedEvent(null);
  }, []);

  const closeBlockedTimeModal = useCallback(() => {
    setShowBlockedTimeModal(false);
    setSelectedEvent(null);
  }, []);

  const handleModalSuccess = useCallback(() => {
    loadWeekData();
    closeEventModal();
    closeSingleEventModal();
    closeBlockedTimeModal();
  }, [loadWeekData, closeEventModal, closeSingleEventModal, closeBlockedTimeModal]);

  /* -------------------------------------------------------
   * FILTER HANDLERS
   * ----------------------------------------------------- */

  const handleFilterChange = useCallback((filterKey, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      eventType: '',
      status: '',
    });
  }, []);

  /* -------------------------------------------------------
   * COMPUTED VALUES
   * ----------------------------------------------------- */

  // Week title display
  const weekTitle = useMemo(() => {
    const weekEnd = addWeeks(currentWeekStart, 1);
    const startDay = format(currentWeekStart, 'd MMM', { locale: fr });
    const endDay = format(new Date(weekEnd.getTime() - 1), 'd MMM yyyy', { locale: fr });

    return `Semaine du ${startDay} au ${endDay}`;
  }, [currentWeekStart]);

  // Filtered week data
  const filteredWeekData = useMemo(() => {
    if (!weekData?.days) return null;

    // If no filters applied, return original data
    if (!filters.eventType && !filters.status) {
      return weekData;
    }

    // Apply filters
    const filteredDays = weekData.days.map((day) => ({
      ...day,
      slots: day.slots.filter((slot) => {
        let matches = true;

        if (filters.eventType && slot.event_type !== filters.eventType) {
          matches = false;
        }

        if (filters.status && slot.status !== filters.status) {
          matches = false;
        }

        return matches;
      }),
    }));

    return {
      ...weekData,
      days: filteredDays,
    };
  }, [weekData, filters]);

  // Statistics
  const stats = useMemo(() => {
    if (!weekData?.days) {
      return {
        confirmed: 0,
        scheduled: 0,
        privateLessons: 0,
        groupedLessons: 0,
        services: 0,
        blocked: 0,
        total: 0,
      };
    }

    const result = {
      confirmed: 0,
      scheduled: 0,
      privateLessons: 0,
      groupedLessons: 0,
      services: 0,
      blocked: 0,
      total: 0,
    };

    weekData.days.forEach((day) => {
      day.slots?.forEach((slot) => {
        result.total++;

        // Status counts
        if (slot.status === SLOT_STATUSES.CONFIRMED) {
          result.confirmed++;
        }

        if (slot.status === SLOT_STATUSES.SCHEDULED) {
          result.scheduled++;
        }

        // Event type counts
        switch (slot.event_type) {
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

          default:
            break;
        }
      });
    });

    return result;
  }, [weekData]);

  // Check if filters are active
  const hasActiveFilters = useMemo(() => {
    return Boolean(filters.eventType || filters.status);
  }, [filters]);

  /* -------------------------------------------------------
   * RETURN API
   * ----------------------------------------------------- */

  return {
    // Data
    weekData: filteredWeekData,
    loading,
    error,

    // Modal state
    selectedEvent,
    showEventModal,
    showSingleEventModal,
    showBlockedTimeModal,

    // Filters
    filters,
    hasActiveFilters,

    // Computed
    weekTitle,
    stats,

    // Navigation
    handlePrevWeek,
    handleNextWeek,
    handleToday,

    // Event handlers
    handleEventClick,
    handleCreateEvent,
    handleCreateBlockedTime,

    // Filter handlers
    handleFilterChange,
    clearFilters,

    // Modal handlers
    closeEventModal,
    closeSingleEventModal,
    closeBlockedTimeModal,
    handleModalSuccess,

    // Utilities
    loadWeekData,
    currentWeekStart,
  };
}
