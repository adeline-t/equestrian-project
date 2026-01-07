import React from 'react';
import { format, startOfWeek } from 'date-fns';
import { fr } from 'date-fns/locale';
import { scheduleApi } from '../services/calendarApi';
import { isLessonConfirmed, isLessonBlocked } from '../lib/domains/lessons/statuses';
import { calculateCalendarStats } from '../lib/helpers/domains/lessons/stats';
import { formatWeekTitle } from '../lib/helpers/shared/formatters/date';

/**
 * Custom hook for managing calendar view data and operations
 * @returns {Object} Calendar data, loading state, error, and handler functions
 */
export function useCalendarView() {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [weekData, setWeekData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [selectedLesson, setSelectedLesson] = React.useState(null);
  const [showLessonModal, setShowLessonModal] = React.useState(false);
  const [showSingleLessonModal, setShowSingleLessonModal] = React.useState(false);
  const [showBlockedTimeModal, setShowBlockedTimeModal] = React.useState(false);
  const [filters, setFilters] = React.useState({
    lessonType: 'all',
    status: 'all',
    showBlocked: true,
  });

  React.useEffect(() => {
    loadWeekData();
  }, [currentDate, filters]);

  const loadWeekData = async () => {
    try {
      setLoading(true);
      setError(null);

      const weekStart = startOfWeek(currentDate, { locale: fr, weekStartsOn: 1 });
      const dateStr = format(weekStart, 'yyyy-MM-dd');

      const response = await scheduleApi.getWeek(dateStr, !filters.showBlocked);
      setWeekData(response);
    } catch (err) {
      console.error('Error loading week data:', err);
      setError(
        err.response?.data?.error || err.message || 'Erreur lors du chargement du calendrier'
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePrevWeek = React.useCallback(() => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() - 7);
      return newDate;
    });
  }, []);

  const handleNextWeek = React.useCallback(() => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + 7);
      return newDate;
    });
  }, []);

  const handleToday = React.useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  const handleLessonClick = React.useCallback((lesson) => {
    setSelectedLesson(lesson);
    setShowLessonModal(true);
    setShowSingleLessonModal(false);
    setShowBlockedTimeModal(false);
  }, []);

  const handleCreateLesson = React.useCallback((initialData = null) => {
    if (initialData) {
      setSelectedLesson({
        date: initialData.date,
        start_time: initialData.start_time,
        end_time: initialData.end_time,
        lesson_type: 'private',
        status: 'scheduled',
      });
    } else {
      setSelectedLesson(null);
    }

    setShowSingleLessonModal(true);
    setShowLessonModal(false);
    setShowBlockedTimeModal(false);
  }, []);

  const handleCreateBlockedTime = React.useCallback(() => {
    setSelectedLesson(null);
    setShowBlockedTimeModal(true);
    setShowLessonModal(false);
    setShowSingleLessonModal(false);
  }, []);

  const handleFilterChange = React.useCallback((filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  }, []);

  const closeLessonModal = React.useCallback(() => {
    setShowLessonModal(false);
    setSelectedLesson(null);
  }, []);

  const closeSingleLessonModal = React.useCallback(() => {
    setShowSingleLessonModal(false);
    setSelectedLesson(null);
  }, []);

  const closeBlockedTimeModal = React.useCallback(() => {
    setShowBlockedTimeModal(false);
    setSelectedLesson(null);
  }, []);

  const handleModalSuccess = React.useCallback(() => {
    closeLessonModal();
    closeSingleLessonModal();
    closeBlockedTimeModal();
    loadWeekData();
  }, []);

  // Use helper function from lib
  const weekTitle = formatWeekTitle(weekData);
  const stats = calculateCalendarStats(weekData);

  const clearError = React.useCallback(() => setError(null), []);

  return {
    // State
    currentDate,
    weekData,
    loading,
    error,
    selectedLesson,
    showLessonModal,
    showSingleLessonModal,
    showBlockedTimeModal,
    filters,
    weekTitle,
    stats,

    // Actions
    handlePrevWeek,
    handleNextWeek,
    handleToday,
    handleLessonClick,
    handleCreateLesson,
    handleCreateBlockedTime,
    handleFilterChange,

    // Modal handlers
    closeLessonModal,
    closeSingleLessonModal,
    closeBlockedTimeModal,
    handleModalSuccess,

    // Utility functions
    loadWeekData,

    // State setters
    clearError,
  };
}
