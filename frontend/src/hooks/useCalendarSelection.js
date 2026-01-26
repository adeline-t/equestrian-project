import { useState, useCallback } from 'react';
import { timeToMinutes } from '../lib/helpers/formatters';
import { calculateSelectionStyle } from '../lib/domain/calendar';

export function useCalendarSelection({
  HOUR_HEIGHT,
  START_HOUR,
  END_HOUR,
  MIN_SELECTION_DURATION,
  onQuickCreate,
  date,
}) {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState(null);
  const [selectionEnd, setSelectionEnd] = useState(null);

  const startSelection = useCallback((hour, minute) => {
    const startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    setIsSelecting(true);
    setSelectionStart(startTime);
    setSelectionEnd(startTime);
  }, []);

  const moveSelection = useCallback(
    (hour, minute) => {
      if (!isSelecting) return;
      setSelectionEnd(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
    },
    [isSelecting]
  );

  const endSelection = useCallback(() => {
    if (!isSelecting || !selectionStart || !selectionEnd) {
      setIsSelecting(false);
      return;
    }

    const startMinutes = timeToMinutes(selectionStart);
    const endMinutes = timeToMinutes(selectionEnd);
    const duration = Math.abs(endMinutes - startMinutes);

    if (duration >= MIN_SELECTION_DURATION) {
      onQuickCreate?.({
        date,
        start_time: startMinutes < endMinutes ? selectionStart : selectionEnd,
        end_time: startMinutes < endMinutes ? selectionEnd : selectionStart,
      });
    }

    setIsSelecting(false);
    setSelectionStart(null);
    setSelectionEnd(null);
  }, [isSelecting, selectionStart, selectionEnd, MIN_SELECTION_DURATION, onQuickCreate, date]);

  const selectionStyle = calculateSelectionStyle(
    selectionStart,
    selectionEnd,
    HOUR_HEIGHT,
    START_HOUR,
    END_HOUR
  );

  return {
    isSelecting,
    selectionStyle,
    startSelection,
    moveSelection,
    endSelection,
  };
}
