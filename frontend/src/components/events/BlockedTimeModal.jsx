import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { eventsApi } from '../../services/calendarApi.js';
import Modal from '../common/Modal.jsx';
import { Icons } from '../../lib/icons.jsx';
import { formatDuration } from '../../lib/helpers/shared/formatters/duration.js';
import { validateLessonTime } from '../../lib/helpers/domains/events/validators';
import '../../styles/components/events.css';

/**
 * Refactored BlockedTimeModal Component
 * Modal for creating blocked time periods
 */
function BlockedTimeModal({
  onClose,
  onSuccess,
  initialDate = null,
  initialStartTime = null,
  initialEndTime = null,
}) {
  const [formData, setFormData] = useState({
    event_date: initialDate || format(new Date(), 'yyyy-MM-dd'),
    start_time: initialStartTime || '09:00',
    end_time: initialEndTime || '10:00',
    event_type: 'blocked',
    name: '',
    description: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Auto-generate name based on date and time if not manually set
    if (name !== 'name' && !formData.name) {
      const autoName = `Bloqué - ${format(parseISO(formData.event_date), 'dd/MM', {
        locale: fr,
      })} ${formData.start_time}`;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        name: autoName,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate time
      const timeValidation = validateLessonTime(formData.start_time, formData.end_time);
      if (!timeValidation.isValid) {
        throw new Error(timeValidation.error);
      }

      // Ensure name is set
      const finalFormData = {
        ...formData,
        name:
          formData.name ||
          `Bloqué - ${format(parseISO(formData.event_date), 'dd/MM', { locale: fr })} ${
            formData.start_time
          }`,
      };

      await eventsApi.create(finalFormData);

      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (err) {
      console.error('Error creating blocked time:', err);
      setError(
        err.response?.data?.error ||
          err.message ||
          'Erreur lors de la création de la période bloquée'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <Icons.Blocked style={{ marginRight: '8px' }} />
          Bloquer une période
        </span>
      }
      size="medium"
      footer={
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', width: '100%' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
            <Icons.Cancel style={{ marginRight: '8px' }} />
            Annuler
          </button>
          <button
            type="submit"
            className="btn btn-danger"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <Icons.Loading className="spin" style={{ marginRight: '8px' }} />
                Création...
              </>
            ) : (
              <>
                <Icons.Blocked style={{ marginRight: '8px' }} />
                Bloquer
              </>
            )}
          </button>
        </div>
      }
    >
      {error && (
        <div className="alert alert-error" style={{ marginBottom: '20px' }}>
          <Icons.Warning style={{ marginRight: '8px' }} />
          {error}
        </div>
      )}

      <div className="alert alert-warning" style={{ marginBottom: '20px' }}>
        <Icons.Info style={{ marginRight: '8px' }} />
        Cette période sera bloquée et aucun cours ne pourra être créé pendant ce créneau.
      </div>

      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="form-group" style={{ marginBottom: '15px' }}>
          <label style={{ fontSize: '14px', marginBottom: '5px', display: 'block' }}>
            <Icons.Edit style={{ marginRight: '4px', fontSize: '12px' }} />
            Nom (optionnel)
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-input"
            placeholder="Généré automatiquement si vide"
            style={{ fontSize: '14px' }}
          />
          <small className="text-muted">
            Si vide, le nom sera généré automatiquement à partir de la date et l'heure
          </small>
        </div>

        {/* Date */}
        <div className="form-group" style={{ marginBottom: '15px' }}>
          <label style={{ fontSize: '14px', marginBottom: '5px', display: 'block' }}>
            <Icons.Calendar style={{ marginRight: '4px', fontSize: '12px' }} />
            Date *
          </label>
          <input
            type="date"
            name="event_date"
            value={formData.event_date}
            onChange={handleChange}
            className="form-input"
            required
            style={{ fontSize: '14px' }}
          />
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
              onChange={handleChange}
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
              onChange={handleChange}
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

        {/* Description */}
        <div className="form-group" style={{ marginBottom: '15px' }}>
          <label style={{ fontSize: '14px', marginBottom: '5px', display: 'block' }}>
            <Icons.Info style={{ marginRight: '4px', fontSize: '12px' }} />
            Raison du blocage
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-textarea"
            rows="3"
            placeholder="Ex: Vacances, maintenance, événement spécial..."
            style={{ fontSize: '14px' }}
          />
        </div>
      </form>
    </Modal>
  );
}

export default BlockedTimeModal;
