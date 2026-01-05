import React, { useState, useRef, useEffect } from 'react';
import SingleLessonModal from '../../lessons/SingleLessonModal';
import { format, isToday, isPast, parseISO, endOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Icons } from '../../../lib/libraries/icons.jsx';
import DayHeader from './DayHeader';
import DayGrid from './DayGrid';

function DayColumn({ date, dayName, lessons, onLessonClick, onQuickCreate }) {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState(null);
  const [selectionEnd, setSelectionEnd] = useState(null);
  const [showQuickCreateModal, setShowQuickCreateModal] = useState(false);
  const [quickCreateData, setQuickCreateData] = useState(null);
  const dayGridRef = useRef(null);

  if (!date) {
    return (
      <div className="day-column">
        <DayHeader date={date} dayName={dayName} />
        <div className="day-grid">
          <div className="no-lessons">
            <Icons.Warning style={{ fontSize: '32px', marginBottom: '8px' }} />
            <p>Date invalide</p>
          </div>
        </div>
      </div>
    );
  }

  const dateObj = parseISO(date);
  const isCurrentDay = isToday(dateObj);
  const isPastDay = isPast(endOfDay(dateObj)) && !isCurrentDay;

  const HOUR_HEIGHT = 60;
  const START_HOUR = 8;
  const END_HOUR = 22;

  const timeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + (minutes || 0);
  };

  const calculateLessonStyle = (lesson) => {
    if (!lesson.start_time || !lesson.end_time) {
      return { display: 'none' };
    }

    const startMinutes = timeToMinutes(lesson.start_time);
    const endMinutes = timeToMinutes(lesson.end_time);
    const dayStartMinutes = START_HOUR * 60;

    if (endMinutes < dayStartMinutes || startMinutes > END_HOUR * 60) {
      return { display: 'none' };
    }

    const top = Math.max(0, (startMinutes - dayStartMinutes) * (HOUR_HEIGHT / 60));
    const height = Math.min(
      (endMinutes - startMinutes) * (HOUR_HEIGHT / 60),
      (END_HOUR - START_HOUR) * HOUR_HEIGHT - top
    );

    return {
      top: `${top}px`,
      left: '8px',
      right: '8px',
      height: `${height}px`,
      zIndex: 1,
    };
  };

  const calculateSelectionStyle = () => {
    if (!selectionStart || !selectionEnd) return null;

    const startMinutes = timeToMinutes(selectionStart);
    const endMinutes = timeToMinutes(selectionEnd);
    const dayStartMinutes = START_HOUR * 60;

    if (endMinutes < dayStartMinutes || startMinutes > END_HOUR * 60) {
      return null;
    }

    const top = Math.max(0, (startMinutes - dayStartMinutes) * (HOUR_HEIGHT / 60));
    const height = Math.min(
      (endMinutes - startMinutes) * (HOUR_HEIGHT / 60),
      (END_HOUR - START_HOUR) * HOUR_HEIGHT - top
    );

    return {
      top: `${top}px`,
      left: '0',
      right: '0',
      height: `${height}px`,
    };
  };

  const handleMouseDown = (e, hour, minute) => {
    // Don't start selection if clicking on a lesson
    if (e.target.closest('.lesson-card')) {
      return;
    }

    e.preventDefault();
    const startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    setIsSelecting(true);
    setSelectionStart(startTime);
    setSelectionEnd(startTime);
  };

  const handleMouseMove = (e, hour, minute) => {
    if (!isSelecting) return;

    const currentTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    setSelectionEnd(currentTime);
  };

  const handleMouseUp = () => {
    if (!isSelecting || !selectionStart || !selectionEnd) return;

    const startMinutes = timeToMinutes(selectionStart);
    const endMinutes = timeToMinutes(selectionEnd);

    if (Math.abs(endMinutes - startMinutes) >= 30) {
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
  };

  const validLessons =
    lessons?.filter((lesson) => {
      if (!lesson.start_time || !lesson.end_time) return false;
      const startMinutes = timeToMinutes(lesson.start_time);
      const endMinutes = timeToMinutes(lesson.end_time);
      const dayStartMinutes = START_HOUR * 60;
      const dayEndMinutes = END_HOUR * 60;
      return !(endMinutes < dayStartMinutes || startMinutes > dayEndMinutes);
    }) || [];

  return (
    <div className={`day-column ${isCurrentDay ? 'today' : ''} ${isPastDay ? 'past' : ''}`}>
      <DayHeader date={date} dayName={dayName} />

      <div
        ref={dayGridRef}
        className="day-grid-container"
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <DayGrid
          lessons={validLessons}
          onLessonClick={onLessonClick}
          selectionStyle={calculateSelectionStyle()}
          isSelecting={isSelecting}
          validLessons={validLessons}
          calculateLessonStyle={calculateLessonStyle}
          handleMouseDown={handleMouseDown}
          handleMouseMove={handleMouseMove}
          HOUR_HEIGHT={HOUR_HEIGHT}
          START_HOUR={START_HOUR}
          END_HOUR={END_HOUR}
        />
      </div>

      {/* Quick Create Modal */}
      {showQuickCreateModal && quickCreateData && (
        <SingleLessonModal
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
