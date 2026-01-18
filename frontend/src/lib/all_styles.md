# 📁 Project Files Export

Generated on: Sun Jan 18 02:54:06 CET 2026

## 📄 CalendarError.jsx
**Path:** `CalendarView/CalendarError.jsx`

```
import React from 'react';
import PropTypes from 'prop-types';
import { Icons } from '../../../lib/icons.jsx';

/**
 * Calendar Error State Component
 */
function CalendarError({ error, onRetry }) {
  return (
    <div className="calendar-error" role="alert">
      <Icons.Warning style={{ fontSize: '48px', marginBottom: '16px', color: '#e53e3e' }} />
      <h3>Erreur de chargement</h3>
      <p>{error}</p>
      <button className="btn btn-primary" onClick={onRetry} aria-label="Réessayer le chargement">
        <Icons.Repeat /> Réessayer
      </button>
    </div>
  );
}

CalendarError.propTypes = {
  error: PropTypes.string.isRequired,
  onRetry: PropTypes.func.isRequired,
};

export default CalendarError;
```

---

## 📄 CalendarFilters.jsx
**Path:** `CalendarView/CalendarFilters.jsx`

```
import { CALENDAR_EVENT_TYPE_FILTERS, CALENDAR_STATUS_FILTERS } from '../../../lib/domains/filters';
import { Icons } from '../../../lib/icons';
import '../../../styles/common/index.css';
import '../../../styles/components/calendar.css';

/**
 * Calendar Filters Component
 * Updated for new schema:
 * - event_type: event, event, blocked, service, loaner_free_time
 * - slot_status: scheduled, confirmed, completed, cancelled
 */
const CalendarFilters = ({ filters, onFilterChange, onCreateEvent, onCreateBlockedTime }) => {
  const handleCreateEvent = () => {
    onCreateEvent();
  };

  const handleCreateBlockedTime = () => {
    onCreateBlockedTime();
  };

  return (
    <div className="calendar-filters" role="region" aria-label="Filtres du calendrier">
      <div className="filters-row">
        {/* Filter Controls */}
        <div className="filters-controls">
          <div className="filter-group">
            <label htmlFor="event-type-filter">Type de cours:</label>
            <select
              id="event-type-filter"
              value={filters.eventType}
              onChange={(e) => onFilterChange('eventType', e.target.value)}
              className="form-select"
              aria-label="Filtrer par type de cours"
            >
              {CALENDAR_EVENT_TYPE_FILTERS.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="status-filter">Statut:</label>
            <select
              id="status-filter"
              value={filters.status}
              onChange={(e) => onFilterChange('status', e.target.value)}
              className="form-select"
              aria-label="Filtrer par statut"
            >
              {CALENDAR_STATUS_FILTERS.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="filters-actions">
          <button
            className="btn btn-success"
            onClick={handleCreateEvent}
            title="Créer un nouveau cours"
            aria-label="Créer un nouveau cours"
          >
            <Icons.Add />
            <span className="btn-text">Nouveau cours</span>
          </button>

          <button
            className="btn btn-warning"
            onClick={handleCreateBlockedTime}
            title="Bloquer un créneau"
            aria-label="Bloquer un créneau horaire"
          >
            <Icons.Blocked />
            <span className="btn-text">Bloquer un créneau</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarFilters;
```

---

## 📄 CalendarHeader.jsx
**Path:** `CalendarView/CalendarHeader.jsx`

