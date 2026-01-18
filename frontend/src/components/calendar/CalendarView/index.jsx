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
 * Updated for new schema:
 * - planning_slots: time slots with status
 * - events: event details with type (event, event, blocked, service, loaner_free_time)
 * - event_participants: participant information
 */
function CalendarView() {
  const {
    weekData,
    loading,
    error,
    selectedEvent,
    showEventModal,
    showSingleEventModal,
    showBlockedTimeModal,
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
        onCreateEvent={handleCreateEvent}
        onCreateBlockedTime={handleCreateBlockedTime}
      />

      <div className="calendar-content">
        <WeekView
          weekData={weekData || { days: [] }}
          onEventClick={handleEventClick}
          onQuickCreate={handleCreateEvent}
          filters={filters}
        />
      </div>

      <CalendarModals
        showEventModal={showEventModal}
        showSingleEventModal={showSingleEventModal}
        showBlockedTimeModal={showBlockedTimeModal}
        selectedEvent={selectedEvent}
        onCloseEventModal={closeEventModal}
        onCloseSingleEventModal={closeSingleEventModal}
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
