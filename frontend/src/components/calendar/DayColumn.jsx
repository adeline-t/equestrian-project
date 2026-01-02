import React, { useState, useRef, useEffect } from 'react';
import LessonCard from '../lessons/LessonCard';
import SingleLessonModal from '../lessons/SingleLessonModal';
import { format, isToday, isPast, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Icons } from '../../utils/icons';

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
        <div className="day-header">
          <div className="day-name">
            <Icons.Warning style={{ marginRight: '4px' }} />
            Invalid Date
          </div>
        </div>
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
      return {
        top: '0px',
        height: '60px',
        minHeight: '60px',
      };
    }

    const startMinutes = timeToMinutes(lesson.start_time);
    const endMinutes = timeToMinutes(lesson.end_time);

    const startHour = startMinutes / 60;
    const top = (startHour - START_HOUR) * HOUR_HEIGHT;

    const durationMinutes = endMinutes - startMinutes;
    const height = (durationMinutes / 60) * HOUR_HEIGHT;

    return {
      top: `${Math.max(0, top)}px`,
      height: `${Math.max(30, height)}px`,
      minHeight: `${Math.max(30, height)}px`,
    };
  };

  const validLessons = (lessons || []).filter((lesson) => lesson.start_time && lesson.end_time);

  const handleMouseDown = (e) => {
    // Only start selection if clicking on empty space (not on a lesson)
    if (e.target === e.currentTarget || e.target.classList.contains('day-grid') || e.target.classList.contains('lessons-container') || e.target.classList.contains('no-lessons')) {
      e.preventDefault();
      setIsSelecting(true);
      
      const rect = dayGridRef.current.getBoundingClientRect();
      const y = e.clientY - rect.top;
      
      // Calculate start time from Y position
      const hour = Math.floor(y / HOUR_HEIGHT) + START_HOUR;
      const minute = Math.floor(((y % HOUR_HEIGHT) / HOUR_HEIGHT) * 60);
      
      const startTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      setSelectionStart(startTime);
      setSelectionEnd(startTime);
    }
  };

  const handleMouseMove = (e) => {
    if (!isSelecting) return;
    
    const rect = dayGridRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    
    // Calculate end time from Y position
    const hour = Math.floor(y / HOUR_HEIGHT) + START_HOUR;
    const minute = Math.floor(((y % HOUR_HEIGHT) / HOUR_HEIGHT) * 60);
    
    const endTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    setSelectionEnd(endTime);
  };

  const handleMouseUp = () => {
    if (!isSelecting) return;
    
    setIsSelecting(false);
    
    // Only show modal if selection has meaningful duration (at least 15 minutes)
    if (selectionStart && selectionEnd && selectionStart !== selectionEnd) {
      // Ensure start_time is before end_time
      const start = selectionStart < selectionEnd ? selectionStart : selectionEnd;
      const end = selectionStart < selectionEnd ? selectionEnd : selectionStart;
      
      setQuickCreateData({
        date: date,
        start_time: start,
        end_time: end
      });
      setShowQuickCreateModal(true);
    }
    
    setSelectionStart(null);
    setSelectionEnd(null);
  };

  // Add global mouse event listeners
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isSelecting) {
        handleMouseUp();
      }
    };

    const handleGlobalMouseMove = (e) => {
      if (isSelecting) {
        handleMouseMove(e);
      }
    };

    if (isSelecting) {
      document.addEventListener('mouseup', handleGlobalMouseUp);
      document.addEventListener('mousemove', handleGlobalMouseMove);
    }

    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, [isSelecting, selectionStart, selectionEnd]);

  const calculateSelectionStyle = () => {
    if (!selectionStart || !selectionEnd) return null;
    
    const startMinutes = timeToMinutes(selectionStart);
    const endMinutes = timeToMinutes(selectionEnd);
    
    const startHour = startMinutes / 60;
    const top = (startHour - START_HOUR) * HOUR_HEIGHT;
    
    const durationMinutes = Math.abs(endMinutes - startMinutes);
    const height = (durationMinutes / 60) * HOUR_HEIGHT;
    
    return {
      position: 'absolute',
      left: '0',
      right: '0',
      top: `${Math.max(0, top)}px`,
      height: `${Math.max(15, height)}px`,
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      border: '2px dashed #3b82f6',
      borderRadius: '4px',
      zIndex: 10,
      pointerEvents: 'none'
    };
  };

  return (
    <div className={`day-column ${isCurrentDay ? 'today' : ''} ${isPastDay ? 'past' : ''}`}>
      <div className="day-header">
        <div className="day-name">{dayName}</div>
        <div className="day-date">
          <Icons.Calendar style={{ marginRight: '4px', fontSize: '12px' }} />
          {format(dateObj, 'dd MMM', { locale: fr })}
        </div>
        {isCurrentDay && (
          <span className="today-badge">
            <Icons.Check style={{ marginRight: '4px', fontSize: '10px' }} />
            Aujourd'hui
          </span>
        )}
      </div>

      <div 
        className="day-grid"
        ref={dayGridRef}
        onMouseDown={handleMouseDown}
        style={{ cursor: isSelecting ? 'crosshair' : 'default' }}
      >
        <div className="hour-markers">
          {Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => START_HOUR + i).map(
            (hour) => (
              <div
                key={hour}
                className="hour-marker"
                style={{ top: `${(hour - START_HOUR) * HOUR_HEIGHT}px` }}
              >
                <span className="hour-label">
                  <Icons.Clock style={{ fontSize: '8px', marginRight: '2px' }} />
                  {`${hour}:00`}
                </span>
              </div>
            )
          )}
        </div>

        {/* Selection overlay */}
        {isSelecting && calculateSelectionStyle() && (
          <div style={calculateSelectionStyle()} />
        )}

        {validLessons.length === 0 ? (
          <div className="no-lessons">
            <Icons.Calendar style={{ fontSize: '32px', color: '#adb5bd', marginBottom: '8px' }} />
            <p>Cliquez et glissez pour créer un cours</p>
          </div>
        ) : (
          <div className="lessons-container">
            {validLessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                onClick={() => onLessonClick(lesson)}
                style={calculateLessonStyle(lesson)}
              />
            ))}
          </div>
        )}
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
