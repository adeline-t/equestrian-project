import PropTypes from 'prop-types';
import SlotContent from './SlotContent';
import '../../styles/features/calendar.css';
import { isBlockedEvent } from '../../lib/domain';

/* ------------------------------
   EventCard Component
--------------------------------*/
function SlotEventGridCard({ slot, onClick }) {
  if (!slot) {
    console.debug('[EventCard] slot is null or undefined');
    return null;
  }

  const handleClick = () => {
    console.debug('[EventCard] click', {
      slotId: slot.id,
      eventType: slot.events?.event_type,
    });

    onClick?.(slot, isBlockedEvent(slot.events));
  };

  return (
    <div className="event-card" role="button" tabIndex={0} onClick={handleClick}>
      <SlotContent slot={slot} />
    </div>
  );
}

SlotEventGridCard.propTypes = {
  slot: PropTypes.object.isRequired,
  onClick: PropTypes.func,
};

export default SlotEventGridCard;
