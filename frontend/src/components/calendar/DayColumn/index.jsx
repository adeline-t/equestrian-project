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
