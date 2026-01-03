import React from 'react';
import { Icons } from '../../../utils/icons';
import { LESSON_TYPES } from '../../../constants/index.js';
import { calculateDuration } from '../../../utils/formatters/index.js';

/**
 * Lesson Edit Form Component
 */
const LessonEditForm = ({
  editFormData,
  editError,
  lessonData,
  handleEditChange,
  handleTypeChange,
}) => {
  return (
    <div className="edit-form">
      {editError && (
        <div className="alert alert-error" style={{ marginBottom: '15px' }}>
          <Icons.Warning style={{ marginRight: '8px' }} />
          {editError}
        </div>
      )}

      {/* Template warning for template-derived lessons */}
      {lessonData.template_id && (
        <div className="alert alert-warning" style={{ marginBottom: '15px' }}>
          <Icons.Warning style={{ marginRight: '8px' }} />
          Ce cours provient d'un template. Les modifications ne s'appliqueront qu'à cette
          instance spécifique et n'affecteront pas le template ni les autres cours.
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
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
            required
            style={{ fontSize: '14px' }}
          />
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
              value={editFormData.lesson_type}
              onChange={handleTypeChange}
              className="form-select"
              required
              style={{ fontSize: '14px' }}
            >
              {LESSON_TYPES.map((type) => (
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
              value={editFormData.lesson_date}
              onChange={handleEditChange}
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
              value={editFormData.start_time}
              onChange={handleEditChange}
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
              value={editFormData.end_time}
              onChange={handleEditChange}
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
            Durée: {calculateDuration(editFormData.start_time, editFormData.end_time)}
          </div>
        </div>

        {/* Participants - Min and Max */}
        {editFormData.lesson_type !== 'blocked' && (
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
                <Icons.Users style={{ marginRight: '4px', fontSize: '12px' }} />
                Min participants
              </label>
              <input
                type="number"
                name="min_participants"
                value={editFormData.min_participants}
                onChange={handleEditChange}
                className="form-input"
                min="1"
                max="50"
                placeholder="Optionnel"
                style={{ fontSize: '14px' }}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ fontSize: '14px', marginBottom: '5px', display: 'block' }}>
                <Icons.Users style={{ marginRight: '4px', fontSize: '12px' }} />
                Max participants
              </label>
              <input
                type="number"
                name="max_participants"
                value={editFormData.max_participants}
                onChange={handleEditChange}
                className="form-input"
                min="1"
                max="50"
                style={{ fontSize: '14px' }}
              />
            </div>
          </div>
        )}

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
      </form>
    </div>
  );
};

export default LessonEditForm;