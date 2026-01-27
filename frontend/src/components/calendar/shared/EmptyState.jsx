import PropTypes from 'prop-types';
import { Icons } from '../../../lib/icons';

/**
 * EmptyState - État vide pour le calendrier
 */
export default function EmptyState({ message = 'Aucun événement', variant = 'default' }) {
  return (
    <div className={`calendar-empty-state calendar-empty-state--${variant}`}>
      <Icons.Calendar className="calendar-empty-state__icon" />
      <p className="calendar-empty-state__message">{message}</p>
    </div>
  );
}

EmptyState.propTypes = {
  message: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'mobile']),
};
