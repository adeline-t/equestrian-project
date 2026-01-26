import { EVENT_TYPES } from '../../lib/domain';
import { getEventTypeConfig, getStatusConfig, isBlockedEvent } from '../../lib/domain/events.js';

export default function AllDaySlot({ slots, onSlotClick }) {
  if (!slots || slots.length === 0) return null;

  // Séparer les slots normaux des slots pleine hauteur
  const fullHeightSlots = slots.filter(
    (slot) => slot.events?.event_type === 'competition' || slot.events?.event_type === 'blocked'
  );
  const normalSlots = slots.filter(
    (slot) => slot.events?.event_type !== 'competition' && slot.events?.event_type !== 'blocked'
  );

  return (
    <>
      {/* Slots normaux dans la section all-day */}
      {normalSlots.length > 0 && (
        <div className="all-day-slots">
          {normalSlots.map((slot) => {
            const eventType = slot.events?.event_type ?? EVENT_TYPES.BLOCKED;
            const slotStatus = slot.slot_status ?? 'SCHEDULED';

            const eventConfig = getEventTypeConfig(eventType);
            const statusConfig = getStatusConfig(slotStatus);

            const StatusIcon = statusConfig?.icon;

            return (
              <div
                key={slot.id}
                className="all-day-slot-card"
                data-type={eventType}
                onClick={(e) => {
                  e.stopPropagation();
                  onSlotClick?.(slot, isBlockedEvent(slot.events));
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSlotClick?.(slot, isBlockedEvent(slot.events));
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`Créneau journée entière: ${
                  slot.events?.name || eventConfig?.label || 'Sans titre'
                }`}
              >
                <div className="all-day-slot-content">
                  {StatusIcon && <StatusIcon className="all-day-slot-status-icon" />}
                  <span className="all-day-slot-name">
                    {slot.events?.name || eventConfig?.label || 'Journée entière'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Slots pleine hauteur (competition & blocked) */}
      {fullHeightSlots.length > 0 && (
        <div className="full-height-slots-container">
          {fullHeightSlots.map((slot) => {
            const eventType = slot.events?.event_type ?? EVENT_TYPES.BLOCKED;
            const slotStatus = slot.slot_status ?? 'SCHEDULED';

            const eventConfig = getEventTypeConfig(eventType);
            const statusConfig = getStatusConfig(slotStatus);

            const StatusIcon = statusConfig?.icon;

            return (
              <div
                key={slot.id}
                className="full-height-slot-card"
                data-type={eventType}
                onClick={(e) => {
                  e.stopPropagation();
                  onSlotClick?.(slot, isBlockedEvent(slot.events));
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSlotClick?.(slot, isBlockedEvent(slot.events));
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`${eventConfig?.label}: ${slot.events?.name || 'Sans titre'}`}
              >
                <div className="full-height-slot-content">
                  {StatusIcon && <StatusIcon className="full-height-slot-icon" />}
                  <div className="full-height-slot-text">
                    <span className="full-height-slot-type">{eventConfig?.label}</span>
                    <span className="full-height-slot-name">
                      {slot.events?.name || 'Journée entière'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
