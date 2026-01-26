import PropTypes from 'prop-types';
import React, { useState } from 'react';

import { useAppMode } from '../../context/AppMode.jsx';
import { useCalendarView } from '../../hooks/useCalendarView';

import ErrorBoundary from '../common/ErrorBoundary';
import WeekView from './WeekView';
import ImportPlanningModal from '../home/ImportPlanningModal.jsx';

import { getEventTypeOptions, getStatusOptions } from '../../lib/domain';
import { Icons } from '../../lib/icons';

import '../../styles/features/calendar/calendar.css';

import MobileCalendarView from './MobileCalendarView';
import '../../styles/features/calendar/calendar-mobile.css';

/* -----------------------
 * ERROR STATE
 * --------------------- */
function CalendarError({ error, onRetry }) {
  return (
    <div className="calendar-error" role="alert">
      <Icons.Warning style={{ fontSize: 32, marginBottom: 12 }} />
      <h3>Erreur</h3>
      <p>{error}</p>
      <button className="btn btn-primary btn-sm" onClick={onRetry}>
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
      <Icons.Loading className="spin" style={{ fontSize: 32, marginBottom: 12 }} />
      <h3>Chargement…</h3>
    </div>
  );
}

/* -----------------------
 * HEADER COMPACT
 * --------------------- */
function CalendarHeader({ weekTitle, onPrevWeek, onNextWeek, onToday }) {
  return (
    <div className="calendar-header flex-between">
      <h2>{weekTitle}</h2>
      <div className="calendar-nav-buttons">
        <button
          className="btn btn-secondary btn-sm"
          onClick={onPrevWeek}
          title="Semaine précédente"
        >
          <Icons.ChevronLeft />
        </button>
        <button className="btn btn-primary btn-sm" onClick={onToday}>
          Aujourd'hui
        </button>
        <button className="btn btn-secondary btn-sm" onClick={onNextWeek} title="Semaine suivante">
          <Icons.ChevronRight />
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
 * FILTERS COMPACT - TOUT EN LIGNE
 * --------------------- */
function CalendarFilters({
  filters,
  onFilterChange,
  onCreateEvent,
  onCreateBlockedTime,
  onShowScheduled,
  onShowImport,
}) {
  const { mode } = useAppMode();

  return (
    <div className="calendar-filters">
      {/* Filtres à gauche */}
      <div className="filter-line">
        <div className="filter-group">
          <label>Type</label>
          <select
            className="form-select"
            value={filters.eventType}
            onChange={(e) => onFilterChange('eventType', e.target.value)}
          >
            <option value="">Tous</option>
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
            <option value="">Tous</option>
            {getStatusOptions().map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Actions à droite */}
      <div className="filters-group">
        {mode === 'admin' && (
          <>
            <button
              className="btn btn-info btn-sm"
              onClick={onShowScheduled}
              title="Événements en attente"
            >
              <Icons.Calendar />
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={onShowImport}
              title="Importer un planning"
            >
              <Icons.Add />
            </button>
          </>
        )}
        <button className="btn btn-success btn-sm" onClick={onCreateEvent} title="Nouvel événement">
          <Icons.Add />
        </button>
        {mode === 'admin' && (
          <button
            className="btn btn-warning btn-sm"
            onClick={onCreateBlockedTime}
            title="Bloquer un créneau"
          >
            <Icons.Blocked />
          </button>
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
  onShowImport: PropTypes.func.isRequired,
};

/* -----------------------
 * MODALS
 * --------------------- */
function CalendarModals({ ...props }) {
  const BlockedEventModal = React.lazy(() => import('../events/edit/BlockedEventModal'));
  const EventModal = React.lazy(() => import('../events/edit/EventModal'));
  const CreateEventModal = React.lazy(() => import('../events/create/CreateEventModal'));
  const CreateBlockedTimeModal = React.lazy(() =>
    import('../events/create/CreateBlockedTimeModal')
  );
  const ScheduledEventsModal = React.lazy(() => import('../events/edit/ScheduledEventsModal'));

  return (
    <React.Suspense fallback={<div>Chargement…</div>}>
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

CalendarModals.propTypes = {};

/* -----------------------
 * MAIN VIEW - OPTIMISÉ POUR L'ESPACE
 * --------------------- */
function CalendarView() {
  const [showImportModal, setShowImportModal] = useState(false);

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

  const handleShowImport = () => {
    setShowImportModal(true);
  };

  const handleCloseImport = () => {
    setShowImportModal(false);
  };

  const handleImportSuccess = () => {
    loadWeekData();
  };

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
        onShowImport={handleShowImport}
      />

      <WeekView
        weekData={weekData || { days: [] }}
        onSlotClick={handleSlotClick}
        onQuickCreate={handleCreateEvent}
      />

      <MobileCalendarView
        weekData={weekData}
        onSlotClick={handleSlotClick}
        onCreateEvent={() => setIsCreateModalOpen(true)}
        currentDate={new Date()}
      />

      <CalendarModals
        {...{
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

      <ImportPlanningModal
        isOpen={showImportModal}
        onClose={handleCloseImport}
        onSuccess={handleImportSuccess}
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
