import React, { useState, useRef, useEffect } from 'react';
import SingleLessonModal from '../lessons/SingleLessonModal';
import { format, isToday, isPast, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Icons } from '../../lib/libraries/icons.jsx';
import DayHeader from './DayColumn/DayHeader';
import DayGrid from './DayColumn/DayGrid';

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
  const isPastDay = isPast(dateObj) && !isCurrentDay;

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
      zIndex: lesson.is_blocked ? 5 : 1,
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
    if (isPastDay) return;

    e.preventDefault();
    const startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    setIsSelecting(true);
    setSelectionStart(startTime);
    setSelectionEnd(startTime);
  };

  const handleMouseMove = (e, hour, minute) => {
    if (!isSelecting || isPastDay) return;

    const currentTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    setSelectionEnd(currentTime);
  };

  const handleMouseUp = () => {
    if (!isSelecting || !selectionStart || !selectionEnd) return;

    const startMinutes = timeToMinutes(selectionStart);
    const endMinutes = timeToMinutes(selectionEnd);

    if (Math.abs(endMinutes - startMinutes) >= 30) {
      // Only show modal if selection is at least 30 minutes
      setQuickCreateData({
        date,
        start_time: startMinutes < endMinutes ? selectionStart : selectionEnd,
        end_time: startMinutes < endMinutes ? selectionEnd : selectionStart,
      });
      setShowQuickCreateModal(true);
    }

    // Reset selection
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
    <div
      className={`day-column ${isCurrentDay ? 'today' : ''} ${isPastDay ? 'past' : ''}`}
      style={{
        flex: 1,
        minWidth: '200px',
        backgroundColor: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        margin: '0 4px',
      }}
    >
      <DayHeader date={date} dayName={dayName} />

      <div
        ref={dayGridRef}
        className="day-grid-container"
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ position: 'relative' }}
      >
        <DayGrid
          lessons={lessons}
          onLessonClick={onLessonClick}
          selectionStyle={calculateSelectionStyle()}
          isSelecting={isSelecting}
          validLessons={validLessons}
          calculateLessonStyle={calculateLessonStyle}
        />

        {/* Mouse event overlay for selection */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: isPastDay ? -1 : 20,
            cursor: isPastDay ? 'not-allowed' : 'crosshair',
          }}
          onMouseDown={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const y = e.clientY - rect.top;
            const totalMinutes = Math.floor(y / (HOUR_HEIGHT / 60)) + START_HOUR * 60;
            const hour = Math.floor(totalMinutes / 60);
            const minute = Math.floor((totalMinutes % 60) / 30) * 30;
            handleMouseDown(e, hour, minute);
          }}
          onMouseMove={(e) => {
            if (!isSelecting) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const y = e.clientY - rect.top;
            const totalMinutes = Math.floor(y / (HOUR_HEIGHT / 60)) + START_HOUR * 60;
            const hour = Math.floor(totalMinutes / 60);
            const minute = Math.floor((totalMinutes % 60) / 30) * 30;
            handleMouseMove(e, hour, minute);
          }}
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
