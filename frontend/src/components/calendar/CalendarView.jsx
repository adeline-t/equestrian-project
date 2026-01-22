import PropTypes from 'prop-types';
import React from 'react';

import { useCalendarView } from '../../hooks/useCalendarView';
import ErrorBoundary from '../common/ErrorBoundary';
import WeekView from './WeekView';

import { getEventTypeOptions, getStatusOptions, isBlockedEvent } from '../../lib/domain';
import { Icons } from '../../lib/icons';

import '../../styles/features/calendar.css';

/* -------------------------------------------------------
 * HELPER: Check if slot is blocked (no event)
 * ----------------------------------------------------- */
function isBlockedSlot(slot) {
  return isBlockedEvent(slot.events);
}

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
    <div className="calendar-header flex-between mb-20">
      {/* Titre à gauche */}
      <div className="header-title">
        <h2>{weekTitle}</h2>
      </div>

      {/* Boutons à droite */}
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
  stats: PropTypes.shape({
    total: PropTypes.number,
    confirmed: PropTypes.number,
    blocked: PropTypes.number,
  }).isRequired,
};

/* -------------------------------------------------------
 * FILTERS
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
      {/* Ligne des filtres */}
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

      {/* Ligne des boutons */}
      <div className="filters-group">
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
 * MODALS
 * ----------------------------------------------------- */

function CalendarModals({
  showSlotModal,
  showCreateEventModal,
  showCreateBlockedModal,
  showScheduledModal,
  selectedSlot,
  createEventData,
  onCloseSlotModal,
  onCloseCreateEventModal,
  onCloseCreateBlockedModal,
  onCloseScheduledModal,
  onModalSuccess,
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
      {showSlotModal &&
        selectedSlot &&
        (isBlockedSlot(selectedSlot) ? (
          <BlockedEventModal
            slotId={selectedSlot.id}
            onClose={onCloseSlotModal}
            onUpdate={onModalSuccess}
          />
        ) : (
          <EventModal
            slotId={selectedSlot.id}
            eventId={selectedSlot.events?.id}
            onClose={onCloseSlotModal}
            onUpdate={onModalSuccess}
          />
        ))}

      {showCreateEventModal && createEventData && (
        <CreateEventModal
          initialDate={createEventData.date}
          initialStartTime={createEventData.start_time}
          initialEndTime={createEventData.end_time}
          onClose={onCloseCreateEventModal}
          onSuccess={onModalSuccess}
        />
      )}

      {showCreateBlockedModal && createEventData && (
        <CreateBlockedTimeModal
          initialDate={createEventData.date}
          onClose={onCloseCreateBlockedModal}
          onSuccess={onModalSuccess}
        />
      )}

      {showScheduledModal && (
        <ScheduledEventsModal onClose={onCloseScheduledModal} onUpdate={onModalSuccess} />
      )}
    </React.Suspense>
  );
}

CalendarModals.propTypes = {
  showSlotModal: PropTypes.bool.isRequired,
  showCreateEventModal: PropTypes.bool.isRequired,
  showCreateBlockedModal: PropTypes.bool.isRequired,
  showScheduledModal: PropTypes.bool.isRequired,
  selectedSlot: PropTypes.object,
  createEventData: PropTypes.object,
  onCloseSlotModal: PropTypes.func.isRequired,
  onCloseCreateEventModal: PropTypes.func.isRequired,
  onCloseCreateBlockedModal: PropTypes.func.isRequired,
  onCloseScheduledModal: PropTypes.func.isRequired,
  onModalSuccess: PropTypes.func.isRequired,
};

/* -------------------------------------------------------
 * MAIN VIEW
 * ----------------------------------------------------- */

function CalendarView() {
  const {
    weekData,
    loading,
    error,
    selectedSlot,
    createEventData,
    showSlotModal,
    showCreateEventModal,
    showCreateBlockedModal,
    showScheduledModal,
    filters,
    weekTitle,
    stats,

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
        onSlotClick={handleSlotClick}
        onQuickCreate={handleCreateEvent}
      />

      <CalendarModals
        showSlotModal={showSlotModal}
        showCreateEventModal={showCreateEventModal}
        showCreateBlockedModal={showCreateBlockedModal}
        showScheduledModal={showScheduledModal}
        selectedSlot={selectedSlot}
        createEventData={createEventData}
        onCloseSlotModal={closeSlotModal}
        onCloseCreateEventModal={closeCreateEventModal}
        onCloseCreateBlockedModal={closeCreateBlockedModal}
        onCloseScheduledModal={closeScheduledModal}
        onModalSuccess={handleModalSuccess}
      />
    </div>
  );
}

/* Export */
export default function CalendarViewWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <CalendarView />
    </ErrorBoundary>
  );
}
