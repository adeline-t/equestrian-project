import React from 'react';
import { Icons } from '../../../../lib/libraries/icons.jsx';
import { LESSON_TYPES } from '../../../../constants/index.js';

const BasicInfoFields = ({ editFormData, lessonData, handleEditChange, handleTypeChange }) => {
  return (
    <>
      {/* Name */}
      <div className="form-group" style={{ marginBottom: '15px' }}>
        <label style={{ fontSize: '14px', marginBottom: '5px', display: 'block' }}>
          <Icons.Edit style={{ marginRight: '4px', fontSize: '12px' }} />
          Nom du cours *
        </label>
        <input
          type="text"
          name="name"
          value={editFormData.name}
          onChange={handleEditChange}
          className="form-input"
          style={{ fontSize: '14px' }}
          placeholder="Entrez un nom pour ce cours"
        />
      </div>

      {/* Type */}
      <div className="form-group" style={{ marginBottom: '15px' }}>
        <label style={{ fontSize: '14px', marginBottom: '5px', display: 'block' }}>
          <Icons.Tag style={{ marginRight: '4px', fontSize: '12px' }} />
          Type de cours *
        </label>
        <select
          name="lesson_type"
          value={editFormData.lesson_type || lessonData.lesson_type}
          onChange={handleTypeChange}
          className="form-select"
          style={{ fontSize: '14px' }}
        >
          {LESSON_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Date */}
      <div className="form-group" style={{ marginBottom: '15px' }}>
        <label style={{ fontSize: '14px', marginBottom: '5px', display: 'block' }}>
          <Icons.Calendar style={{ marginRight: '4px', fontSize: '12px' }} />
          Date *
        </label>
        <input
          type="date"
          name="date"
          value={editFormData.date || lessonData.date}
          onChange={handleEditChange}
          className="form-input"
          style={{ fontSize: '14px' }}
        />
      </div>

      {/* Time */}
      <div className="form-row" style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label style={{ fontSize: '14px', marginBottom: '5px', display: 'block' }}>
            <Icons.Clock style={{ marginRight: '4px', fontSize: '12px' }} />
            Heure de début *
          </label>
          <input
            type="time"
            name="start_time"
            value={editFormData.start_time || lessonData.start_time}
            onChange={handleEditChange}
            className="form-input"
            style={{ fontSize: '14px' }}
          />
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label style={{ fontSize: '14px', marginBottom: '5px', display: 'block' }}>
            <Icons.Clock style={{ marginRight: '4px', fontSize: '12px' }} />
            Heure de fin *
          </label>
          <input
            type="time"
            name="end_time"
            value={editFormData.end_time || lessonData.end_time}
            onChange={handleEditChange}
            className="form-input"
            style={{ fontSize: '14px' }}
          />
        </div>
      </div>
    </>
  );
};

export default BasicInfoFields;