```
import React from 'react';
import { Icons } from '../../../lib/icons';
import '../../../styles/components/calendar.css';

/**
 * Calendar Header Component
 * Updated for new schema - stats now based on planning_slots.slot_status and events.event_type
 */
const CalendarHeader = ({ weekTitle, onPrevWeek, onNextWeek, onToday, stats }) => {
  return (
    <div className="calendar-header" role="banner">
      {/* Top: Title with Navigation */}
      <div className="calendar-header-title">
        <div className="calendar-title-section">
          <h2 className="calendar-title">{weekTitle}</h2>
        </div>

        <div className="calendar-nav-buttons" role="group" aria-label="Navigation de la semaine">
          <button
            className="btn btn-secondary btn-sm"
            onClick={onPrevWeek}
            title="Semaine précédente"
            aria-label="Aller à la semaine précédente"
          >
            <Icons.ChevronLeft />
            <span className="btn-text">Précédente</span>
          </button>

          <button
            className="btn btn-primary"
            onClick={onToday}
            title="Aller à aujourd'hui"
            aria-label="Aller à la semaine actuelle"
          >
            <Icons.Calendar />
            <span className="btn-text">Aujourd'hui</span>
          </button>

          <button
            className="btn btn-secondary btn-sm"
            onClick={onNextWeek}
            title="Semaine suivante"
            aria-label="Aller à la semaine suivante"
          >
            <span className="btn-text">Suivante</span>
            <Icons.ChevronRight />
          </button>
        </div>
      </div>

      {/* Bottom: Stats */}
      <div className="calendar-header-bottom">
        <div
          className="calendar-stats-compact"
          role="region"
          aria-label="Statistiques de la semaine"
        >
          <div className="stat-compact-item">
            <Icons.List style={{ fontSize: '0.9rem', color: '#2c5aa0' }} aria-hidden="true" />
            <span className="stat-compact-value">{stats.total || 0}</span>
            <span className="stat-compact-label">Total</span>
          </div>

          <div className="stat-compact-item">
            <Icons.Check style={{ fontSize: '0.9rem', color: '#22543d' }} aria-hidden="true" />
            <span className="stat-compact-value">{stats.confirmed || 0}</span>
            <span className="stat-compact-label">Confirmés</span>
          </div>

          <div className="stat-compact-item">
            <Icons.Blocked style={{ fontSize: '0.9rem', color: '#7c2d12' }} aria-hidden="true" />
            <span className="stat-compact-value">{stats.blocked || 0}</span>
            <span className="stat-compact-label">Bloqués</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;
```

---

## 📄 CalendarLoading.jsx
**Path:** `CalendarView/CalendarLoading.jsx`

```
import React from 'react';
import { Icons } from '../../../lib/icons.jsx';

/**
 * Calendar Loading State Component
 */
function CalendarLoading() {
  return (
    <div className="calendar-loading" role="status" aria-live="polite">
      <Icons.Loading className="spin" style={{ fontSize: '48px', marginBottom: '16px' }} />
      <h3>Chargement du calendrier...</h3>
      <p>Veuillez patienter pendant que nous chargeons votre planning</p>
    </div>
  );
}

export default CalendarLoading;
```

---

## 📄 CalendarModals.jsx
**Path:** `CalendarView/CalendarModals.jsx`

```
import React from 'react';
import PropTypes from 'prop-types';
import CreateEventModal from '../../events/EventModal';
import ShowEventModal from '../../events/SingleEventModal';

/**
 * Calendar Modals Component
 * Handles all modal rendering for calendar operations
 * Updated for new schema: planning_slots + events
 */
function CalendarModals({
  showEventModal: showCreateEventModal,
  showSingleEventModal: showEventModal,
  showBlockedTimeModal,
  selectedEvent,
  onCloseEventModal,
  onCloseSingleEventModal,
  onCloseBlockedTimeModal,
  onModalSuccess,
}) {
  return (
    <>
      {/* ShowEventModal for viewing/editing existing events */}
      {showCreateEventModal &&
        selectedEvent &&
        (selectedEvent.event_id || selectedEvent.slot_id) && (
          <CreateEventModal
            event={selectedEvent}
            onClose={onCloseEventModal}
            onUpdate={onModalSuccess}
          />
        )}

      {/* CreateEventModal for creating new events */}
      {showEventModal && (
        <ShowEventModal
          event={null}
          onClose={onCloseSingleEventModal}
          onSuccess={onModalSuccess}
          initialDate={selectedEvent?.date}
          initialStartTime={selectedEvent?.start_time}
          initialEndTime={selectedEvent?.end_time}
        />
      )}
    </>
  );
}

CalendarModals.propTypes = {
  showEventModal: PropTypes.bool.isRequired,
  showSingleEventModal: PropTypes.bool.isRequired,
  showBlockedTimeModal: PropTypes.bool.isRequired,
  selectedEvent: PropTypes.shape({
    slot_id: PropTypes.number,
    event_id: PropTypes.number,
    date: PropTypes.string,
    start_time: PropTypes.string,
    end_time: PropTypes.string,
  }),
  onCloseEventModal: PropTypes.func.isRequired,
  onCloseSingleEventModal: PropTypes.func.isRequired,
  onCloseBlockedTimeModal: PropTypes.func.isRequired,
  onModalSuccess: PropTypes.func.isRequired,
};

export default CalendarModals;
```

