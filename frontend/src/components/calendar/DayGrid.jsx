import SlotEventGridCard from './SlotEventGridCard';

export default function DayGrid({
  slots,
  onSlotClick,
  isSelecting,
  selectionStyle,
  calculateSlotPositionMemo,
}) {
  const HOUR_HEIGHT = 60;
  const START_HOUR = 8;
  const END_HOUR = 22;
  const hours = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i);

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
            />
          );
        })}
      </div>

      {isSelecting && selectionStyle && (
        <div className="selection-overlay" style={selectionStyle} />
      )}

      {slots && slots.length > 0 && (
        <div className="events-container">
          {slots.map((slot) => {
            const style = calculateSlotPositionMemo(slot);
            if (!style) return null;

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
