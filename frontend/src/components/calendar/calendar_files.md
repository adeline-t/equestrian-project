# 📁 Project Files Export

Generated on: Sun Jan 25 20:56:06 CET 2026

## 📄 AllDaySlot.jsx

**Path:** `AllDaySlot.jsx`

```
import { EVENT_TYPES } from '../../lib/domain';
import { getEventTypeConfig, getStatusConfig, isBlockedEvent } from '../../lib/domain/events.js';

export default function AllDaySlot({ slots, onSlotClick }) {
  if (!slots || slots.length === 0) return null;

  return (
    <div className="all-day-slots">
      {slots.map((slot) => {
        const eventType = slot.events?.event_type ?? EVENT_TYPES.BLOCKED;
        const slotStatus = slot.slot_status ?? 'SCHEDULED';

        const eventConfig = getEventTypeConfig(eventType);
        const statusConfig = getStatusConfig(slotStatus);

        const StatusIcon = statusConfig?.icon;

        return (
          <div
            key={slot.id}
            className="all-day-slot-card"
            data-type={eventType}
            onClick={(e) => {
              e.stopPropagation();
              onSlotClick?.(slot, isBlockedEvent(slot.events));
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSlotClick?.(slot, isBlockedEvent(slot.events));
              }
            }}
            tabIndex={0}
            role="button"
            aria-label={`Créneau journée entière: ${
              slot.events?.name || eventConfig?.label || 'Sans titre'
            }`}
          >
            <div className="all-day-slot-content">
              {StatusIcon && <StatusIcon className="all-day-slot-status-icon" />}
              <span className="all-day-slot-name">
                {slot.events?.name || eventConfig?.label || 'Journée entière'}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

---

## 📄 CalendarView.jsx

**Path:** `CalendarView.jsx`

```
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
  onShowImport,
}) {
  const { mode } = useAppMode();

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
            <button className="btn btn-secondary" onClick={onShowImport}>
              <Icons.Add /> Importer un planning
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

CalendarModals.propTypes = {};

/* -----------------------
 * MAIN VIEW
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
    // Recharger les données du calendrier après un import réussi
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

      {/* Import Modal */}
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
```

---

## 📄 DayColumn.jsx

**Path:** `DayColumn.jsx`

```
import { endOfDay, isPast, isToday, parseISO } from 'date-fns';
import { useMemo, useRef } from 'react';
import { useCalendarSelection } from '../../hooks/useCalendarSelection';
import { calculateSlotPosition, getValidSlots } from '../../lib/domain/calendar';
import DayGrid from './DayGrid';
import DayHeader from './DayHeader';
import AllDaySlot from './AllDaySlot';

const CALENDAR_CONFIG = {
  HOUR_HEIGHT: 60,
  START_HOUR: 8,
  END_HOUR: 22,
  MIN_SELECTION_DURATION: 30,
};

export default function DayColumn({ date, dayName, slots, onSlotClick, onQuickCreate }) {
  const dayGridRef = useRef(null);
  const { HOUR_HEIGHT, START_HOUR, END_HOUR, MIN_SELECTION_DURATION } = CALENDAR_CONFIG;

  if (!date)
    return (
      <div className="day-column invalid">
        <DayHeader date={date} dayName={dayName} />
      </div>
    );

  const dateObj = parseISO(date);
  const isCurrentDay = isToday(dateObj);
  const isPastDay = isPast(endOfDay(dateObj)) && !isCurrentDay;

  const { allDaySlots, timedSlots } = useMemo(() => {
    const allSlots = slots || [];
    return {
      allDaySlots: allSlots.filter((s) => s.is_all_day),
      timedSlots: allSlots.filter((s) => !s.is_all_day),
    };
  }, [slots]);

  const validTimedSlots = useMemo(
    () => getValidSlots(timedSlots, START_HOUR, END_HOUR),
    [timedSlots, START_HOUR, END_HOUR]
  );

  const calculateSlotPositionMemo = (slot) => calculateSlotPosition(slot, HOUR_HEIGHT, START_HOUR);

  const { isSelecting, selectionStyle, startSelection, moveSelection, endSelection } =
    useCalendarSelection({
      HOUR_HEIGHT,
      START_HOUR,
      END_HOUR,
      MIN_SELECTION_DURATION,
      onQuickCreate,
      date,
    });

  const handleMouseDown = (e) => {
    if (e.target.closest('.event-slot-wrapper')) return;
    e.preventDefault();

    if (!dayGridRef.current) return;
    const rect = dayGridRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;

    const totalMinutes = (y / HOUR_HEIGHT) * 60;
    const hour = Math.floor(totalMinutes / 60) + START_HOUR;
    const minute = Math.floor(totalMinutes % 60);

    startSelection(hour, minute);
  };

  const handleMouseMove = (e) => {
    if (!isSelecting) return;
    if (!dayGridRef.current) return;

    const rect = dayGridRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;

    const totalMinutes = (y / HOUR_HEIGHT) * 60;
    const hour = Math.floor(totalMinutes / 60) + START_HOUR;
    const minute = Math.floor(totalMinutes % 60);

    moveSelection(hour, minute);
  };

  return (
    <div className={`day-column ${isCurrentDay ? 'today' : ''} ${isPastDay ? 'past' : ''}`}>
      <DayHeader date={date} dayName={dayName} />

      <div className="all-day-section">
        <AllDaySlot slots={allDaySlots} onSlotClick={onSlotClick} />
      </div>

      <div
        ref={dayGridRef}
        className="day-grid-container"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={endSelection}
        onMouseLeave={endSelection}
      >
        <DayGrid
          slots={validTimedSlots}
          onSlotClick={onSlotClick}
          isSelecting={isSelecting}
          selectionStyle={selectionStyle}
          calculateSlotPositionMemo={calculateSlotPositionMemo}
        />
      </div>
    </div>
  );
}
```

---

## 📄 DayGrid.jsx

**Path:** `DayGrid.jsx`

```
import SlotEventGridCard from './SlotEventGridCard';

