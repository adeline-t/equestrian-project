import { useState, useEffect, useCallback, useMemo } from 'react';
import { addWeeks, subWeeks, startOfWeek, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { EVENT_TYPES, SLOT_STATUSES, isBlockedEvent } from '../lib/domain/events';
import { calendarService } from '../services/calendarService';
import { timeToMinutes, formatTimeForInput } from '../lib/helpers/formatters';
import { getTodayISO } from '../lib/helpers';

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
  const [isSelectedSlotBlocked, setIsSelectedSlotBlocked] = useState(false);
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
  const handleSlotClick = useCallback((slot, isSlotEventBlocked) => {
    console.debug('[useCalendarView] slot click', {
      slotId: slot?.id,
      isSelectedSlotBlocked: isSelectedSlotBlocked,
    });
    setSelectedSlot(slot);
    setIsSelectedSlotBlocked(isSlotEventBlocked);
    setShowSlotModal(true);
  }, []);

  const handleCreateEvent = useCallback(
    (selectionData) => {
      setCreateEventData({
        date: selectionData?.date || getTodayISO(),
        start_time: selectionData?.start_time || '16:00',
        end_time: selectionData?.end_time || '17:00',
      });
      setShowCreateEventModal(true);
    },
    [currentWeekStart]
  );

  const handleCreateBlockedTime = useCallback(() => {
    setCreateEventData({
      date: getTodayISO(),
      start_time: '16:00',
      end_time: '17:00',
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

  const hasActiveFilters = useMemo(() => Boolean(filters.eventType || filters.status), [filters]);

  /* -------------------------------------------------------
   * RETURN API
   * ----------------------------------------------------- */
  return {
    weekData: filteredWeekData,
    loading,
    error,
    selectedSlot,
    isSelectedSlotBlocked,
    createEventData,
    showSlotModal,
    showCreateEventModal,
    showCreateBlockedModal,
    showScheduledModal,
    filters,
    hasActiveFilters,
    weekTitle,
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
