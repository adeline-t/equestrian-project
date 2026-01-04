import { useState, useEffect } from 'react';
import { format, startOfWeek } from 'date-fns';
import { fr } from 'date-fns/locale';
import { scheduleApi } from '../services/calendarApi';

/**
 * Custom hook for managing calendar view data and operations
 * @returns {Object} Calendar data, loading state, error, and handler functions
 */
export function useCalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weekData, setWeekData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showSingleLessonModal, setShowSingleLessonModal] = useState(false);
  const [showBlockedTimeModal, setShowBlockedTimeModal] = useState(false);
  const [filters, setFilters] = useState({
    lessonType: 'all',
    status: 'all',
    showBlocked: true,
  });

  useEffect(() => {
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

  const handlePrevWeek = () => {
    setCurrentDate(prev => new Date(prev.setDate(prev.getDate() - 7)));
  };

  const handleNextWeek = () => {
    setCurrentDate(prev => new Date(prev.setDate(prev.getDate() + 7)));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleLessonClick = (lesson) => {
    setSelectedLesson(lesson);
    
    if (lesson.is_template) {
      setShowTemplateModal(true);
    } else if (lesson.is_blocked) {
      setShowBlockedTimeModal(true);
    } else {
      setShowLessonModal(true);
    }
  };

  const handleCreateLesson = () => {
    setSelectedLesson(null);
    setShowSingleLessonModal(true);
  };

  const handleCreateBlockedTime = () => {
    setSelectedLesson(null);
    setShowBlockedTimeModal(true);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  // Modal handlers
  const closeLessonModal = () => {
    setShowLessonModal(false);
    setSelectedLesson(null);
  };

  const closeTemplateModal = () => {
    setShowTemplateModal(false);
    setSelectedLesson(null);
  };

  const closeSingleLessonModal = () => {
    setShowSingleLessonModal(false);
    setSelectedLesson(null);
  };

  const closeBlockedTimeModal = () => {
    setShowBlockedTimeModal(false);
    setSelectedLesson(null);
  };

  const handleModalSuccess = () => {
    // Close all modals
    closeLessonModal();
    closeTemplateModal();
    closeSingleLessonModal();
    closeBlockedTimeModal();
    
    // Reload data
    loadWeekData();
  };

  // Utility functions
  const getWeekTitle = () => {
    if (!weekData || !weekData.week_start || !weekData.week_end) return 'Chargement...';
    
    const start = new Date(weekData.week_start);
    const end = new Date(weekData.week_end);
    
    // Validate dates before formatting
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return 'Semaine en cours';
    }
    
    return `Semaine du ${format(start, 'dd MMMM', { locale: fr })} au ${format(end, 'dd MMMM yyyy', { locale: fr })}`;
  };

  const getCalendarStats = () => {
    if (!weekData || !weekData.days) return { total: 0, confirmed: 0, blocked: 0 };
    
    // Flatten all lessons from all days
    const allLessons = weekData.days.flatMap(day => day.lessons || []);
    
    return {
      total: allLessons.length,
      confirmed: allLessons.filter(l => l.status === 'confirmed').length,
      blocked: allLessons.filter(l => l.is_blocked || l.lesson_type === 'blocked').length,
    };
  };

  // Clear messages
  const clearError = () => setError(null);

  return {
    // State
    currentDate,
    weekData,
    loading,
    error,
    selectedLesson,
    showLessonModal,
    showTemplateModal,
    showSingleLessonModal,
    showBlockedTimeModal,
    filters,
    weekTitle: getWeekTitle(),
    stats: getCalendarStats(),

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
    closeTemplateModal,
    closeSingleLessonModal,
    closeBlockedTimeModal,
    handleModalSuccess,
    
    // Utility functions
    loadWeekData,
    
    // State setters
    clearError,
  };
}