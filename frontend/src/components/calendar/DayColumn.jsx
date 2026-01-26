import { endOfDay, isPast, isToday, parseISO } from 'date-fns';
import { useMemo, useRef } from 'react';
import { useCalendarSelection } from '../../hooks/useCalendarSelection';
import { calculateSlotPosition, getValidSlots } from '../../lib/domain/calendar';
import DayGrid from './DayGrid';
import DayHeader from './DayHeader';
import AllDaySlot from './AllDaySlot';

const CALENDAR_CONFIG = {
  HOUR_HEIGHT: 60,
  START_HOUR: 9, // Commence à 9h
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

  // Vérifier si on a des événements pleine hauteur
  const hasFullHeightEvent = allDaySlots.some(
    (slot) => slot.events?.event_type === 'competition' || slot.events?.event_type === 'blocked'
  );

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
    if (e.target.closest('.full-height-slot-card')) return; // Ignore si on clique sur un événement pleine hauteur
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
    <div
      className={`day-column ${isCurrentDay ? 'today' : ''} ${isPastDay ? 'past' : ''} ${
        hasFullHeightEvent ? 'has-full-height-event' : ''
      }`}
    >
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
