import React from 'react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Icons } from '../../../lib/icons';
import { getLessonTypeLabel, isBlockedLesson } from '../../../lib/domains/lessons/types';

/**
 * Lesson Details Tab - View Mode
 */
const LessonDetailsTab = ({ lessonData, LessonIcon }) => {
  const isBlocked = isBlockedLesson(lessonData.lesson_type);

  return (
    <div className="details-tab">
      <div className="detail-row">
        <label>
          <Icons.List style={{ marginRight: '4px' }} />
          Type :
        </label>
        <span className={`lesson-type-badge ${lessonData.lesson_type}`}>
          <LessonIcon style={{ marginRight: '4px', fontSize: '12px' }} />
          {getLessonTypeLabel(lessonData.lesson_type)}
        </span>
      </div>

      <div className="detail-row">
        <label>
          <Icons.Calendar style={{ marginRight: '4px' }} />
          Date :
        </label>
        <span>
          {format(parseISO(lessonData.lesson_date), 'EEEE dd MMMM yyyy', {
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
          {lessonData.start_time} - {lessonData.end_time}
        </span>
      </div>

      <div className="detail-row">
        <label>
          <Icons.Info style={{ marginRight: '4px' }} />
          Statut :
        </label>
        <span className={`status-badge status-${lessonData.status}`}>
          {lessonData.status === 'confirmed' && (
            <Icons.Check style={{ marginRight: '4px', fontSize: '10px' }} />
          )}
          {lessonData.status === 'cancelled' && (
            <Icons.Close style={{ marginRight: '4px', fontSize: '10px' }} />
          )}
          {lessonData.status === 'completed' && (
            <Icons.Check style={{ marginRight: '4px', fontSize: '10px' }} />
          )}
          {lessonData.status}
        </span>
      </div>

      {!isBlocked && lessonData.max_participants && (
        <div className="detail-row">
          <label>
            <Icons.Users style={{ marginRight: '4px' }} />
            Capacité :
          </label>
          <span>
            {lessonData.participants?.length || 0} / {lessonData.max_participants}
          </span>
        </div>
      )}

      {lessonData.location && (
        <div className="detail-row">
          <label>
            <Icons.Location style={{ marginRight: '4px' }} />
            Lieu :
          </label>
          <span>{lessonData.location}</span>
        </div>
      )}

      {lessonData.description && (
        <div className="detail-row">
          <label>
            <Icons.Info style={{ marginRight: '4px' }} />
            Description :
          </label>
          <p>{lessonData.description}</p>
        </div>
      )}

      {lessonData.template_id && (
        <div className="alert alert-info">
          <Icons.Info style={{ marginRight: '8px' }} />
          Ce cours a été créé à partir d'un template récurrent
        </div>
      )}

      {lessonData.not_given_by_laury && (
        <div className="alert alert-warning">
          <Icons.Warning style={{ marginRight: '8px' }} />
          Ce cours n'a pas été donné par Laury
        </div>
      )}
    </div>
  );
};

export default LessonDetailsTab;