---

## 📄 index.jsx
**Path:** `CalendarView/index.jsx`

```
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
```

---

## 📄 DayGrid.jsx
**Path:** `DayColumn/DayGrid.jsx`

```
import React from 'react';
import EventCard from './EventCard/index.jsx';

/**
 * DayGrid Component
 * Displays hour markers and event cards
 * Updated for new schema: events contain slot_id, event_id, and event data
 */
const DayGrid = ({
  events,
  onEventClick,
  selectionStyle,
  isSelecting,
  calculateEventStyle,
  onMouseDown,
  onMouseMove,
  HOUR_HEIGHT = 60,
  START_HOUR = 8,
  END_HOUR = 22,
}) => {
  const hours = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i);
  const validEvents = events || [];

  return (
    <div className="day-grid">
      {/* Hour markers */}
      <div className="hour-markers">
        {hours.map((hour) => (
          <div
            key={hour}
            className="hour-marker-row"
            style={{
              position: 'absolute',
              top: `${(hour - START_HOUR) * HOUR_HEIGHT}px`,
              left: 0,
              right: 0,
              height: `${HOUR_HEIGHT}px`,
              borderBottom: '1px solid #e2e8f0',
            }}
            onMouseDown={(e) => onMouseDown(e, hour, 0)}
            onMouseMove={(e) => onMouseMove(e, hour, 0)}
          ></div>
        ))}
      </div>

      {/* Selection overlay */}
      {isSelecting && selectionStyle && (
        <div
          className="selection-overlay"
          style={{
            position: 'absolute',
            backgroundColor: 'rgba(66,153,225,0.2)',
            border: '2px solid #4299e1',
            borderRadius: 4,
            zIndex: 10,
            pointerEvents: 'none',
            left: 8,
            right: 8,
            width: 'calc(100% - 16px)',
            ...selectionStyle,
          }}
        />
      )}

      {/* Events - now from planning_slots + events */}
      {validEvents.length > 0 && (
        <div className="events-container">
          {validEvents.map((event) => (
            <div
              key={event.slot_id || event.event_id || event.id}
              style={{
                position: 'absolute',
                left: 0,
                right: 4,
                width: 'calc(100% - 4px)',
                ...calculateEventStyle(event),
              }}
            >
              <EventCard event={event} onClick={onEventClick} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DayGrid;
```

---

## 📄 DayHeader.jsx
**Path:** `DayColumn/DayHeader.jsx`

```
import React from 'react';
import { Icons } from '../../../lib/icons';
import { isToday, parseISO, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { DATE_FORMATS } from '../../../lib/config/ui/constants';

const DayHeader = ({ date, dayName }) => {
  if (!date) {
    return (
      <div className="day-header" role="banner">
        <div className="day-name">
          <Icons.Warning style={{ marginRight: '4px' }} aria-hidden="true" />
          Date eronnée
        </div>
      </div>
    );
  }

  const dateObj = parseISO(date);
  const isCurrentDay = isToday(dateObj);

  // Format the date using the constant
  const formattedDate = format(dateObj, 'dd', { locale: fr });

  return (
    <div
      className={`day-header ${isCurrentDay ? 'today' : ''}`}
      role="banner"
      aria-label={`${dayName} ${formattedDate}${isCurrentDay ? " (aujourd'hui)" : ''}`}
    >
      <div className="day-name">
        {dayName} {formattedDate}
      </div>
      {isCurrentDay && (
        <div
          className="today-badge"
          style={{
            marginTop: '4px',
            padding: '2px 8px',
            backgroundColor: '#48bb78',
            color: 'white',
            borderRadius: '12px',
            fontSize: '0.75rem',
            display: 'inline-block',
          }}
          role="status"
          aria-label="Jour actuel"
        >
          Aujourd'hui
        </div>
      )}
    </div>
  );
};

export default DayHeader;
```

