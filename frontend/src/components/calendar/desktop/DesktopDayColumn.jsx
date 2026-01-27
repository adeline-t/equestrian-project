import PropTypes from 'prop-types';
import { endOfDay, isPast, isToday, parseISO } from 'date-fns';
import { useMemo, useRef } from 'react';
import { useCalendarSelection } from '../../../hooks/useCalendarSelection';
import { getValidSlots } from '../../../lib/domain/calendar';
import { EVENT_TYPES, CALENDAR_CONFIG } from '../../../lib/domain';
import DesktopDayHeader from './DesktopDayHeader';
import DesktopDayGrid from './DesktopDayGrid';
import AllDaySlot from '../shared/AllDaySlot';

/**
 * DesktopDayColumn - Une colonne jour complète (header + all-day + grid)
 */
export default function DesktopDayColumn({ date, dayName, slots, onSlotClick, onQuickCreate }) {
  const dayGridRef = useRef(null);
  const { HOUR_HEIGHT, START_HOUR, END_HOUR, MIN_SELECTION_DURATION } = CALENDAR_CONFIG;

  if (!date) {
    return (
      <div className="desktop-day-column desktop-day-column--invalid">
        <DesktopDayHeader date={date} dayName={dayName} />
      </div>
    );
  }

  const dateObj = parseISO(date);
  const isCurrentDay = isToday(dateObj);
  const isPastDay = isPast(endOfDay(dateObj)) && !isCurrentDay;

  // Séparer les slots
  const { allDaySlots, timedSlots, normalAllDaySlots, fullHeightSlots } = useMemo(() => {
    const allSlots = slots || [];
    const allDay = allSlots.filter((s) => s.is_all_day);
    const timed = allSlots.filter((s) => !s.is_all_day);

    const fullHeight = allDay.filter(
      (slot) =>
        slot.events?.event_type === EVENT_TYPES.COMPETITION ||
        slot.events?.event_type === EVENT_TYPES.BLOCKED
    );
    const normalAllDay = allDay.filter(
      (slot) =>
        slot.events?.event_type !== EVENT_TYPES.COMPETITION &&
        slot.events?.event_type !== EVENT_TYPES.BLOCKED
    );

    return {
      allDaySlots: allDay,
      timedSlots: timed,
      normalAllDaySlots: normalAllDay,
      fullHeightSlots: fullHeight,
    };
  }, [slots]);

  const hasFullHeightEvent = fullHeightSlots.length > 0;

  const validTimedSlots = useMemo(
    () => getValidSlots(timedSlots, START_HOUR, END_HOUR),
    [timedSlots, START_HOUR, END_HOUR]
  );

  // Hook de sélection
  const { isSelecting, selectionStyle, startSelection, moveSelection, endSelection } =
    useCalendarSelection({
      HOUR_HEIGHT,
      START_HOUR,
      END_HOUR,
      MIN_SELECTION_DURATION,
      onQuickCreate,
      date,
    });

  // Handlers de souris
  const handleMouseDown = (e) => {
    if (e.target.closest('.desktop-day-grid__event-wrapper')) return;
    if (e.target.closest('.full-height-slots')) return;
    if (hasFullHeightEvent) return;

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
    if (!isSelecting || !dayGridRef.current) return;

    const rect = dayGridRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const totalMinutes = (y / HOUR_HEIGHT) * 60;
    const hour = Math.floor(totalMinutes / 60) + START_HOUR;
    const minute = Math.floor(totalMinutes % 60);

    moveSelection(hour, minute);
  };

  return (
    <div
      className={`desktop-day-column
        ${isCurrentDay ? 'desktop-day-column--today' : ''}
        ${isPastDay ? 'desktop-day-column--past' : ''}
        ${hasFullHeightEvent ? 'desktop-day-column--has-full-height' : ''}
      `}
    >
      {/* Header */}
      <DesktopDayHeader date={date} dayName={dayName} />

      {/* Section all-day (slots normaux) */}
      <div className="desktop-day-column__allday-section">
        <AllDaySlot slots={normalAllDaySlots} variant="normal" onSlotClick={onSlotClick} />
      </div>

      {/* Slots pleine hauteur (en dehors de all-day-section) */}
      {fullHeightSlots.length > 0 && (
        <div className="desktop-day-column__full-height">
          <AllDaySlot slots={fullHeightSlots} variant="full-height" onSlotClick={onSlotClick} />
        </div>
      )}

      {/* Grille horaire */}
      <div
        ref={dayGridRef}
        className="desktop-day-column__grid-container"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={endSelection}
        onMouseLeave={endSelection}
      >
        <DesktopDayGrid
          slots={validTimedSlots}
          onSlotClick={onSlotClick}
          isSelecting={isSelecting}
          selectionStyle={selectionStyle}
        />
      </div>
    </div>
  );
}

DesktopDayColumn.propTypes = {
  date: PropTypes.string,
  dayName: PropTypes.string,
  slots: PropTypes.array,
  onSlotClick: PropTypes.func,
  onQuickCreate: PropTypes.func,
};
