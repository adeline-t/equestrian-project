import PropTypes from 'prop-types';
import { Icons } from '../../../lib/icons';
import { useAppMode } from '../../../context/AppMode';

/**
 * MobileActionBar - Barre d'actions fixe en bas (mobile uniquement)
 */
export default function MobileActionBar({ onCreateEvent, onCreateBlockedTime, onShowScheduled }) {
  const { mode } = useAppMode();

  return (
    <div className="mobile-action-bar">
      {/* Actions admin */}
      {mode === 'admin' && (
        <>
          <button
            className="mobile-action-bar__button"
            onClick={onShowScheduled}
            aria-label="Événements en attente"
          >
            <Icons.Calendar />
            <span className="mobile-action-bar__label">Actions en attente</span>
          </button>

          <button
            className="mobile-action-bar__button mobile-action-bar__button--danger"
            onClick={onCreateBlockedTime}
            aria-label="Bloquer un créneau"
          >
            <Icons.Blocked />
            <span className="mobile-action-bar__label">Bloquer un creneau</span>
          </button>
        </>
      )}

      {/* Bouton principal - toujours visible */}
      <button
        className="mobile-action-bar__button mobile-action-bar__button--primary"
        onClick={onCreateEvent}
        aria-label="Nouvel événement"
      >
        <Icons.Add />
      </button>
    </div>
  );
}

MobileActionBar.propTypes = {
  onCreateEvent: PropTypes.func.isRequired,
  onCreateBlockedTime: PropTypes.func.isRequired,
  onShowScheduled: PropTypes.func.isRequired,
};