---

## 📄 EventCardContent.jsx
**Path:** `DayColumn/EventCard/EventCardContent.jsx`

```
import React from 'react';
import PropTypes from 'prop-types';
import { LAYOUT_STYLES } from '../../../../lib/config/ui/cardStyles';
import {
  HeaderSection,
  TimeSection,
  DurationSection,
  BlockedEventSection,
} from './EventCardSections';

/**
 * Compact layout: Status Badge + Name | Time + Participants
 */
function CompactContent({ event }) {
  return (
    <div style={{ ...LAYOUT_STYLES.column, height: '100%', justifyContent: 'space-between' }}>
      <HeaderSection event={event} isCompact={true} />
      <TimeSection event={event} isCompact={true} />
    </div>
  );
}

/**
 * Standard layout: Status Badge + Name | Time + Participants | Duration
 */
function StandardContent({ event }) {
  return (
    <div style={{ ...LAYOUT_STYLES.column, height: '100%' }}>
      <HeaderSection event={event} isCompact={false} />
      <TimeSection event={event} isCompact={false} />
      <DurationSection event={event} />
    </div>
  );
}

/**
 * Blocked event layout: Icon + Label | Time
 */
function BlockedContent({ event }) {
  return <BlockedEventSection event={event} />;
}

/**
 * Main content component
 */
function EventCardContent({ event, isCompact = false, isBlocked = false }) {
  if (isBlocked) {
    return <BlockedContent event={event} />;
  }

  return isCompact ? <CompactContent event={event} /> : <StandardContent event={event} />;
}

EventCardContent.propTypes = {
  event: PropTypes.object.isRequired,
  isCompact: PropTypes.bool,
  isBlocked: PropTypes.bool,
};

export default EventCardContent;
```

---

## 📄 EventCardIcon.jsx
**Path:** `DayColumn/EventCard/EventCardIcon.jsx`

```
import React from 'react';
import PropTypes from 'prop-types';
import { getEventTypeIcon } from '../../../../lib/domains/events/types.js';

/**
 * Render event type icon
 */
function EventCardIcon({ type, size = '14px' }) {
  const IconComponent = getEventTypeIcon(type);
  return (
    <IconComponent
      style={{ fontSize: size, flexShrink: 0 }}
      aria-hidden="true"
      role="presentation"
    />
  );
}

EventCardIcon.propTypes = {
  type: PropTypes.string.isRequired,
  size: PropTypes.string,
};

export default EventCardIcon;
```

---

## 📄 EventCardSections.jsx
**Path:** `DayColumn/EventCard/EventCardSections.jsx`

