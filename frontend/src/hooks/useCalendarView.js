import { useState, useEffect, useCallback, useMemo } from 'react';
import { addWeeks, subWeeks, startOfWeek, format } from 'date-fns';
import { fr } from 'date-fns/locale';

import { EVENT_TYPES, SLOT_STATUSES } from '../lib/domains/events';
import { calendarService } from '../services/calendarService';

/**
 * Custom hook for calendar view functionality
 * Focused on planning_slots as primary data structure
 */
export function useCalendarView() {
  /* -------------------------------------------------------
   * STATE
   * ----------------------------------------------------- */

  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );

  const [weekData, setWeekData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showSingleEventModal, setShowSingleEventModal] = useState(false);

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
      setError(err.message || 'Erreur de chargement');
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

  const handleCreateEvent = useCallback((eventData) => {
    setSelectedEvent(
      eventData || {
        date: format(new Date(), 'yyyy-MM-dd'),
      }
    );
    setShowSingleEventModal(true);
  }, []);

  const handleCreateBlockedTime = useCallback(() => {
    setSelectedEvent({
      date: format(new Date(), 'yyyy-MM-dd'),
      event_type: EVENT_TYPES.BLOCKED,
    });
    setShowSingleEventModal(true);
  }, []);

  const closeEventModal = useCallback(() => {
    setShowEventModal(false);
    setSelectedEvent(null);
  }, []);

  const closeSingleEventModal = useCallback(() => {
    setShowSingleEventModal(false);
    setSelectedEvent(null);
  }, []);

  const handleModalSuccess = useCallback(() => {
    loadWeekData();
    closeEventModal();
    closeSingleEventModal();
  }, [loadWeekData, closeEventModal, closeSingleEventModal]);

  /* -------------------------------------------------------
   * FILTERS
   * ----------------------------------------------------- */

  const handleFilterChange = useCallback((filterKey, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
  }, []);

  /* -------------------------------------------------------
   * WEEK TITLE
   * ----------------------------------------------------- */

  const weekTitle = useMemo(() => {
    const weekEnd = addWeeks(currentWeekStart, 1);
    const startDay = format(currentWeekStart, 'd MMM', { locale: fr });
    const endDay = format(new Date(weekEnd.getTime() - 1), 'd MMM yyyy', { locale: fr });

    return `Semaine du ${startDay} au ${endDay}`;
  }, [currentWeekStart]);

  /* -------------------------------------------------------
   * STATS
   * ----------------------------------------------------- */

  const stats = useMemo(() => {
    if (!weekData?.days) {
      return {
        confirmed: 0,
        scheduled: 0,
        privateLessons: 0,
        groupedLessons: 0,
        services: 0,
      };
    }

    const result = {
      confirmed: 0,
      scheduled: 0,
      privateLessons: 0,
      groupedLessons: 0,
      services: 0,
    };

    weekData.days.forEach((day) => {
      day.slots?.forEach((slot) => {
        /* ---------------------------
         * STATUS COUNTS
         * ------------------------- */

        if (slot.status === SLOT_STATUSES.CONFIRMED) {
          result.confirmed++;
        }

        if (slot.status === SLOT_STATUSES.SCHEDULED) {
          result.scheduled++;
        }

        /* ---------------------------
         * EVENT TYPE COUNTS
         * ------------------------- */

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

          default:
            break;
        }
      });
    });

    return result;
  }, [weekData]);

  /* -------------------------------------------------------
   * API
   * ----------------------------------------------------- */

  return {
    weekData,
    loading,
    error,

    selectedEvent,
    showEventModal,
    showSingleEventModal,

    filters,
    weekTitle,
    stats,

    handlePrevWeek,
    handleNextWeek,
    handleToday,

    handleEventClick,
    handleCreateEvent,
    handleCreateBlockedTime,

    handleFilterChange,

    closeEventModal,
    closeSingleEventModal,
    handleModalSuccess,

    loadWeekData,
  };
}
