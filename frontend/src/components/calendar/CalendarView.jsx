import React from 'react';
import PropTypes from 'prop-types';

import { useCalendarView } from '../../hooks/useCalendarView';
import WeekView from './WeekView';
import ErrorBoundary from '../common/ErrorBoundary';
import { Icons } from '../../lib/icons';

import { getEventTypeOptions, getStatusOptions, isBlockedEventFull } from '../../lib/domain/events';

import '../../styles/common/index.css';
import '../../styles/components/calendar.css';

/* -------------------------------------------------------
 * ERROR STATE
 * ----------------------------------------------------- */

function CalendarError({ error, onRetry }) {
  return (
    <div className="calendar-error" role="alert">
      <Icons.Warning style={{ fontSize: 48, marginBottom: 16, color: '#e53e3e' }} />
      <h3>Erreur de chargement</h3>
      <p>{error}</p>
      <button className="btn btn-primary" onClick={onRetry}>
        <Icons.Repeat /> Réessayer
      </button>
    </div>
  );
}

CalendarError.propTypes = {
  error: PropTypes.string.isRequired,
  onRetry: PropTypes.func.isRequired,
};

/* -------------------------------------------------------
 * LOADING STATE
 * ----------------------------------------------------- */

function CalendarLoading() {
  return (
    <div className="calendar-loading" role="status" aria-live="polite">
      <Icons.Loading className="spin" style={{ fontSize: 48, marginBottom: 16 }} />
      <h3>Chargement du calendrier…</h3>
      <p>Veuillez patienter pendant le chargement du planning</p>
    </div>
  );
}

/* -------------------------------------------------------
 * HEADER
 * ----------------------------------------------------- */

