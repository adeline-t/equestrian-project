import React from 'react';
import { Icons } from '../../../lib/icons';
import { LESSON_TYPES } from '../../../lib/domains/lessons/types';
import { formatDuration } from '../../../lib/helpers/shared/formatters/duration.js';

/**
 * Lesson Form Component for SingleLessonModal
 */
const LessonForm = ({ formData, handleFormChange, handleTypeChange }) => {
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      {/* Name */}
      <div className="form-group" style={{ marginBottom: '15px' }}>
        <label style={{ fontSize: '14px', marginBottom: '5px', display: 'block' }}>
          <Icons.Edit style={{ marginRight: '4px', fontSize: '12px' }} />
          Nom du cours
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleFormChange}
          className="form-input"
          placeholder="Généré automatiquement si vide"
          style={{ fontSize: '14px' }}
        />
        <small className="text-muted">
          Si vide, le nom sera généré automatiquement à partir du type de cours
        </small>
      </div>

      {/* Type & Date */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '15px',
          marginBottom: '15px',
        }}
      >
        <div className="form-group" style={{ margin: 0 }}>
          <label style={{ fontSize: '14px', marginBottom: '5px', display: 'block' }}>
            <Icons.List style={{ marginRight: '4px', fontSize: '12px' }} />
            Type *
          </label>
          <select
            name="lesson_type"
            value={formData.lesson_type}
            onChange={handleTypeChange}
            className="form-select"
            required
            style={{ fontSize: '14px' }}
          >
            {Object.values(LESSON_TYPES).map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <label style={{ fontSize: '14px', marginBottom: '5px', display: 'block' }}>
            <Icons.Calendar style={{ marginRight: '4px', fontSize: '12px' }} />
            Date *
          </label>
          <input
            type="date"
            name="lesson_date"
            value={formData.lesson_date}
            onChange={handleFormChange}
            className="form-input"
            required
            style={{ fontSize: '14px' }}
          />
        </div>
      </div>

      {/* Time */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '15px',
          marginBottom: '15px',
        }}
      >
        <div className="form-group" style={{ margin: 0 }}>
          <label style={{ fontSize: '14px', marginBottom: '5px', display: 'block' }}>
            <Icons.Clock style={{ marginRight: '4px', fontSize: '12px' }} />
            Début *
          </label>
          <input
            type="time"
            name="start_time"
            value={formData.start_time}
            onChange={handleFormChange}
            className="form-input"
            required
            style={{ fontSize: '14px' }}
          />
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <label style={{ fontSize: '14px', marginBottom: '5px', display: 'block' }}>
            <Icons.Clock style={{ marginRight: '4px', fontSize: '12px' }} />
            Fin *
          </label>
          <input
            type="time"
            name="end_time"
            value={formData.end_time}
            onChange={handleFormChange}
            className="form-input"
            required
            style={{ fontSize: '14px' }}
          />
        </div>
      </div>

      {/* Duration Display */}
      <div className="form-group" style={{ marginBottom: '15px' }}>
        <div
          style={{
            background: '#f8f9fa',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '13px',
            color: '#6c757d',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Icons.Clock style={{ fontSize: '14px' }} />
          Durée: {formatDuration(formData.start_time, formData.end_time)}
        </div>
      </div>

      {/* Max Participants */}
      {formData.lesson_type !== 'blocked' && (
        <div className="form-group" style={{ marginBottom: '15px' }}>
          <label style={{ fontSize: '14px', marginBottom: '5px', display: 'block' }}>
            <Icons.Users style={{ marginRight: '4px', fontSize: '12px' }} />
            Nombre maximum de participants
          </label>
          <input
            type="number"
            name="max_participants"
            value={formData.max_participants}
            onChange={handleFormChange}
            className="form-input"
            min="1"
            max="50"
            style={{ fontSize: '14px' }}
          />
        </div>
      )}

      {/* Description */}
      <div className="form-group" style={{ marginBottom: '15px' }}>
        <label style={{ fontSize: '14px', marginBottom: '5px', display: 'block' }}>
          <Icons.Info style={{ marginRight: '4px', fontSize: '12px' }} />
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleFormChange}
          className="form-textarea"
          rows="3"
          placeholder="Optionnel..."
          style={{ fontSize: '14px' }}
        />
      </div>
    </form>
  );
};

export default LessonForm;
