import React, { useState, useRef, useCallback, useMemo } from 'react';
import SingleLessonModal from '../../lessons/SingleLessonModal';
import { format, isToday, isPast, parseISO, endOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Icons } from '../../../lib/icons';
import {
  timeToMinutes,
  calculateLessonStyle,
  calculateSelectionStyle,
} from '../../../lib/helpers/shared/formatters/time';
import { getValidLessons } from '../../../lib/helpers/domains/lessons/validators';
import DayHeader from './DayHeader';
import DayGrid from './DayGrid';

/**
 * Calendar configuration constants
 */
const CALENDAR_CONFIG = {
  HOUR_HEIGHT: 60,
  START_HOUR: 8,
  END_HOUR: 22,
  MIN_SELECTION_DURATION: 30, // minutes
};

function DayColumn({ date, dayName, lessons, onLessonClick, onQuickCreate }) {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState(null);
  const [selectionEnd, setSelectionEnd] = useState(null);
  const [showQuickCreateModal, setShowQuickCreateModal] = useState(false);
  const [quickCreateData, setQuickCreateData] = useState(null);
  const dayGridRef = useRef(null);

  const { HOUR_HEIGHT, START_HOUR, END_HOUR, MIN_SELECTION_DURATION } = CALENDAR_CONFIG;

  if (!date) {
    return (
      <div className="day-column" role="region" aria-label="Colonne du jour invalide">
        <DayHeader date={date} dayName={dayName} />
        <div className="day-grid">
          <div className="no-lessons">
            <Icons.Warning style={{ fontSize: '32px', marginBottom: '8px' }} aria-hidden="true" />
            <p>Date invalide</p>
          </div>
        </div>
      </div>
    );
  }

  const dateObj = parseISO(date);
  const isCurrentDay = isToday(dateObj);
  const isPastDay = isPast(endOfDay(dateObj)) && !isCurrentDay;

  // Memoized valid lessons
  const validLessons = useMemo(
    () => getValidLessons(lessons, START_HOUR, END_HOUR),
    [lessons, START_HOUR, END_HOUR]
  );

  // Memoized lesson style calculator
  const calculateLessonStyleMemo = useCallback(
    (lesson) => calculateLessonStyle(lesson, HOUR_HEIGHT, START_HOUR, END_HOUR),
    [HOUR_HEIGHT, START_HOUR, END_HOUR]
  );

  // Memoized selection style calculator
  const calculateSelectionStyleMemo = useCallback(
    () => calculateSelectionStyle(selectionStart, selectionEnd, HOUR_HEIGHT, START_HOUR, END_HOUR),
    [selectionStart, selectionEnd, HOUR_HEIGHT, START_HOUR, END_HOUR]
  );

  const handleMouseDown = useCallback((e, hour, minute) => {
    if (e.target.closest('.lesson-card')) {
      return;
    }

    e.preventDefault();
    const startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    setIsSelecting(true);
    setSelectionStart(startTime);
    setSelectionEnd(startTime);
  }, []);

  const handleMouseMove = useCallback(
    (e, hour, minute) => {
      if (!isSelecting) return;

      const currentTime = `${hour.toString().padStart(2, '0')}:${minute
        .toString()
        .padStart(2, '0')}`;
      setSelectionEnd(currentTime);
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

  // Cleanup event listeners
  React.useEffect(() => {
    const container = dayGridRef.current;
    if (!container) return;

    const handleMouseUpEvent = () => handleMouseUp();
    const handleMouseLeaveEvent = () => handleMouseUp();

    container.addEventListener('mouseup', handleMouseUpEvent);
    container.addEventListener('mouseleave', handleMouseLeaveEvent);

    return () => {
      container.removeEventListener('mouseup', handleMouseUpEvent);
      container.removeEventListener('mouseleave', handleMouseLeaveEvent);
    };
  }, [handleMouseUp]);

  return (
    <div
      className={`day-column ${isCurrentDay ? 'today' : ''} ${isPastDay ? 'past' : ''}`}
      role="region"
      aria-label={`Colonne du ${dayName}${isCurrentDay ? " (aujourd'hui)" : ''}`}
    >
      <DayHeader date={date} dayName={dayName} />

      <div
        ref={dayGridRef}
        className="day-grid-container"
        role="grid"
        aria-label={`Grille horaire du ${dayName}`}
      >
        <DayGrid
          lessons={validLessons}
          onLessonClick={onLessonClick}
          selectionStyle={calculateSelectionStyleMemo()}
          isSelecting={isSelecting}
          calculateLessonStyle={calculateLessonStyleMemo}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          HOUR_HEIGHT={HOUR_HEIGHT}
          START_HOUR={START_HOUR}
          END_HOUR={END_HOUR}
        />
      </div>

      {showQuickCreateModal && quickCreateData && (
        <SingleLessonModal
          lesson={null}
          onClose={() => {
            setShowQuickCreateModal(false);
            setQuickCreateData(null);
          }}
          onSuccess={() => {
            setShowQuickCreateModal(false);
            setQuickCreateData(null);
            if (onQuickCreate) {
              onQuickCreate();
            }
          }}
          initialDate={quickCreateData.date}
          initialStartTime={quickCreateData.start_time}
          initialEndTime={quickCreateData.end_time}
        />
      )}
    </div>
  );
}

export default DayColumn;