function CalendarHeader({ weekTitle, onPrevWeek, onNextWeek, onToday, stats }) {
  return (
    <div className="calendar-header" role="banner">
      <div className="calendar-header-title">
        <h2 className="calendar-title">{weekTitle}</h2>

        <div className="calendar-nav-buttons">
          <button className="btn btn-secondary btn-sm" onClick={onPrevWeek}>
            <Icons.ChevronLeft /> Précédente
          </button>

          <button className="btn btn-primary" onClick={onToday}>
            <Icons.Calendar /> Aujourd'hui
          </button>

          <button className="btn btn-secondary btn-sm" onClick={onNextWeek}>
            Suivante <Icons.ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}

CalendarHeader.propTypes = {
  weekTitle: PropTypes.string.isRequired,
  onPrevWeek: PropTypes.func.isRequired,
  onNextWeek: PropTypes.func.isRequired,
  onToday: PropTypes.func.isRequired,
  stats: PropTypes.shape({
    total: PropTypes.number,
    confirmed: PropTypes.number,
    blocked: PropTypes.number,
  }).isRequired,
};

/* -------------------------------------------------------
 * FILTERS - MODIFIÉ
 * ----------------------------------------------------- */

function CalendarFilters({
  filters,
  onFilterChange,
  onCreateEvent,
  onCreateBlockedTime,
  onShowScheduled,
}) {
  return (
    <div className="calendar-filters">
      <div className="filters-row">
        <div className="filters-controls">
          <div className="filter-group">
            <label>Type</label>
            <select
              className="form-select"
              value={filters.eventType}
              onChange={(e) => onFilterChange('eventType', e.target.value)}
            >
              <option value="">Tous les types</option>
              {getEventTypeOptions().map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Statut</label>
            <select
              className="form-select"
              value={filters.status}
              onChange={(e) => onFilterChange('status', e.target.value)}
            >
              <option value="">Tous les statuts</option>
              {getStatusOptions().map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="filters-actions">
          <button className="btn btn-info" onClick={onShowScheduled}>
            <Icons.Calendar /> Événements programmés
          </button>

          <button className="btn btn-success" onClick={onCreateEvent}>
            <Icons.Add /> Nouvel événement
          </button>

          <button className="btn btn-warning" onClick={onCreateBlockedTime}>
            <Icons.Blocked /> Bloquer un créneau
          </button>
        </div>
      </div>
    </div>
  );
}

CalendarFilters.propTypes = {
  filters: PropTypes.object.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onCreateEvent: PropTypes.func.isRequired,
  onCreateBlockedTime: PropTypes.func.isRequired,
  onShowScheduled: PropTypes.func.isRequired,
};

/* -------------------------------------------------------
 * MODALS - MODIFIÉ
 * ----------------------------------------------------- */

function CalendarModals({
  showEventModal,
  showSingleEventModal,
  showBlockedTimeModal,
  showScheduledModal,
  selectedEvent,
  onCloseEventModal,
  onCloseSingleEventModal,
  onCloseBlockedTimeModal,
  onCloseScheduledModal,
  onModalSuccess,
  onSlotClick,
}) {
  const BlockedEventModal = React.lazy(() => import('../events/edit/BlockedEventModal'));
  const EventModal = React.lazy(() => import('../events/edit/EventModal'));
  const CreateEventModal = React.lazy(() => import('../events/create/CreateEventModal'));
  const CreateBlockedTimeModal = React.lazy(() =>
    import('../events/create/CreateBlockedTimeModal')
  );
  const ScheduledEventsModal = React.lazy(() => import('../events/edit/ScheduledEventsModal'));

  return (
    <React.Suspense fallback={null}>
      {showEventModal &&
        selectedEvent?.slot &&
        (isBlockedEventFull(selectedEvent) ? (
          <BlockedEventModal
            slotId={selectedEvent.slot.slot_id}
            onClose={onCloseEventModal}
            onUpdate={onModalSuccess}
          />
        ) : (
          <EventModal
            slotId={selectedEvent.slot.slot_id}
            onClose={onCloseEventModal}
            onUpdate={onModalSuccess}
          />
        ))}

      {showSingleEventModal && (
        <CreateEventModal
          initialDate={selectedEvent?.date}
          initialStartTime={selectedEvent?.start_time}
          initialEndTime={selectedEvent?.end_time}
          onClose={onCloseSingleEventModal}
          onSuccess={onModalSuccess}
        />
      )}

      {showBlockedTimeModal && (
        <CreateBlockedTimeModal
          initialDate={selectedEvent?.date}
          onClose={onCloseBlockedTimeModal}
          onSuccess={onModalSuccess}
        />
      )}

      {showScheduledModal && (
        <ScheduledEventsModal onClose={onCloseScheduledModal} onSlotClick={onSlotClick} />
      )}
    </React.Suspense>
  );
}

CalendarModals.propTypes = {
  showEventModal: PropTypes.bool.isRequired,
  showSingleEventModal: PropTypes.bool.isRequired,
  showBlockedTimeModal: PropTypes.bool.isRequired,
  showScheduledModal: PropTypes.bool.isRequired,
  selectedEvent: PropTypes.object,
  onCloseEventModal: PropTypes.func.isRequired,
  onCloseSingleEventModal: PropTypes.func.isRequired,
  onCloseBlockedTimeModal: PropTypes.func.isRequired,
  onCloseScheduledModal: PropTypes.func.isRequired,
  onModalSuccess: PropTypes.func.isRequired,
  onSlotClick: PropTypes.func.isRequired,
};

/* -------------------------------------------------------
 * MAIN VIEW - MODIFIÉ
 * ----------------------------------------------------- */

function CalendarView() {
  const {
    weekData,
    loading,
    error,
    selectedEvent,
    showEventModal,
    showSingleEventModal,
    showBlockedTimeModal,
    showScheduledModal,
    filters,
    weekTitle,
    stats,

    handlePrevWeek,
    handleNextWeek,
    handleToday,

    handleSlotClick,
    handleEventClick,
    handleCreateEvent,
    handleCreateBlockedTime,
    handleShowScheduled,
    handleFilterChange,

    closeEventModal,
    closeSingleEventModal,
    closeBlockedTimeModal,
    closeScheduledModal,
    handleModalSuccess,

    loadWeekData,
  } = useCalendarView();

  if (loading) return <CalendarLoading />;
  if (error) return <CalendarError error={error} onRetry={loadWeekData} />;

  return (
    <div className="calendar-view">
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
        onShowScheduled={handleShowScheduled}
      />

      <WeekView
        weekData={weekData || { days: [] }}
        onEventClick={handleEventClick}
        onQuickCreate={handleCreateEvent}
        filters={filters}
      />

      <CalendarModals
        showEventModal={showEventModal}
        showSingleEventModal={showSingleEventModal}
        showBlockedTimeModal={showBlockedTimeModal}
        showScheduledModal={showScheduledModal}
        selectedEvent={selectedEvent}
        onCloseEventModal={closeEventModal}
        onCloseSingleEventModal={closeSingleEventModal}
        onCloseBlockedTimeModal={closeBlockedTimeModal}
        onCloseScheduledModal={closeScheduledModal}
        onModalSuccess={handleModalSuccess}
        onSlotClick={handleSlotClick}
      />
    </div>
  );
}

/* Export reste identique */
export default function CalendarViewWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <CalendarView />
    </ErrorBoundary>
  );
}
