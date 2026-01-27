import PropTypes from 'prop-types';
import { useState } from 'react';
import ErrorBoundary from '../common/ErrorBoundary';
import { useCalendarView } from '../../hooks/useCalendarView';
import { Icons } from '../../lib/icons';

// Composants partagés
import CalendarHeader from './shared/CalendarHeader';
import CalendarFilters from './shared/CalendarFilters';

// Vues desktop et mobile
import DesktopWeekView from './desktop/DesktopWeekView';
import MobileCalendarView from './mobile/MobileCalendarView';

// Modales
import EventModals from './modals/EventModals';
import ImportPlanningModal from '../home/ImportPlanningModal';

/**
 * CalendarError - État d'erreur
 */
function CalendarError({ error, onRetry }) {
  return (
    <div className="calendar-error" role="alert">
      <Icons.Warning className="calendar-error__icon" />
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

/**
 * CalendarLoading - État de chargement
 */
function CalendarLoading() {
  return (
    <div className="calendar-loading" role="status" aria-live="polite">
      <Icons.Loading className="calendar-loading__spinner" />
      <h3>Chargement…</h3>
    </div>
  );
}

/**
 * CalendarView - Container principal du calendrier
 * Responsabilités :
 * - État global (weekData, loading, error)
 * - Gestion des filtres
 * - Handlers d'événements
 * - Orchestration desktop/mobile
 */
function CalendarView() {
  const [showImportModal, setShowImportModal] = useState(false);

  // Hook custom qui gère toute la logique métier
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

  // Handlers pour la modale d'import
  const handleShowImport = () => setShowImportModal(true);
  const handleCloseImport = () => setShowImportModal(false);
  const handleImportSuccess = () => {
    loadWeekData();
    handleCloseImport();
  };

  // États de chargement/erreur
  if (loading) return <CalendarLoading />;
  if (error) return <CalendarError error={error} onRetry={loadWeekData} />;

  return (
    <div className="calendar-view">
      {/* Header avec navigation */}
      <CalendarHeader
        weekTitle={weekTitle}
        onPrevWeek={handlePrevWeek}
        onNextWeek={handleNextWeek}
        onToday={handleToday}
      />

      {/* Filtres (desktop uniquement) */}
      <CalendarFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onCreateEvent={handleCreateEvent}
        onCreateBlockedTime={handleCreateBlockedTime}
        onShowScheduled={handleShowScheduled}
        onShowImport={handleShowImport}
      />

      {/* Vue desktop */}
      <DesktopWeekView
        weekData={weekData || { days: [] }}
        onSlotClick={handleSlotClick}
        onQuickCreate={handleCreateEvent}
      />

      {/* Vue mobile */}
      <MobileCalendarView
        weekData={weekData}
        onSlotClick={handleSlotClick}
        onCreateEvent={handleCreateEvent}
        onCreateBlockedTime={handleCreateBlockedTime}
        onShowScheduled={handleShowScheduled}
        onShowImport={handleShowImport}
        currentDate={new Date()}
      />

      {/* Modales */}
      <EventModals
        showSlotModal={showSlotModal}
        showCreateEventModal={showCreateEventModal}
        showCreateBlockedModal={showCreateBlockedModal}
        showScheduledModal={showScheduledModal}
        selectedSlot={selectedSlot}
        isSelectedSlotBlocked={isSelectedSlotBlocked}
        createEventData={createEventData}
        onCloseSlotModal={closeSlotModal}
        onCloseCreateEventModal={closeCreateEventModal}
        onCloseCreateBlockedModal={closeCreateBlockedModal}
        onCloseScheduledModal={closeScheduledModal}
        onModalSuccess={handleModalSuccess}
      />

      {/* Modale d'import */}
      <ImportPlanningModal
        isOpen={showImportModal}
        onClose={handleCloseImport}
        onSuccess={handleImportSuccess}
      />
    </div>
  );
}

/**
 * CalendarViewWithErrorBoundary - Export avec ErrorBoundary
 */
export default function CalendarViewWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <CalendarView />
    </ErrorBoundary>
  );
}
