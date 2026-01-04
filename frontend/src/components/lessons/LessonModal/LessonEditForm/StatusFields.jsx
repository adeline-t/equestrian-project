import React from 'react';
import { Icons } from '../../../../lib/libraries/icons.jsx';

const StatusFields = ({ editFormData, lessonData, handleEditChange }) => {
  return (
    <>
      {/* Status */}
      <div className="form-group" style={{ marginBottom: '15px' }}>
        <label style={{ fontSize: '14px', marginBottom: '5px', display: 'block' }}>
          <Icons.Info style={{ marginRight: '4px', fontSize: '12px' }} />
          Statut
        </label>
        <select
          name="status"
          value={editFormData.status || lessonData.status}
          onChange={handleEditChange}
          className="form-select"
          style={{ fontSize: '14px' }}
        >
          <option value="scheduled">Planifié</option>
          <option value="confirmed">Confirmé</option>
          <option value="completed">Terminé</option>
          <option value="cancelled">Annulé</option>
          <option value="blocked">Bloqué</option>
        </select>
      </div>

      {/* Cancellation Reason - Only show if status is cancelled */}
      {editFormData.status === 'cancelled' && (
        <div className="form-group" style={{ marginBottom: '15px' }}>
          <label style={{ fontSize: '14px', marginBottom: '5px', display: 'block' }}>
            <Icons.Close style={{ marginRight: '4px', fontSize: '12px' }} />
            Raison de l'annulation
          </label>
          <textarea
            name="cancellation_reason"
            value={editFormData.cancellation_reason}
            onChange={handleEditChange}
            className="form-textarea"
            rows="2"
            placeholder="Pourquoi ce cours est-il annulé ?"
            style={{ fontSize: '14px' }}
          />
        </div>
      )}
    </>
  );
};

export default StatusFields;
