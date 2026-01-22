import React from 'react';

import {
  formatDuration,
  calculateDurationMinutes,
} from '../../../../lib/helpers/formatters/index.js';

import { Icons } from '../../../../lib/icons.jsx';
import { INSTRUCTORS } from '../../../../lib/domain';

import '../../../../styles/features/events.css';

// Convert domain map → array for UI
const instructorOptions = Object.entries(INSTRUCTORS).map(([id, label]) => ({
  id: Number(id),
  label,
}));

function BlockedTimeForm({ formData, handleChange, setFormData }) {
  return (
    <form onSubmit={(e) => e.preventDefault()} className="blocked-time-form">
      {/* GENERAL INFORMATION */}
      <div className="form-section mb-20">
        <h3 className="mb-15">Informations générales</h3>

        <div className="form-group mb-15">
          <label htmlFor="name">Nom</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-input"
            placeholder="Un nom sera généré automatiquement si laissé vide"
          />
        </div>

        <div className="form-group mb-15">
          <label>
            Instructeur <span className="required">*</span>
          </label>
          <div className="segmented-control">
            {instructorOptions.map((inst) => (
              <button
                key={inst.id}
                type="button"
                className={`segment-btn ${formData.instructor_id === inst.id ? 'active' : ''}`}
                onClick={() => setFormData((prev) => ({ ...prev, instructor_id: inst.id }))}
              >
                {inst.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* DATE SECTION */}
      <div className="form-section mb-20">
        <h3 className="mb-15">Date et horaires</h3>

        <div className="form-group mb-15">
          <label htmlFor="slot_date">
            Date <span className="required">*</span>
          </label>
          <input
            type="date"
            id="slot_date"
            name="slot_date"
            value={formData.slot_date}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group mb-15">
          <label>Format</label>
          <div className="segmented-control">
            <button
              type="button"
              className={`segment-btn ${formData.is_all_day ? 'active' : ''}`}
              onClick={() => setFormData((prev) => ({ ...prev, is_all_day: true }))}
            >
              <Icons.Calendar className="segment-icon" />
              Journée entière
            </button>

            <button
              type="button"
              className={`segment-btn ${!formData.is_all_day ? 'active' : ''}`}
              onClick={() => setFormData((prev) => ({ ...prev, is_all_day: false }))}
            >
              <Icons.Clock className="segment-icon" />
              Horaires
            </button>
          </div>
        </div>

        {!formData.is_all_day && (
          <>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="start_time">Heure début</label>
                <input
                  type="time"
                  id="start_time"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleChange}
                  className="form-input"
                  step="900"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="end_time">Heure fin</label>
                <input
                  type="time"
                  id="end_time"
                  name="end_time"
                  value={formData.end_time}
                  onChange={handleChange}
                  className="form-input"
                  step="900"
                  required
                />
              </div>
            </div>

            <div className="blocked-time-duration-display">
              <Icons.Clock />
              Durée:{' '}
              {formatDuration(calculateDurationMinutes(formData.start_time, formData.end_time))}
            </div>
          </>
        )}
      </div>
    </form>
  );
}

export default BlockedTimeForm;
