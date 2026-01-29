import PropTypes from 'prop-types';
import { EVENT_TYPES } from '../../../lib/domain';
import { isBlockedEvent } from '../../../lib/domain/events';
import SlotCard from './SlotCard';
import '../../../styles/features/calendar/calendar-slots.css';
import { useAppMode } from '../../../context/AppMode';

/**
 * AllDaySlot - Composant pour afficher les slots journée entière
 * Supporte 2 variantes: normal (petit) et full-height (pleine hauteur)
 */
export default function AllDaySlot({ slots, variant = 'normal', onSlotClick }) {
  if (!slots || slots.length === 0) return null;

  const { mode, currentRider } = useAppMode();

  // Filtrer selon la variante
  const filteredSlots =
    variant === 'full-height'
      ? slots.filter(
          (slot) =>
            slot.events?.event_type === EVENT_TYPES.COMPETITION ||
            slot.events?.event_type === EVENT_TYPES.BLOCKED
        )
      : slots.filter(
          (slot) =>
            slot.events?.event_type !== EVENT_TYPES.COMPETITION &&
            slot.events?.event_type !== EVENT_TYPES.BLOCKED
        );

  if (filteredSlots.length === 0) return null;

  const handleSlotClick = (slot) => {
    if (isBlockedEvent(slot.events) && mode !== 'admin') return;
    onSlotClick?.(slot, isBlockedEvent(slot.events));
  };

  // ============================================
  // VARIANT: Normal (petits slots all-day)
  // ============================================
  if (variant === 'normal') {
    return (
      <div className="all-day-slots">
        {filteredSlots.map((slot) => (
          <SlotCard
            key={slot.id}
            slot={slot}
            variant="desktop-allday"
            onClick={() => {
              handleSlotClick(slot);
            }}
          />
        ))}
      </div>
    );
  }

  // ============================================
  // VARIANT: Full-Height (compétitions, bloqués)
  // ============================================
  if (variant === 'full-height') {
    return (
      <div className="full-height-slots">
        {filteredSlots.map((slot) => (
          <SlotCard
            key={slot.id}
            slot={slot}
            variant="desktop-allday"
            onClick={() => {
              handleSlotClick(slot);
            }}
          />
        ))}
      </div>
    );
  }

  return null;
}

AllDaySlot.propTypes = {
  slots: PropTypes.array.isRequired,
  variant: PropTypes.oneOf(['normal', 'full-height']),
  onSlotClick: PropTypes.func,
};
