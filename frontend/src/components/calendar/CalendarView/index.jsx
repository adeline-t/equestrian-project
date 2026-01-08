import React from 'react';
import { useCalendarView } from '../../../hooks/useCalendarView';
import WeekView from '../WeekView.jsx';
import CalendarHeader from './CalendarHeader.jsx';
import CalendarFilters from './CalendarFilters.jsx';
import CalendarModals from './CalendarModals.jsx';
import CalendarLoading from './CalendarLoading.jsx';
import CalendarError from './CalendarError.jsx';
import ErrorBoundary from '../../common/ErrorBoundary.jsx';
import '../../../styles/common/index.css';
import '../../../styles/components/calendar.css';

/**
 * Main Calendar View Component
 */
function CalendarView() {
  const {
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
    handlePrevWeek,
    handleNextWeek,
    handleToday,
    handleLessonClick,
    handleCreateLesson,
    handleCreateBlockedTime,
    handleFilterChange,
    closeLessonModal,
    closeSingleLessonModal,
    closeBlockedTimeModal,
    handleModalSuccess,
    loadWeekData,
  } = useCalendarView();

  if (loading) return <CalendarLoading />;
  if (error) return <CalendarError error={error} onRetry={loadWeekData} />;

  return (
    <div className="calendar-view" role="main" aria-label="Vue calendrier">
      <CalendarHeader
        weekTitle={weekTitle}
        onPrevWeek={handlePrevWeek}
        onNextWeek={handleNextWeek}
        onToday={handleToday}
        stats={stats}
      />

      <CalendarFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onCreateLesson={handleCreateLesson}
        onCreateBlockedTime={handleCreateBlockedTime}
      />

      <div className="calendar-content">
        <WeekView
          weekData={weekData || { days: [] }}
          onLessonClick={handleLessonClick}
          onQuickCreate={handleCreateLesson}
          filters={filters}
        />
      </div>

      <CalendarModals
        showLessonModal={showLessonModal}
        showSingleLessonModal={showSingleLessonModal}
        showBlockedTimeModal={showBlockedTimeModal}
        selectedLesson={selectedLesson}
        onCloseLessonModal={closeLessonModal}
        onCloseSingleLessonModal={closeSingleLessonModal}
        onCloseBlockedTimeModal={closeBlockedTimeModal}
        onModalSuccess={handleModalSuccess}
      />
    </div>
  );
}

export default function CalendarViewWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <CalendarView />
    </ErrorBoundary>
  );
}
