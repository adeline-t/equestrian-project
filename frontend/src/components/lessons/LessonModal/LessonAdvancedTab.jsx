import React from 'react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Icons } from '../../../lib/libraries/icons.jsx';

/**
 * Lesson Advanced Tab Component
 */
const LessonAdvancedTab = ({ lessonData }) => {
  return (
    <div className="advanced-tab">
      <div className="advanced-section">
        <h3 className="section-title">
          <Icons.Info style={{ marginRight: '8px' }} />
          Informations Détaillées
        </h3>

        {/* Min Participants - Only show if set */}
        {lessonData.min_participants && (
          <div className="detail-row">
            <label>
              <Icons.Users style={{ marginRight: '4px' }} />
              Participants minimum :
            </label>
            <span>{lessonData.min_participants}</span>
          </div>
        )}

        {/* Cancellation Reason - Only show if cancelled */}
        {lessonData.status === 'cancelled' && lessonData.cancellation_reason && (
          <div className="alert alert-error">
            <Icons.Close style={{ marginRight: '8px' }} />
            <div>
              <strong>Raison de l'annulation :</strong>
              <p style={{ marginTop: '8px' }}>{lessonData.cancellation_reason}</p>
            </div>
          </div>
        )}

        {/* Not Given Info - Only show if marked */}
        {lessonData.not_given_by_laury && (
          <div className="alert alert-warning">
            <Icons.Warning style={{ marginRight: '8px' }} />
            <div>
              <strong>Cours non donné par Laury</strong>
              {lessonData.not_given_reason && (
                <p style={{ marginTop: '8px' }}>
                  <strong>Raison :</strong> {lessonData.not_given_reason}
                </p>
              )}
              {lessonData.not_given_at && (
                <small style={{ display: 'block', marginTop: '8px', opacity: 0.8 }}>
                  Marqué le :{' '}
                  {format(parseISO(lessonData.not_given_at), 'dd/MM/yyyy à HH:mm', {
                    locale: fr,
                  })}
                </small>
              )}
            </div>
          </div>
        )}

        {/* Modification Info - Only show if modified */}
        {lessonData.is_modified && (
          <div className="alert alert-info">
            <Icons.Edit style={{ marginRight: '8px' }} />
            <div>
              <strong>Cours modifié</strong>
              <p style={{ marginTop: '8px' }}>
                Ce cours a été modifié par rapport au template original.
              </p>
              {lessonData.modified_fields && Object.keys(lessonData.modified_fields).length > 0 && (
                <div style={{ marginTop: '12px' }}>
                  <strong>Champs modifiés :</strong>
                  <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                    {Object.entries(lessonData.modified_fields).map(([field, value]) => (
                      <li key={field} style={{ marginBottom: '4px' }}>
                        <strong>{field}:</strong> {JSON.stringify(value)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="advanced-section">
        <h3 className="section-title">
          <Icons.Clock style={{ marginRight: '8px' }} />
          Métadonnées
        </h3>

        {lessonData.created_at && (
          <div className="detail-row">
            <label>
              <Icons.Calendar style={{ marginRight: '4px' }} />
              Créé le :
            </label>
            <span>
              {format(parseISO(lessonData.created_at), 'dd/MM/yyyy à HH:mm', { locale: fr })}
            </span>
          </div>
        )}

        {lessonData.updated_at && (
          <div className="detail-row">
            <label>
              <Icons.Clock style={{ marginRight: '4px' }} />
              Dernière modification :
            </label>
            <span>
              {format(parseISO(lessonData.updated_at), 'dd/MM/yyyy à HH:mm', { locale: fr })}
            </span>
          </div>
        )}

        {lessonData.instructor_id && (
          <div className="detail-row">
            <label>
              <Icons.User style={{ marginRight: '4px' }} />
              ID Instructeur :
            </label>
            <span>#{lessonData.instructor_id}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonAdvancedTab;