export default function DayGrid({
  slots,
  onSlotClick,
  isSelecting,
  selectionStyle,
  calculateSlotPositionMemo,
}) {
  const HOUR_HEIGHT = 60;
  const START_HOUR = 8;
  const END_HOUR = 22;
  const hours = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i);

  return (
    <div className="day-grid">
      <div className="hour-markers">
        {hours.map((hour) => {
          const top = `${(hour - START_HOUR) * HOUR_HEIGHT}px`;
          return (
            <div
              key={hour}
              className="hour-marker-row"
              data-hour={`${hour.toString().padStart(2, '0')}:00`}
              style={{ top, height: `${HOUR_HEIGHT}px` }}
            />
          );
        })}
      </div>

      {isSelecting && selectionStyle && (
        <div className="selection-overlay" style={selectionStyle} />
      )}

      {slots && slots.length > 0 && (
        <div className="events-container">
          {slots.map((slot) => {
            const style = calculateSlotPositionMemo(slot);
            if (!style) return null;

            return (
              <div key={slot.id} className="event-slot-wrapper" style={style}>
                <SlotEventGridCard slot={slot} onClick={onSlotClick} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
```

---

## 📄 DayHeader.jsx

**Path:** `DayHeader.jsx`

```
import { isToday, parseISO } from 'date-fns';
import { formatDate } from '../../lib/helpers/formatters';
import { Icons } from '../../lib/icons';

export default function DayHeader({ date, dayName }) {
  if (!date) {
    return (
      <div className="day-header" role="banner">
        <div className="day-name">
          <Icons.Warning aria-hidden="true" />
          Date erronée
        </div>
      </div>
    );
  }

  const dateObj = parseISO(date);
  const isCurrentDay = isToday(dateObj);
  const formattedDate = formatDate(date, 'dd');

  return (
    <div
      className={`day-header ${isCurrentDay ? 'today' : ''}`}
      role="banner"
      aria-label={`${dayName} ${formattedDate}${isCurrentDay ? " (aujourd'hui)" : ''}`}
    >
      <div className="day-name">
        {dayName} {formattedDate}
      </div>
    </div>
  );
}
```

---

## 📄 SlotContent.jsx

**Path:** `SlotContent.jsx`

```
import PropTypes from 'prop-types';
import { getSlotLayout } from '../../lib/config/ui';
import { getInstructorLabel } from '../../lib/domain/domain-constants';
import { getEventTypeConfig, getStatusConfig } from '../../lib/domain/events';
import { formatDuration, formatTime } from '../../lib/helpers/formatters';
import { Icons } from '../../lib/icons';
import '../../styles/features/calendar/calendar.css';

function SlotContent({ slot }) {
  const duration = slot.duration_minutes || 0;
  const layout = getSlotLayout(duration);

  const eventType = slot.events?.event_type || 'blocked';
  const eventConfig = getEventTypeConfig(eventType);

  const statusConfig = getStatusConfig(slot.slot_status);
  const StatusIcon = statusConfig?.icon || Icons.Info;

  const participants = slot.event_participants?.length || 0;
  const maxParticipants = slot.events?.max_participants || 0;

  return (
    <div className={`slot-content`} data-type={eventType} data-layout={layout}>
      {/* HEADER */}
      <div className="slot-header">
        <span className="slot-title">{slot.events.name || eventConfig.label}</span>

        <StatusIcon className="slot-status-icon" />
      </div>

      {/* INSTRUCTOR */}
      {slot.events?.instructor_id && (
        <div className="slot-instructor">
          <Icons.Tag />
          <span>{getInstructorLabel(slot.events.instructor)}</span>
        </div>
      )}

      {/* TIME */}
      <div className="slot-time">
        {formatTime(slot.start_time)} – {formatTime(slot.end_time)}
        {layout !== 'ultra-compact' && (
          <span className="slot-duration">· {formatDuration(duration)}</span>
        )}
      </div>

      {/* PARTICIPANTS */}
      {maxParticipants > 0 && (
        <div className="slot-participants">
          <Icons.Users />
          <span>
            {participants}/{maxParticipants}
          </span>
        </div>
      )}
    </div>
  );
}

SlotContent.propTypes = {
  slot: PropTypes.object.isRequired,
};

export default SlotContent;
```

---

## 📄 SlotEventGridCard.jsx

**Path:** `SlotEventGridCard.jsx`

```
import PropTypes from 'prop-types';
import { isBlockedEvent } from '../../lib/domain';
import '../../styles/features/calendar/calendar.css';
import SlotContent from './SlotContent';

/* ------------------------------
   EventCard Component
--------------------------------*/
function SlotEventGridCard({ slot, onClick }) {
  if (!slot) {
    console.debug('[EventCard] slot is null or undefined');
    return null;
  }

  const handleClick = () => {
    onClick?.(slot, isBlockedEvent(slot.events));
  };

  return (
    <div className="event-card" role="button" tabIndex={0} onClick={handleClick}>
      <SlotContent slot={slot} />
    </div>
  );
}

SlotEventGridCard.propTypes = {
  slot: PropTypes.object.isRequired,
  onClick: PropTypes.func,
};

export default SlotEventGridCard;
```

---

## 📄 WeekView.jsx

**Path:** `WeekView.jsx`

```
import PropTypes from 'prop-types';
import { minutesToTime } from '../../lib/helpers/formatters';
import DayColumn from './DayColumn';

/* -------------------------------------------------------
 * DEBUG FLAG (facile à désactiver)
 * ----------------------------------------------------- */
const DEBUG = true;

/* -------------------------------------------------------
 * WeekView Component
 * ----------------------------------------------------- */
function WeekView({ weekData, onSlotClick, onQuickCreate }) {
  const hours = Array.from({ length: 14 }, (_, i) => i + 8);

  if (!weekData?.days) {
    return <div>Chargement...</div>;
  }

  const handleSlotClick = (slot, isSelectedSlotBlocked) => {
    onSlotClick?.(slot, isSelectedSlotBlocked);
  };

  const handleQuickCreate = (payload) => {
    onQuickCreate?.(payload);
  };

  return (
    <div className="week-view">
      <div className="week-grid desktop-view">
        {/* ================= TIME COLUMN ================= */}
        <div className="time-column">
          <div className="time-header">Heures</div>

          {/* spacer all-day */}
          <div className="time-all-day-spacer" />

          {hours.map((hour) => (
            <div key={hour} className="time-slot">
              {minutesToTime(hour * 60)}
            </div>
          ))}
        </div>

        {/* ================= DAY COLUMNS ================= */}
        {weekData.days.map((day) => (
          <DayColumn
            key={day.date}
            date={day.date}
            dayName={day.day_name}
            slots={day.slots || []}
            onSlotClick={handleSlotClick}
            onQuickCreate={handleQuickCreate}
          />
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------
 * PropTypes
 * ----------------------------------------------------- */
WeekView.propTypes = {
  weekData: PropTypes.shape({
    days: PropTypes.arrayOf(
      PropTypes.shape({
        date: PropTypes.string.isRequired,
        day_name: PropTypes.string,
        slots: PropTypes.array,
      })
    ),
  }),
  onSlotClick: PropTypes.func,
  onQuickCreate: PropTypes.func,
};

export default WeekView;
```

---
