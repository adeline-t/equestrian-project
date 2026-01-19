import { endOfDay, format, isPast, isToday, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { calculateSelectionStyle, timeToMinutes } from '../../lib/helpers/formatters';
import { getValidSlots } from '../../lib/helpers/validators.js';
import { Icons } from '../../lib/icons';
import '../../styles/components/calendar.css';
import EventCard from './EventCard';

const CALENDAR_CONFIG = {
  HOUR_HEIGHT: 60,
  START_HOUR: 8,
  END_HOUR: 22,
  MIN_SELECTION_DURATION: 30,
};

/**
 * Calculate event position and height based on time
 * FIXED: Handles both time strings ("09:00") and numbers (540 minutes)
 */
function getEventStyle(slot, HOUR_HEIGHT, START_HOUR) {
  if (!slot.start_time || !slot.end_time) {
    console.warn('Missing start_time or end_time:', slot);
    return { top: 0, height: 0 };
  }

  let startMinutes, endMinutes;

  // Handle time strings (e.g., "09:00")
  if (typeof slot.start_time === 'string') {
    startMinutes = timeToMinutes(slot.start_time);
  } else {
    // Handle numeric minutes
    startMinutes = slot.start_time;
  }

  if (typeof slot.end_time === 'string') {
    endMinutes = timeToMinutes(slot.end_time);
  } else {
    endMinutes = slot.end_time;
  }

  // Validate we have valid numbers
  if (isNaN(startMinutes) || isNaN(endMinutes)) {
    console.warn('Invalid time values:', {
      start: slot.start_time,
      end: slot.end_time,
      startMinutes,
      endMinutes,
    });
    return { top: 0, height: 0 };
  }

  const startHour = Math.floor(startMinutes / 60);
  const startMinute = startMinutes % 60;
  const endHour = Math.floor(endMinutes / 60);
  const endMinute = endMinutes % 60;

  const top = (startHour - START_HOUR) * HOUR_HEIGHT + (startMinute / 60) * HOUR_HEIGHT;
  const height =
    (endHour - startHour) * HOUR_HEIGHT + ((endMinute - startMinute) / 60) * HOUR_HEIGHT;

  // Safety check: ensure we return valid numbers
  if (isNaN(top) || isNaN(height)) {
    console.warn('Calculated NaN position:', {
      slot,
      startMinutes,
      endMinutes,
      startHour,
      startMinute,
      endHour,
      endMinute,
    });
    return { top: 0, height: 0 };
  }

  return { top, height };
}

/**
 * DayHeader Component
 */
function DayHeader({ date, dayName }) {
  if (!date) {
    return (
      <div className="day-header" role="banner">
        <div className="day-name">
          <Icons.Warning style={{ marginRight: '4px' }} aria-hidden="true" />
          Date erronée
        </div>
      </div>
    );
  }

  const dateObj = parseISO(date);
  const isCurrentDay = isToday(dateObj);
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
}

/**
 * DayGrid Component
 */
function DayGrid({
  slots,
  onEventClick,
  selectionStyle,
  isSelecting,
  calculateEventStyleMemo,
  onMouseDown,
  onMouseMove,
  HOUR_HEIGHT,
  START_HOUR,
  END_HOUR,
}) {
  const hours = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i);
  const validSlots = slots || [];

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
          />
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

      {/* Events (from slots) */}
      {validSlots.length > 0 && (
        <div className="events-container">
          {validSlots.map((slot) => {
            const style = calculateEventStyleMemo(slot);

            // Skip rendering if style is invalid
            if (!style || isNaN(style.top) || isNaN(style.height)) {
              console.warn('Skipping slot with invalid style:', slot);
              return null;
            }

            return (
              <div
                key={slot.slot_id || slot.event_id}
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 4,
                  width: 'calc(100% - 4px)',
                  ...style,
                }}
              >
                <EventCard slot={slot} onClick={onEventClick} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/**
 * DayColumn Component - Main
 * Displays a single day with slots from planning_slots + events
 */
function DayColumn({ date, dayName, slots, onEventClick, onQuickCreate }) {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState(null);
  const [selectionEnd, setSelectionEnd] = useState(null);
  const dayGridRef = useRef(null);

  const { HOUR_HEIGHT, START_HOUR, END_HOUR, MIN_SELECTION_DURATION } = CALENDAR_CONFIG;

  if (!date) {
    return (
      <div className="day-column invalid">
        <DayHeader date={date} dayName={dayName} />
      </div>
    );
  }

  const dateObj = parseISO(date);
  const isCurrentDay = isToday(dateObj);
  const isPastDay = isPast(endOfDay(dateObj)) && !isCurrentDay;

  const validSlots = useMemo(
    () => getValidSlots(slots, START_HOUR, END_HOUR),
    [slots, START_HOUR, END_HOUR]
  );

  const calculateEventStyleMemo = useCallback(
    (slot) => getEventStyle(slot, HOUR_HEIGHT, START_HOUR),
    [HOUR_HEIGHT, START_HOUR]
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
      onQuickCreate?.({
        date,
        start_time: startMinutes < endMinutes ? selectionStart : selectionEnd,
        end_time: startMinutes < endMinutes ? selectionEnd : selectionStart,
      });
    }

    setIsSelecting(false);
    setSelectionStart(null);
    setSelectionEnd(null);
  }, [isSelecting, selectionStart, selectionEnd, date, MIN_SELECTION_DURATION, onQuickCreate]);

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
          slots={validSlots}
          onEventClick={onEventClick}
          selectionStyle={calculateSelectionStyleMemo()}
          isSelecting={isSelecting}
          calculateEventStyleMemo={calculateEventStyleMemo}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          HOUR_HEIGHT={HOUR_HEIGHT}
          START_HOUR={START_HOUR}
          END_HOUR={END_HOUR}
        />
      </div>
    </div>
  );
}

export default DayColumn;
