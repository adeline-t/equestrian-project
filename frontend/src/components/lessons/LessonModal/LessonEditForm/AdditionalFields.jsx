import React from 'react';
import { Icons } from '../../../../lib/libraries/icons';

const AdditionalFields = ({ editFormData, handleEditChange }) => {
  return (
    {/* Description */}
    <div className="form-group" style={{ marginBottom: '15px' }}>
      <label style={{ fontSize: '14px', marginBottom: '5px', display: 'block' }}>
        <Icons.Info style={{ marginRight: '4px', fontSize: '12px' }} />
        Description
      </label>
      <textarea
        name="description"
        value={editFormData.description}
        onChange={handleEditChange}
        className="form-textarea"
        rows="3"
        placeholder="Optionnel..."
        style={{ fontSize: '14px' }}
      />
    </div>
  );
};

export default AdditionalFields;