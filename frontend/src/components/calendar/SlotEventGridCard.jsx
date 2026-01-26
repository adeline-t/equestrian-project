import PropTypes from 'prop-types';
import { isBlockedEvent } from '../../lib/domain';
import '../../styles/features/calendar/calendar.css';
import SlotContent from './SlotContent';

/* ------------------------------
   EventCard Component
--------------------------------*/
function SlotEventGridCard({ slot, onClick }) {
  if (!slot) {
    console.debug('[EventCard] slot is null or undefined');
    return null;
  }

  const handleClick = () => {
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
