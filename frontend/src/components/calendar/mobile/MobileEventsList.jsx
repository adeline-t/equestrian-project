import PropTypes from 'prop-types';
import { format, isToday } from 'date-fns';
import { fr } from 'date-fns/locale';
import SlotCard from '../shared/SlotCard';
import EmptyState from '../shared/EmptyState';
import { isBlockedEvent } from '../../../lib/domain';

/**
 * MobileEventsList - Liste des événements du jour sélectionné
 */
export default function MobileEventsList({ selectedDate, allDaySlots, timedSlots, onSlotClick }) {
  const hasNoEvents = allDaySlots.length === 0 && timedSlots.length === 0;

  const handleSlotClick = (slot) => {
    onSlotClick?.(slot, isBlockedEvent(slot.events));
  };

  return (
    <div className="mobile-events-list">
      {/* Date sélectionnée */}
      <div className="mobile-events-list__header">
        <h2 className="mobile-events-list__title">
          {isToday(selectedDate) ? "Aujourd'hui" : format(selectedDate, 'EEEE', { locale: fr })}{' '}
          <span className="mobile-events-list__date-number">{format(selectedDate, 'd')}</span>
        </h2>
      </div>

      {/* Événements journée entière */}
      {allDaySlots.length > 0 && (
        <div className="mobile-events-list__allday-section">
          {allDaySlots.map((slot) => (
            <SlotCard
              key={slot.id}
              slot={slot}
              variant="mobile-allday"
              onClick={() => {
                handleSlotClick(slot);
              }}
            />
          ))}
        </div>
      )}

      {/* Événements horaires */}
      {timedSlots.length > 0 ? (
        <div className="mobile-events-list__timed-section">
          {timedSlots.map((slot) => (
            <SlotCard
              key={slot.id}
              slot={slot}
              variant="mobile-timed"
              onClick={() => {
                handleSlotClick(slot);
              }}
            />
          ))}
        </div>
      ) : hasNoEvents ? (
        <EmptyState message="Aucun événement ce jour" variant="mobile" />
      ) : null}
    </div>
  );
}

MobileEventsList.propTypes = {
  selectedDate: PropTypes.instanceOf(Date).isRequired,
  allDaySlots: PropTypes.array.isRequired,
  timedSlots: PropTypes.array.isRequired,
  onSlotClick: PropTypes.func.isRequired,
};
