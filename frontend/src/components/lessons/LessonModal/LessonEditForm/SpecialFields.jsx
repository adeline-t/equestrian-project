import React from 'react';
import { Icons } from '../../../../lib/libraries/icons.jsx';

const SpecialFields = ({ editFormData, handleEditChange }) => {
  return (
    <>
      {/* Not Given by Laury */}
      <div className="form-group" style={{ marginBottom: '15px' }}>
        <label
          style={{
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            gap: '8px',
          }}
        >
          <input
            type="checkbox"
            name="not_given_by_laury"
            checked={editFormData.not_given_by_laury}
            onChange={handleEditChange}
            style={{ cursor: 'pointer', width: '16px', height: '16px', margin: 0 }}
          />
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Icons.Warning style={{ fontSize: '14px' }} />
            Cours non donné par Laury
          </span>
        </label>
      </div>

      {/* Not Given Reason - Only show if checkbox is checked */}
      {editFormData.not_given_by_laury && (
        <div className="form-group" style={{ marginBottom: '15px' }}>
          <label style={{ fontSize: '14px', marginBottom: '5px', display: 'block' }}>
            <Icons.Info style={{ marginRight: '4px', fontSize: '12px' }} />
            Raison
          </label>
          <textarea
            name="not_given_reason"
            value={editFormData.not_given_reason}
            onChange={handleEditChange}
            className="form-textarea"
            rows="2"
            placeholder="Pourquoi ce cours n'a-t-il pas été donné par Laury ?"
            style={{ fontSize: '14px' }}
          />
        </div>
      )}
    </>
  );
};

export default SpecialFields;
