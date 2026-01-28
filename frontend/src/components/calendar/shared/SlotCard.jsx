import PropTypes from 'prop-types';
import { getEventTypeConfig, getStatusConfig } from '../../../lib/domain/events';
import { Icons } from '../../../lib/icons';

/**
 * SlotCard - Composant unifié pour afficher un slot d'événement
 * Supporte 4 variantes : desktop-grid, desktop-allday, mobile-timed, mobile-allday
 */
export default function SlotCard({ slot, variant = 'desktop-grid', onClick, isNarrow = false }) {
  if (!slot) return null;

  const eventType = slot.events?.event_type || 'blocked';
  const eventConfig = getEventTypeConfig(eventType);
  const statusConfig = getStatusConfig(slot.slot_status);
  const StatusIcon = statusConfig?.icon || Icons.Info;
  const EventIcon = eventConfig?.icon || Icons.Calendar;

  const participants = slot.event_participants || [];
  const maxParticipants = slot.events?.max_participants || 0;

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    return timeStr.substring(0, 5); // "HH:mm"
  };

  const handleClick = () => {
    onClick?.(slot);
  };

  // ============================================
  // VARIANT: Desktop Grid (vue semaine)
  // ============================================
  if (variant === 'desktop-grid') {
    return (
      <div
        className="slot-card slot-card--desktop-grid"
        data-type={eventType}
        data-narrow={isNarrow}
        onClick={handleClick}
        role="button"
        tabIndex={0}
      >
        <div className="slot-card__header">
          <StatusIcon className="slot-card__status-icon" />
          <span className="slot-card__title" title={slot.events?.name || eventConfig.label}>
            {slot.events?.name || eventConfig.label}
          </span>
          {maxParticipants > 0 && (
            <span className="slot-card__count-badge">
              {participants.length}/{maxParticipants}
            </span>
          )}
        </div>

        <div className="slot-card__participants">
          {participants.length > 0 ? (
            participants.slice(0, 4).map((p, idx) => (
              <div
                key={idx}
                className="slot-card__participant-badge"
                title={`${p.riders?.name || 'Cavalier à définir'} / ${
                  p.horses?.name || 'Cheval à définir'
                }`}
              >
                <span className="badge-rider">{getInitials(p.riders?.name)}</span>
                <span className="badge-separator">•</span>
                <span className="badge-horse">{getInitials(p.horses?.name)}</span>
              </div>
            ))
          ) : (
            <span className="slot-card__empty-text">Aucun participant</span>
          )}
          {participants.length > 4 && (
            <div className="slot-card__participant-badge slot-card__participant-badge--more">
              +{participants.length - 4}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ============================================
  // VARIANT: Desktop All-Day
  // ============================================
  if (variant === 'desktop-allday') {
    return (
      <div
        className="slot-card slot-card--desktop-allday"
        data-type={eventType}
        onClick={(e) => {
          handleClick(e);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
        tabIndex={0}
        role="button"
        aria-label={`Créneau journée entière: ${
          slot.events?.name || eventConfig?.label || 'Sans titre'
        }`}
      >
        <div className="slot-card__content">
          {StatusIcon && <StatusIcon className="slot-card__icon" />}
          <span className="slot-card__name">
            {slot.events?.name || eventConfig?.label || 'Journée entière'}
          </span>
        </div>
      </div>
    );
  }

  // ============================================
  // VARIANT: Mobile Timed (liste avec horaire)
  // ============================================
  if (variant === 'mobile-timed') {
    const ridersNames = participants
      .map((p) => p.riders?.name)
      .filter(Boolean)
      .join(', ');
    const horsesNames = participants
      .map((p) => p.horses?.name)
      .filter(Boolean)
      .join(', ');

    return (
      <div
        className="slot-card slot-card--mobile-timed"
        data-type={eventType}
        data-status={slot.slot_status}
        onClick={handleClick}
      >
        <div className="slot-card__time">
          <span className="slot-card__time-value">{formatTime(slot.start_time)}</span>
        </div>

        <div className="slot-card__divider"></div>

        <div className="slot-card__content">
          <div className="slot-card__header">
            <EventIcon className="slot-card__icon" />
            <span className="slot-card__title">{slot.events?.name || eventConfig?.label}</span>
          </div>

          <div className="slot-card__details">
            {ridersNames && <div className="slot-card__detail-line">{ridersNames}</div>}
            {horsesNames && <div className="slot-card__detail-line">{horsesNames}</div>}
            {slot.events?.location && (
              <div className="slot-card__detail-line">{slot.events.location}</div>
            )}
            {slot.events?.instructor && (
              <div className="slot-card__detail-line">{slot.events.instructor.name}</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // VARIANT: Mobile All-Day (carte compacte)
  // ============================================
  if (variant === 'mobile-allday') {
    return (
      <div
        className="slot-card slot-card--mobile-allday"
        data-type={eventType}
        data-status={slot.slot_status}
        onClick={handleClick}
      >
        <div className="slot-card__content">
          <EventIcon className="slot-card__icon" />
          <div className="slot-card__info">
            <div className="slot-card__title">{slot.events?.name || eventConfig?.label}</div>
            <div className="slot-card__subtitle">Journée entière</div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

SlotCard.propTypes = {
  slot: PropTypes.object.isRequired,
  variant: PropTypes.oneOf(['desktop-grid', 'desktop-allday', 'mobile-timed', 'mobile-allday']),
  onClick: PropTypes.func,
  isNarrow: PropTypes.bool,
};
