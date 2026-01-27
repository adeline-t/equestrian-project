import PropTypes from 'prop-types';
import { Icons } from '../../../../lib/icons';
import DomainBadge from '../../../common/DomainBadge';
import {
  getRiderTypeConfig,
  getHorseTypeConfig,
  getHorseAssignmentConfig,
} from '../../../../lib/domain/domain-constants';

export default function EventParticipantRow({ participant, canEdit, onEdit, onDelete }) {
  const { rider, horse, horse_assignment_type, is_cancelled } = participant || {};

  const riderTypeConfig = rider ? getRiderTypeConfig(rider.rider_type) : null;
  const horseTypeConfig = horse ? getHorseTypeConfig(horse.kind) : null;
  const horseAssignmentConfig = horse_assignment_type
    ? getHorseAssignmentConfig(horse_assignment_type)
    : null;

  return (
    <div className={`pairing-row ${is_cancelled ? 'cancelled' : ''}`}>
      <div className="pairing-info">
        <div className="pairing-header">
          {rider ? (
            <span>{rider.name}</span>
          ) : (
            <span className="text-muted">Cavalier à définir</span>
          )}
          <span className="text-muted">-</span>
          {horse ? <span>{horse.name}</span> : <span className="text-muted">Cheval à définir</span>}
        </div>
        <div className="pairing-badges">
          {riderTypeConfig && <DomainBadge config={riderTypeConfig} size="sm" />}
          {horseTypeConfig && <DomainBadge config={horseTypeConfig} size="sm" />}
          {horseAssignmentConfig && <DomainBadge config={horseAssignmentConfig} size="sm" />}
        </div>
      </div>
      {canEdit && (
        <div className="pairing-actions">
          <button
            className="btn-icon-modern"
            onClick={() => onEdit?.(participant)}
            title="Modifier le participant"
          >
            <Icons.Edit />
          </button>
          <button
            className="btn-icon-modern danger"
            onClick={onDelete}
            title="Supprimer le participant"
          >
            <Icons.Delete />
          </button>
        </div>
      )}
    </div>
  );
}

EventParticipantRow.propTypes = {
  participant: PropTypes.object.isRequired,
  canEdit: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};