```
import React from 'react';
import PropTypes from 'prop-types';
import { Icons } from '../../../../lib/icons.jsx';
import { getStatusBadge } from '../../../../lib/domains/events/statuses.js';
import { formatTime } from '../../../../lib/helpers/shared/formatters/time';
import { formatDuration } from '../../../../lib/helpers/shared/formatters/duration';
import { TEXT_STYLES, LAYOUT_STYLES } from '../../../../lib/config/ui/cardStyles';

/**
 * Status badge section
 */
export function StatusBadgeSection({ status }) {
  const badgeConfig = getStatusBadge(status);
  const IconComponent = badgeConfig.icon;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '4px 4px',
        borderRadius: '10px',
        fontSize: '12px',
        backgroundColor: badgeConfig.bgColor,
        color: badgeConfig.color,
        whiteSpace: 'nowrap',
        flexShrink: 0,
        marginRight: '4px',
      }}
      role="img"
      aria-label={badgeConfig.label}
    >
      <IconComponent aria-hidden="true" />
    </div>
  );
}

StatusBadgeSection.propTypes = {
  status: PropTypes.string.isRequired,
};

/**
 * Participants section
 */
export function ParticipantsSection({ count, max, isCompact = false }) {
  if (max === 0) return null;

  const fontSize = isCompact ? '9px' : '11px';

  return (
    <div
      style={{ ...LAYOUT_STYLES.row, fontSize }}
      role="img"
      aria-label={`${count}${max ? `/${max}` : ''} participants`}
    >
      <Icons.Users style={{ fontSize, flexShrink: 0 }} aria-hidden="true" />
      <span>
        {count}
        {max && `/${max}`}
      </span>
    </div>
  );
}

ParticipantsSection.propTypes = {
  count: PropTypes.number,
  max: PropTypes.number,
  isCompact: PropTypes.bool,
};

/**
 * Header section: Status Badge + Name (max 2 lines)
 */
export function HeaderSection({ event, isCompact = false }) {
  const styles = TEXT_STYLES[isCompact ? 'compact' : 'standard'];

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', minHeight: 0 }}>
      <StatusBadgeSection status={event.status} />
      <span
        style={{
          ...styles.name,
          color: 'white',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          wordBreak: 'break-word',
          lineHeight: '1.2',
          whiteSpace: 'normal',
        }}
      >
        {event.name || 'Cours'}
      </span>
    </div>
  );
}

HeaderSection.propTypes = {
  event: PropTypes.object.isRequired,
  isCompact: PropTypes.bool,
};

/**
 * Time section: Start - End + Participants
 */
export function TimeSection({ event, isCompact = false }) {
  const styles = TEXT_STYLES[isCompact ? 'compact' : 'standard'];

  return (
    <div style={{ ...LAYOUT_STYLES.spaceBetween }}>
      <div
        style={{ ...styles.time, color: 'white' }}
        role="img"
        aria-label={`De ${formatTime(event.start_time)} à ${formatTime(event.end_time)}`}
      >
        {formatTime(event.start_time)} - {formatTime(event.end_time)}
      </div>
      <ParticipantsSection
        count={event.participant_count}
        max={event.max_participants}
        isCompact={isCompact}
      />
    </div>
  );
}

TimeSection.propTypes = {
  event: PropTypes.object.isRequired,
  isCompact: PropTypes.bool,
};

/**
 * Duration section (standard only)
 */
export function DurationSection({ event }) {
  if (!event.duration_minutes) return null;

  return (
    <div
      style={{ ...TEXT_STYLES.standard.duration, color: 'rgba(255,255,255,0.8)' }}
      role="img"
      aria-label={`Durée: ${formatDuration(event.duration_minutes)}`}
    >
      {formatDuration(event.duration_minutes)}
    </div>
  );
}

DurationSection.propTypes = {
  event: PropTypes.object.isRequired,
};

/**
 * Blocked event section: Icon + Label + Time
 */
export function BlockedEventSection({ event }) {
  return (
    <div style={{ ...LAYOUT_STYLES.column, height: '100%' }}>
      <div style={{ display: 'flex', minHeight: 0 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: '14px',
            color: '#e2e3e5',
            whiteSpace: 'nowrap',
            marginRight: '4px',
          }}
          aria-hidden="true"
        >
          <Icons.Blocked />
        </div>
        <span
          style={{
            ...TEXT_STYLES.standard.name,
            fontSize: '10px',
            color: 'white',
          }}
        >
          Période bloquée
        </span>
      </div>
      <div>
        <span
          style={{
            ...TEXT_STYLES.standard.name,
            color: 'white',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            wordBreak: 'break-word',
            lineHeight: '1.2',
            whiteSpace: 'normal',
            fontSize: '14px',
          }}
        >
          {event.name}
        </span>
      </div>
      <div
        style={{ ...TEXT_STYLES.standard.time, color: 'white' }}
        role="img"
        aria-label={`De ${formatTime(event.start_time)} à ${formatTime(event.end_time)}`}
      >
        {formatTime(event.start_time)} - {formatTime(event.end_time)}
      </div>
    </div>
  );
}

BlockedEventSection.propTypes = {
  event: PropTypes.object.isRequired,
};
```

