import { endOfDay, isPast, isToday, parseISO } from 'date-fns';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { EVENT_TYPES, getEventTypeConfig } from '../../lib/domain';
import { getStatusConfig, isBlockedEvent } from '../../lib/domain/events.js';
import { calculateSelectionStyle, formatDate, timeToMinutes } from '../../lib/helpers/formatters';
import { getValidSlots } from '../../lib/helpers/validators';
import { Icons } from '../../lib/icons';
import '../../styles/features/calendar.css';
import SlotEventGridCard from './SlotEventGridCard';

const CALENDAR_CONFIG = {
  HOUR_HEIGHT: 60,
  START_HOUR: 8,
  END_HOUR: 22,
  MIN_SELECTION_DURATION: 30,
};

/* -------------------------------------------------------
 * Slot positioning
 * ----------------------------------------------------- */
function calculateSlotPosition(slot, HOUR_HEIGHT, START_HOUR) {
  if (!slot.start_time || !slot.end_time) {
    console.warn('Missing start_time or end_time:', slot);
    return { top: 0, height: 0 };
  }

  const startMinutes = timeToMinutes(slot.start_time);
  const endMinutes = timeToMinutes(slot.end_time);

  if (isNaN(startMinutes) || isNaN(endMinutes)) {
    console.warn('Invalid time values:', {
      slot_id: slot.id,
      start: slot.start_time,
      end: slot.end_time,
    });
    return { top: 0, height: 0 };
  }

  const startOffsetMinutes = startMinutes - START_HOUR * 60;
  const durationMinutes = endMinutes - startMinutes;

  const top = (startOffsetMinutes / 60) * HOUR_HEIGHT;
  const height = (durationMinutes / 60) * HOUR_HEIGHT;

  if (isNaN(top) || isNaN(height) || top < 0 || height <= 0) {
    console.warn('Invalid calculated position:', {
      slot_id: slot.id,
      startMinutes,
      endMinutes,
      top,
      height,
    });
    return { top: 0, height: 0 };
  }

  return { top, height };
}

/* -------------------------------------------------------
 * Day Header
 * ----------------------------------------------------- */
function DayHeader({ date, dayName }) {
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

/* -------------------------------------------------------
 * All-day slots
 * ----------------------------------------------------- */
function AllDaySlots({ slots, onSlotClick }) {
  if (!slots || slots.length === 0) return null;

  return (
    <div className="all-day-slots">
      {slots.map((slot) => {
        const eventType = slot.events?.event_type ?? EVENT_TYPES.BLOCKED;
        const slotStatus = slot.slot_status ?? SLOT_STATUSES.SCHEDULED;

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

/* -------------------------------------------------------
 * Day Grid
 * ----------------------------------------------------- */
function DayGrid({
  slots,
  onSlotClick,
  selectionStyle,
  isSelecting,
  calculateSlotPositionMemo,
  onMouseDown,
  onMouseMove,
}) {
  const { HOUR_HEIGHT, START_HOUR, END_HOUR } = CALENDAR_CONFIG;
  const hours = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i);
  const validSlots = slots || [];

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
              onMouseDown={(e) => onMouseDown(e, hour, 0)}
              onMouseMove={(e) => onMouseMove(e, hour, 0)}
            />
          );
        })}
      </div>

      {isSelecting && selectionStyle && (
        <div className="selection-overlay" style={selectionStyle} />
      )}

      {validSlots.length > 0 && (
        <div className="events-container">
          {validSlots.map((slot) => {
            const style = calculateSlotPositionMemo(slot);

            if (!style || isNaN(style.top) || isNaN(style.height)) {
              console.warn('Skipping slot with invalid style:', slot);
              return null;
            }

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

/* -------------------------------------------------------
 * Day Column (main)
 * ----------------------------------------------------- */
function DayColumn({ date, dayName, slots, onSlotClick, onQuickCreate }) {
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

  const { allDaySlots, timedSlots } = useMemo(() => {
    const allSlots = slots || [];

    return {
      allDaySlots: allSlots.filter((slot) => slot.is_all_day === true),
      timedSlots: allSlots.filter((slot) => slot.is_all_day !== true),
    };
  }, [slots]);

  const validTimedSlots = useMemo(
    () => getValidSlots(timedSlots, START_HOUR, END_HOUR),
    [timedSlots, START_HOUR, END_HOUR]
  );

  const calculateSlotPositionMemo = useCallback(
    (slot) => calculateSlotPosition(slot, HOUR_HEIGHT, START_HOUR),
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

      {/* Section all-day avec hauteur fixe pour maintenir l'alignement */}
      <div className="all-day-section">
        <AllDaySlots slots={allDaySlots} onSlotClick={onSlotClick} />
      </div>

      <div ref={dayGridRef} className="day-grid-container">
        <DayGrid
          slots={validTimedSlots}
          onSlotClick={onSlotClick}
          selectionStyle={calculateSelectionStyleMemo()}
          isSelecting={isSelecting}
          calculateSlotPositionMemo={calculateSlotPositionMemo}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
        />
      </div>
    </div>
  );
}

export default DayColumn;
