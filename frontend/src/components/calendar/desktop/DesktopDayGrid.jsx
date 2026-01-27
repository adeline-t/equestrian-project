import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { CALENDAR_CONFIG } from '../../../lib/domain/calendar';
import { calculateOverlapColumns, calculateSlotPositionWithColumns } from '../../../lib/domain/calendar-overlap';
import SlotCard from '../shared/SlotCard';

/**
 * DesktopDayGrid - Grille horaire avec marqueurs et événements
 */
export default function DesktopDayGrid({ slots, onSlotClick, isSelecting, selectionStyle }) {
  const { HOUR_HEIGHT, START_HOUR, END_HOUR } = CALENDAR_CONFIG;
  const hours = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i);

  // Calculer les colonnes pour gérer les chevauchements
  const slotsWithColumns = useMemo(() => {
    return calculateOverlapColumns(slots || []);
  }, [slots]);

  return (
    <div className="desktop-day-grid">
      {/* Marqueurs horaires */}
      <div className="desktop-day-grid__markers">
        {hours.map((hour) => {
          const top = `${(hour - START_HOUR) * HOUR_HEIGHT}px`;
          return (
            <div
              key={hour}
              className="desktop-day-grid__marker"
              data-hour={`${hour.toString().padStart(2, '0')}:00`}
              style={{ top, height: `${HOUR_HEIGHT}px` }}
            />
          );
        })}
      </div>

      {/* Overlay de sélection */}
      {isSelecting && selectionStyle && (
        <div className="desktop-day-grid__selection" style={selectionStyle} />
      )}

      {/* Événements */}
      {slotsWithColumns && slotsWithColumns.length > 0 && (
        <div className="desktop-day-grid__events">
          {slotsWithColumns.map((slot) => {
            const style = calculateSlotPositionWithColumns(slot, HOUR_HEIGHT, START_HOUR);
            if (!style) return null;

            return (
              <div 
                key={slot.id} 
                className="desktop-day-grid__event-wrapper" 
                style={style}
                data-has-overlap={slot.totalColumns > 1}
                data-column-count={slot.totalColumns}
              >
                <SlotCard 
                  slot={slot} 
                  variant="desktop-grid" 
                  onClick={onSlotClick}
                  isNarrow={slot.totalColumns > 1}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

DesktopDayGrid.propTypes = {
  slots: PropTypes.array,
  onSlotClick: PropTypes.func,
  isSelecting: PropTypes.bool,
  selectionStyle: PropTypes.object,
};