---

## 📄 index.jsx
**Path:** `DayColumn/EventCard/index.jsx`

```
import React from 'react';
import PropTypes from 'prop-types';
import { Icons } from '../../../../lib/icons';
import { getStatusBadge } from '../../../../lib/domains/events/statuses.js';
import { formatTime } from '../../../../lib/helpers/shared/formatters/time';
import { formatDuration } from '../../../../lib/helpers/shared/formatters/duration';
import { TEXT_STYLES, LAYOUT_STYLES } from '../../../../lib/config/ui/cardStyles';

/**
 * Status badge section - uses planning_slots.slot_status
 */
export function StatusBadgeSection({ status }) {
  const badgeConfig = getStatusBadge(status);
  const IconComponent = badgeConfig.icon;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '4px 4px',
        borderRadius: '10px',
        fontSize: '12px',
        backgroundColor: badgeConfig.bgColor,
        color: badgeConfig.color,
        whiteSpace: 'nowrap',
        flexShrink: 0,
        marginRight: '4px',
      }}
      role="img"
      aria-label={badgeConfig.label}
    >
      <IconComponent aria-hidden="true" />
    </div>
  );
}

StatusBadgeSection.propTypes = {
  status: PropTypes.oneOf(['scheduled', 'confirmed', 'completed', 'cancelled']).isRequired,
};

/**
 * Participants section - uses event_participants count
 */
export function ParticipantsSection({ count, max, isCompact = false }) {
  if (max === 0) return null;

  const fontSize = isCompact ? '9px' : '11px';

  return (
    <div
      style={{ ...LAYOUT_STYLES.row, fontSize }}
      role="img"
      aria-label={`${count}${max ? `/${max}` : ''} participants`}
    >
      <Icons.Users style={{ fontSize, flexShrink: 0 }} aria-hidden="true" />
      <span>
        {count}
        {max && `/${max}`}
      </span>
    </div>
  );
}

ParticipantsSection.propTypes = {
  count: PropTypes.number,
  max: PropTypes.number,
  isCompact: PropTypes.bool,
};

/**
 * Header section: Status Badge + Name (max 2 lines)
 */
export function HeaderSection({ event, isCompact = false }) {
  const styles = TEXT_STYLES[isCompact ? 'compact' : 'standard'];

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', minHeight: 0 }}>
      <StatusBadgeSection status={event.status} />
      <span
        style={{
          ...styles.name,
          color: 'white',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          wordBreak: 'break-word',
          lineHeight: '1.2',
          whiteSpace: 'normal',
        }}
      >
        {event.name || 'Cours'}
      </span>
    </div>
  );
}

HeaderSection.propTypes = {
  event: PropTypes.object.isRequired,
  isCompact: PropTypes.bool,
};

/**
 * Time section: Start - End + Participants
 * Uses planning_slots.start_time and end_time
 */
export function TimeSection({ event, isCompact = false }) {
  const styles = TEXT_STYLES[isCompact ? 'compact' : 'standard'];

  return (
    <div style={{ ...LAYOUT_STYLES.spaceBetween }}>
      <div
        style={{ ...styles.time, color: 'white' }}
        role="img"
        aria-label={`De ${formatTime(event.start_time)} à ${formatTime(event.end_time)}`}
      >
        {formatTime(event.start_time)} - {formatTime(event.end_time)}
      </div>
      <ParticipantsSection
        count={event.participant_count || 0}
        max={event.max_participants || 0}
        isCompact={isCompact}
      />
    </div>
  );
}

TimeSection.propTypes = {
  event: PropTypes.object.isRequired,
  isCompact: PropTypes.bool,
};

/**
 * Duration section (standard only)
 */
export function DurationSection({ event }) {
  if (!event.duration_minutes) return null;

  return (
    <div
      style={{ ...TEXT_STYLES.standard.duration, color: 'rgba(255,255,255,0.8)' }}
      role="img"
      aria-label={`Durée: ${formatDuration(event.duration_minutes)}`}
    >
      {formatDuration(event.duration_minutes)}
    </div>
  );
}

DurationSection.propTypes = {
  event: PropTypes.object.isRequired,
};

/**
 * Blocked event section: Icon + Label + Time
 * For event_type = 'blocked'
 */
export function BlockedEventSection({ event }) {
  return (
    <div style={{ ...LAYOUT_STYLES.column, height: '100%' }}>
      <div style={{ display: 'flex', minHeight: 0 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: '14px',
            color: '#e2e3e5',
            whiteSpace: 'nowrap',
            marginRight: '4px',
          }}
          aria-hidden="true"
        >
          <Icons.Blocked />
        </div>
        <span
          style={{
            ...TEXT_STYLES.standard.name,
            fontSize: '10px',
            color: 'white',
          }}
        >
          Période bloquée
        </span>
      </div>
      <div>
        <span
          style={{
            ...TEXT_STYLES.standard.name,
            color: 'white',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            wordBreak: 'break-word',
            lineHeight: '1.2',
            whiteSpace: 'normal',
            fontSize: '14px',
          }}
        >
          {event.name || event.cancellation_reason || 'Bloqué'}
        </span>
      </div>
      <div
        style={{ ...TEXT_STYLES.standard.time, color: 'white' }}
        role="img"
        aria-label={`De ${formatTime(event.start_time)} à ${formatTime(event.end_time)}`}
      >
        {formatTime(event.start_time)} - {formatTime(event.end_time)}
      </div>
    </div>
  );
}

BlockedEventSection.propTypes = {
  event: PropTypes.object.isRequired,
};
```

