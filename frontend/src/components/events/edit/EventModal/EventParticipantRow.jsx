import React from 'react';
import PropTypes from 'prop-types';
import { Icons } from '../../../../lib/icons';
import DomainBadge from '../../../common/DomainBadge';
import {
  getRiderTypeConfig,
  getHorseTypeConfig,
  getHorseAssignmentConfig,
} from '../../../../lib/domain/domain-constants';
import '../../../../styles/features/events.css';

export default function EventParticipantRow({ participant, onEdit, onDelete }) {
  const { rider, horse, horse_assignment_type, is_cancelled } = participant || {};

  const riderTypeConfig = rider ? getRiderTypeConfig(rider.rider_type) : null;
  const horseTypeConfig = horse ? getHorseTypeConfig(horse.kind) : null;
  const horseAssignmentConfig = horse_assignment_type
    ? getHorseAssignmentConfig(horse_assignment_type)
    : null;

  return (
    <div className={`participant-mini-card ${is_cancelled ? 'cancelled' : ''}`}>
      <div className="participant-mini-card-header">
        <div className="participant-mini-card-title">
          {riderTypeConfig ? (
            <DomainBadge config={{ ...riderTypeConfig, label: rider.name }} />
          ) : (
            <>Cavalier à définir</>
          )}
        </div>

        <span className="participant-mini-card-separator">-</span>

        <div className="participant-mini-card-title">
          {horseTypeConfig ? (
            <DomainBadge config={{ ...horseTypeConfig, label: horse.name }} />
          ) : (
            <>Cheval à définir</>
          )}
        </div>

        {horseAssignmentConfig && (
          <div className="participant-mini-card-title">
            <DomainBadge config={horseAssignmentConfig} />
          </div>
        )}
      </div>

      <div className="participant-mini-card-actions">
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
    </div>
  );
}

EventParticipantRow.propTypes = {
  participant: PropTypes.object.isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};
