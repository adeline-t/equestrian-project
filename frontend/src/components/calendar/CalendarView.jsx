import PropTypes from 'prop-types';
import React from 'react';

import { useCalendarView } from '../../hooks/useCalendarView';
import { useAppMode } from '../../context/AppMode.jsx';

import ErrorBoundary from '../common/ErrorBoundary';
import WeekView from './WeekView';

import { getEventTypeOptions, getStatusOptions } from '../../lib/domain';
import { Icons } from '../../lib/icons';

import '../../styles/features/calendar.css';

/* -----------------------
 * ERROR STATE
 * --------------------- */
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

/* -----------------------
 * LOADING STATE
 * --------------------- */
function CalendarLoading() {
  return (
    <div className="calendar-loading" role="status" aria-live="polite">
      <Icons.Loading className="spin" style={{ fontSize: 48, marginBottom: 16 }} />
      <h3>Chargement du calendrier…</h3>
      <p>Veuillez patienter pendant le chargement du planning</p>
    </div>
  );
}

/* -----------------------
 * HEADER
 * --------------------- */
function CalendarHeader({ weekTitle, onPrevWeek, onNextWeek, onToday }) {
  return (
    <div className="calendar-header flex-between mb-20">
      <div className="header-title">
        <h2>{weekTitle}</h2>
      </div>
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
  );
}
CalendarHeader.propTypes = {
  weekTitle: PropTypes.string.isRequired,
  onPrevWeek: PropTypes.func.isRequired,
  onNextWeek: PropTypes.func.isRequired,
  onToday: PropTypes.func.isRequired,
};

/* -----------------------
 * FILTERS
 * --------------------- */
function CalendarFilters({
  filters,
  onFilterChange,
  onCreateEvent,
  onCreateBlockedTime,
  onShowScheduled,
  mode,
}) {
  return (
    <div className="calendar-filters">
      <div className="filter-line">
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

      <div className="filters-group">
        {mode === 'admin' && (
          <>
            <button className="btn btn-info" onClick={onShowScheduled}>
              <Icons.Calendar /> Événements en attente
            </button>
          </>
        )}
        <button className="btn btn-success" onClick={onCreateEvent}>
          <Icons.Add /> Nouvel événement
        </button>
        {mode === 'admin' && (
          <>
            <button className="btn btn-warning" onClick={onCreateBlockedTime}>
              <Icons.Blocked /> Bloquer un créneau
            </button>
          </>
        )}
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
  mode: PropTypes.object.isRequired,
};

/* -----------------------
 * MODALS
 * --------------------- */
function CalendarModals({ mode, ...props }) {
  const BlockedEventModal = React.lazy(() => import('../events/edit/BlockedEventModal'));
  const EventModal = React.lazy(() => import('../events/edit/EventModal'));
  const CreateEventModal = React.lazy(() => import('../events/create/CreateEventModal'));
  const CreateBlockedTimeModal = React.lazy(() =>
    import('../events/create/CreateBlockedTimeModal')
  );
  const ScheduledEventsModal = React.lazy(() => import('../events/edit/ScheduledEventsModal'));

  return (
    <React.Suspense fallback={<div>Chargement du modal...</div>}>
      {props.showSlotModal &&
        props.selectedSlot &&
        (props.isSelectedSlotBlocked ? (
          <BlockedEventModal
            slotId={props.selectedSlot.id}
            onClose={props.onCloseSlotModal}
            onSave={props.onModalSuccess}
            onUpdate={props.onModalSuccess}
          />
        ) : (
          <EventModal
            slotId={props.selectedSlot.id}
            onClose={props.onCloseSlotModal}
            onDelete={props.onModalSuccess}
          />
        ))}

      {props.showCreateEventModal && props.createEventData && (
        <CreateEventModal
          initialDate={props.createEventData.date}
          initialStartTime={props.createEventData.start_time}
          initialEndTime={props.createEventData.end_time}
          onClose={props.onCloseCreateEventModal}
          onSuccess={props.onModalSuccess}
        />
      )}

      {props.showCreateBlockedModal && props.createEventData && (
        <CreateBlockedTimeModal
          initialDate={props.createEventData.date}
          onClose={props.onCloseCreateBlockedModal}
          onSuccess={props.onModalSuccess}
        />
      )}

      {props.showScheduledModal && (
        <ScheduledEventsModal
          onClose={props.onCloseScheduledModal}
          onUpdate={props.onModalSuccess}
        />
      )}
    </React.Suspense>
  );
}

CalendarModals.propTypes = {
  mode: PropTypes.object.isRequired,
};

/* -----------------------
 * MAIN VIEW
 * --------------------- */
function CalendarView() {
  const mode = useAppMode(); // Mode accessible everywhere

  const {
    weekData,
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
    weekTitle,

    handlePrevWeek,
    handleNextWeek,
    handleToday,

    handleSlotClick,
    handleCreateEvent,
    handleCreateBlockedTime,
    handleShowScheduled,
    handleFilterChange,

    closeSlotModal,
    closeCreateEventModal,
    closeCreateBlockedModal,
    closeScheduledModal,
    handleModalSuccess,

    loadWeekData,
  } = useCalendarView();

  if (loading) return <CalendarLoading />;
  if (error) return <CalendarError error={error} onRetry={loadWeekData} />;

  return (
    <div className="calendar-view card-enhanced">
      <CalendarHeader
        weekTitle={weekTitle}
        onPrevWeek={handlePrevWeek}
        onNextWeek={handleNextWeek}
        onToday={handleToday}
      />

      <CalendarFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onCreateEvent={handleCreateEvent}
        onCreateBlockedTime={handleCreateBlockedTime}
        onShowScheduled={handleShowScheduled}
        mode={mode}
      />

      <WeekView
        weekData={weekData || { days: [] }}
        onSlotClick={handleSlotClick}
        onQuickCreate={handleCreateEvent}
      />

      <CalendarModals
        {...{
          mode,
          showSlotModal,
          showCreateEventModal,
          showCreateBlockedModal,
          showScheduledModal,
          selectedSlot,
          isSelectedSlotBlocked,
          createEventData,
          onCloseSlotModal: closeSlotModal,
          onCloseCreateEventModal: closeCreateEventModal,
          onCloseCreateBlockedModal: closeCreateBlockedModal,
          onCloseScheduledModal: closeScheduledModal,
          onModalSuccess: handleModalSuccess,
        }}
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