---

## 📄 index.jsx
**Path:** `DayColumn/index.jsx`

```
import React, { useState, useRef, useCallback, useMemo } from 'react';
import SingleEventModal from '../../events/SingleEventModal';
import { parseISO, isToday, isPast, endOfDay } from 'date-fns';
import { Icons } from '../../../lib/icons';
import {
  timeToMinutes,
  calculateEventStyle,
  calculateSelectionStyle,
} from '../../../lib/helpers/shared/formatters/time';
import { getValidEvents } from '../../../lib/helpers/domains/events/validators';
import DayHeader from './DayHeader';
import DayGrid from './DayGrid';

const CALENDAR_CONFIG = {
  HOUR_HEIGHT: 60,
  START_HOUR: 8,
  END_HOUR: 22,
  MIN_SELECTION_DURATION: 30,
};

/**
 * DayColumn Component
 * Updated for new schema: displays events from planning_slots + events
 */
function DayColumn({ date, dayName, events, onEventClick, onQuickCreate }) {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState(null);
  const [selectionEnd, setSelectionEnd] = useState(null);
  const [showQuickCreateModal, setShowQuickCreateModal] = useState(false);
  const [quickCreateData, setQuickCreateData] = useState(null);
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

  const validEvents = useMemo(
    () => getValidEvents(events, START_HOUR, END_HOUR),
    [events, START_HOUR, END_HOUR]
  );

  const calculateEventStyleMemo = useCallback(
    (event) => calculateEventStyle(event, HOUR_HEIGHT, START_HOUR, END_HOUR),
    [HOUR_HEIGHT, START_HOUR, END_HOUR]
  );

  const calculateSelectionStyleMemo = useCallback(
    () => calculateSelectionStyle(selectionStart, selectionEnd, HOUR_HEIGHT, START_HOUR, END_HOUR),
    [selectionStart, selectionEnd, HOUR_HEIGHT, START_HOUR, END_HOUR]
  );

  const handleMouseDown = useCallback((e, hour, minute) => {
    if (e.target.closest('.event-card')) return;
    e.preventDefault();
    const startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    setIsSelecting(true);
    setSelectionStart(startTime);
    setSelectionEnd(startTime);
  }, []);

  const handleMouseMove = useCallback(
    (e, hour, minute) => {
      if (!isSelecting) return;
      setSelectionEnd(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
    },
    [isSelecting]
  );

  const handleMouseUp = useCallback(() => {
    if (!isSelecting || !selectionStart || !selectionEnd) {
      setIsSelecting(false);
      return;
    }

    const startMinutes = timeToMinutes(selectionStart);
    const endMinutes = timeToMinutes(selectionEnd);
    const durationMinutes = Math.abs(endMinutes - startMinutes);

    if (durationMinutes >= MIN_SELECTION_DURATION) {
      setQuickCreateData({
        date,
        start_time: startMinutes < endMinutes ? selectionStart : selectionEnd,
        end_time: startMinutes < endMinutes ? selectionEnd : selectionStart,
      });
      setShowQuickCreateModal(true);
    }

    setIsSelecting(false);
    setSelectionStart(null);
    setSelectionEnd(null);
  }, [isSelecting, selectionStart, selectionEnd, date, MIN_SELECTION_DURATION]);

  React.useEffect(() => {
    const container = dayGridRef.current;
    if (!container) return;
    container.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('mouseleave', handleMouseUp);
    return () => {
      container.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('mouseleave', handleMouseUp);
    };
  }, [handleMouseUp]);

  return (
    <div className={`day-column ${isCurrentDay ? 'today' : ''} ${isPastDay ? 'past' : ''}`}>
      <DayHeader date={date} dayName={dayName} />
      <div ref={dayGridRef} className="day-grid-container">
        <DayGrid
          events={validEvents}
          onEventClick={onEventClick}
          selectionStyle={calculateSelectionStyleMemo()}
          isSelecting={isSelecting}
          calculateEventStyle={calculateEventStyleMemo}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          HOUR_HEIGHT={HOUR_HEIGHT}
          START_HOUR={START_HOUR}
          END_HOUR={END_HOUR}
        />
      </div>

      {/*
      {showQuickCreateModal && quickCreateData && (
        <SingleEventModal
          event={null}
          onClose={() => {
            setShowQuickCreateModal(false);
            setQuickCreateData(null);
          }}
          onSuccess={() => {
            setShowQuickCreateModal(false);
            setQuickCreateData(null);
            onQuickCreate?.();
          }}
          initialDate={quickCreateData.date}
          initialStartTime={quickCreateData.start_time}
          initialEndTime={quickCreateData.end_time}
        />
      )}
      */}
    </div>
  );
}

export default DayColumn;
```

