import React from 'react';
import { useCalendarView } from '../../hooks/useCalendarView';
import WeekView from '../WeekView';
import LessonModal from '../../lessons/LessonModal';
import TemplateModal from '../../templates/TemplateModal';
import SingleLessonModal from '../../lessons/SingleLessonModal';
import BlockedTimeModal from '../../lessons/BlockedTimeModal';
import CalendarHeader from './CalendarHeader';
import CalendarFilters from './CalendarFilters';
import { Icons } from '../../lib/libraries/icons.jsx';
import '../../styles/components/calendar.css';

function CalendarView() {
  const {
    // State
    weekData,
    loading,
    error,
    selectedLesson,
    showLessonModal,
    showTemplateModal,
    showSingleLessonModal,
    showBlockedTimeModal,
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
    closeTemplateModal,
    closeSingleLessonModal,
    closeBlockedTimeModal,
    handleModalSuccess,

    // Utility functions
    loadWeekData,

    // State setters
    clearError,
  } = useCalendarView();

  if (loading) {
    return (
      <div className="calendar-loading" style={{ textAlign: 'center', padding: '60px' }}>
        <Icons.Loading className="spin" style={{ fontSize: '48px', marginBottom: '16px' }} />
        <h3>Chargement du calendrier...</h3>
        <p style={{ color: '#666' }}>Veuillez patienter pendant que nous chargeons vos cours</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="calendar-error" style={{ textAlign: 'center', padding: '60px' }}>
        <Icons.Warning style={{ fontSize: '48px', marginBottom: '16px', color: '#e53e3e' }} />
        <h3>Erreur de chargement</h3>
        <p style={{ color: '#666', marginBottom: '20px' }}>{error}</p>
        <button className="btn btn-primary" onClick={loadWeekData}>
          <Icons.Refresh /> Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="calendar-view">
      <CalendarHeader
        weekTitle={weekTitle}
        onPrevWeek={handlePrevWeek}
        onNextWeek={handleNextWeek}
        onToday={handleToday}
        onCreateLesson={handleCreateLesson}
        onCreateBlockedTime={handleCreateBlockedTime}
        stats={stats}
      />

      <CalendarFilters filters={useCalendarView().filters} onFilterChange={handleFilterChange} />

      <div className="calendar-content">
        <WeekView weekData={weekData} onLessonClick={handleLessonClick} />
      </div>

      {/* Lesson Modal */}
      {showLessonModal && selectedLesson && (
        <LessonModal
          lesson={selectedLesson}
          onClose={closeLessonModal}
          onSuccess={handleModalSuccess}
        />
      )}

      {/* Template Modal */}
      {showTemplateModal && selectedLesson && (
        <TemplateModal
          template={selectedLesson}
          onClose={closeTemplateModal}
          onSuccess={handleModalSuccess}
        />
      )}

      {/* Single Lesson Modal */}
      {showSingleLessonModal && (
        <SingleLessonModal
          lesson={selectedLesson}
          onClose={closeSingleLessonModal}
          onSuccess={handleModalSuccess}
        />
      )}

      {/* Blocked Time Modal */}
      {showBlockedTimeModal && (
        <BlockedTimeModal
          blockedTime={selectedLesson}
          onClose={closeBlockedTimeModal}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
}

export default CalendarView;
