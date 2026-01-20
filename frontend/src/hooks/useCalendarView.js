import { useState, useEffect, useCallback, useMemo } from 'react';
import { addWeeks, subWeeks, startOfWeek, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { EVENT_TYPES, SLOT_STATUSES } from '../lib/domain/events';
import { calendarService } from '../services/calendarService';
import { timeToMinutes, minutesToTime } from '../lib/helpers/formatters';

/**
 * Normalize slot times for UI display (HH:mm)
 */
const normalizeSlotTimes = (slot) => {
  if (!slot) return slot;

  const start_time = slot.start_time?.slice(11, 16) || '09:00';
  const end_time = slot.end_time?.slice(11, 16) || '10:00';
  const duration_minutes =
    slot.duration_minutes ?? timeToMinutes(end_time) - timeToMinutes(start_time);

  return { ...slot, start_time, end_time, duration_minutes };
};

/**
 * Custom hook for calendar view functionality
 * Manages week navigation, data loading, and event interactions
 */
export function useCalendarView() {
  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );

  const [weekData, setWeekData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showSingleEventModal, setShowSingleEventModal] = useState(false);
  const [showBlockedTimeModal, setShowBlockedTimeModal] = useState(false);

  const [filters, setFilters] = useState({ eventType: '', status: '' });

  /* -------------------------------------------------------
   * LOAD WEEK DATA
   * ----------------------------------------------------- */
  const loadWeekData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await calendarService.getWeekData(currentWeekStart);
      // Normalize slot times for UI display and filter out cancelled events
      const enrichedDays = (data.days || []).map((day) => ({
        ...day,
        slots: (day.slots || [])
          .filter((slot) => slot.slot_status !== SLOT_STATUSES.CANCELLED)
          .map(normalizeSlotTimes),
      }));
      setWeekData({ ...data, days: enrichedDays });
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
   * EVENT / MODAL HANDLERS
   * ----------------------------------------------------- */
  const handleEventClick = useCallback((event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  }, []);

  const handleCreateEvent = useCallback(
    (selectionData) => {
      setSelectedEvent({
        date: selectionData?.date || format(currentWeekStart, 'yyyy-MM-dd'),
        start_time: selectionData?.start_time || '09:00',
        end_time: selectionData?.end_time || '10:00',
      });
      setShowSingleEventModal(true);
    },
    [currentWeekStart]
  );

  const handleCreateBlockedTime = useCallback(() => {
    setSelectedEvent({
      date: format(new Date(), 'yyyy-MM-dd'),
      event_type: EVENT_TYPES.BLOCKED,
      start_time: '09:00',
      end_time: '10:00',
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
        if (filters.eventType && slot.event_type !== filters.eventType) matches = false;
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
    selectedEvent,
    showEventModal,
    showSingleEventModal,
    showBlockedTimeModal,
    filters,
    hasActiveFilters,
    weekTitle,
    stats,
    handlePrevWeek,
    handleNextWeek,
    handleToday,
    handleEventClick,
    handleCreateEvent,
    handleCreateBlockedTime,
    handleFilterChange,
    clearFilters,
    closeEventModal,
    closeSingleEventModal,
    closeBlockedTimeModal,
    handleModalSuccess,
    loadWeekData,
    currentWeekStart,
  };
}