---

## 📄 WeekView.jsx
**Path:** `WeekView.jsx`

```
import React, { useMemo } from 'react';
import DayColumn from './DayColumn';
import { filterEvents } from '../../lib/helpers/domains/events/filters';
import '../../styles/components/calendar.css';

/**
 * WeekView Component
 * Displays a week grid with days and events
 * Updated for new schema: weekData contains events from planning_slots + events
 */
function WeekView({ weekData, onEventClick, onQuickCreate, filters }) {
  // Filter events based on event_type and slot_status
  const filteredWeekData = useMemo(() => {
    if (!weekData?.days) return { days: [] };
    return {
      ...weekData,
      days: weekData.days.map((day) => ({
        ...day,
        events: filterEvents(day.events, filters),
      })),
    };
  }, [weekData, filters]);

  const hours = Array.from(
    { length: 24 - 8 }, // 8h to 22h
    (_, i) => i + 8
  );

  return (
    <div className="week-view" role="main" aria-label="Vue hebdomadaire du calendrier">
      <div className="week-grid" role="grid" aria-label="Grille de la semaine">
        {/* TIME COLUMN */}
        <div className="time-column" aria-hidden="true">
          <div className="time-header">Heures</div>
          {hours.map((hour) => (
            <div key={hour} className="time-slot">
              {hour}:00
            </div>
          ))}
        </div>

        {/* DAY COLUMNS */}
        {filteredWeekData.days.map((day) => (
          <DayColumn
            key={day.date}
            date={day.date}
            dayName={day.day_name}
            events={day.events}
            onEventClick={onEventClick}
            onQuickCreate={onQuickCreate}
          />
        ))}
      </div>
    </div>
  );
}

export default WeekView;
```

---

