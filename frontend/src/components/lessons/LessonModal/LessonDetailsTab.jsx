import React from 'react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Icons } from '../../../lib/icons';
import { getLessonTypeLabel, isBlockedLesson } from '../../../lib/domains/events/types';
import { getStatusBadge } from '../../../lib/domains/events/statuses';

/**
 * Lesson Details Tab - View Mode
 */
const LessonDetailsTab = ({ eventData, LessonIcon }) => {
  const isBlocked = isBlockedLesson(eventData.event_type);
  const statusBadge = getStatusBadge(eventData.status);

  return (
    <div className="details-tab">
      <div className="detail-row">
        <label>
          <Icons.List style={{ marginRight: '4px' }} />
          Type :
        </label>
        <span className={`event-type-badge ${eventData.event_type}`}>
          <LessonIcon style={{ marginRight: '4px', fontSize: '12px' }} />
          {getLessonTypeLabel(eventData.event_type)}
        </span>
      </div>

      <div className="detail-row">
        <label>
          <Icons.Calendar style={{ marginRight: '4px' }} />
          Date :
        </label>
        <span>
          {format(parseISO(eventData.event_date), 'EEEE dd MMMM yyyy', {
            locale: fr,
          })}
        </span>
      </div>

      <div className="detail-row">
        <label>
          <Icons.Clock style={{ marginRight: '4px' }} />
          Horaire :
        </label>
        <span>
          {eventData.start_time} - {eventData.end_time}
        </span>
      </div>

      <div className="detail-row">
        <label>
          <Icons.Info style={{ marginRight: '4px' }} />
          Statut :
        </label>
        <span
          className="status-badge"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            color: statusBadge.color,
            backgroundColor: statusBadge.bgColor,
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '12px',
          }}
        >
          {statusBadge.icon && <statusBadge.icon style={{ fontSize: '10px' }} />}
          {statusBadge.label}
        </span>
      </div>

      {!isBlocked && eventData.max_participants && (
        <div className="detail-row">
          <label>
            <Icons.Users style={{ marginRight: '4px' }} />
            Capacité :
          </label>
          <span>
            {eventData.participants?.length || 0} / {eventData.max_participants}
          </span>
        </div>
      )}

      {eventData.location && (
        <div className="detail-row">
          <label>
            <Icons.Location style={{ marginRight: '4px' }} />
            Lieu :
          </label>
          <span>{eventData.location}</span>
        </div>
      )}

      {eventData.description && (
        <div className="detail-row">
          <label>
            <Icons.Info style={{ marginRight: '4px' }} />
            Description :
          </label>
          <p>{eventData.description}</p>
        </div>
      )}

      {eventData.template_id && (
        <div className="alert alert-info">
          <Icons.Info style={{ marginRight: '8px' }} />
          Ce cours a été créé à partir d'un template récurrent
        </div>
      )}

      {eventData.not_given_by_laury && (
        <div className="alert alert-warning">
          <Icons.Warning style={{ marginRight: '8px' }} />
          Ce cours n'a pas été donné par Laury
        </div>
      )}
    </div>
  );
};

export default LessonDetailsTab;
