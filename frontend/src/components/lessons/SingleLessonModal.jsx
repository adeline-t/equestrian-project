import React, { useState } from 'react';
import { lessonsApi } from '../../services/calendarApi';
import { format } from 'date-fns';

function SingleLessonModal({ onClose, onSuccess, initialDate = null }) {
  const [formData, setFormData] = useState({
    lesson_date: initialDate || format(new Date(), 'yyyy-MM-dd'),
    start_time: '09:00',
    end_time: '10:00',
    lesson_type: 'private',
    name: '',
    description: '',
    max_participants: 1,
    status: 'scheduled',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const lessonTypes = [
    { value: 'private', label: '👤 Cours particulier', defaultMax: 1 },
    { value: 'group', label: '👥 Cours collectif', defaultMax: 6 },
    { value: 'training', label: '🎓 Stage', defaultMax: 10 },
    { value: 'competition', label: '🏆 Concours', defaultMax: 20 },
    { value: 'event', label: '🎉 Événement', defaultMax: 50 },
    { value: 'blocked', label: '🚫 Période bloquée', defaultMax: null },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTypeChange = (e) => {
    const type = e.target.value;
    const typeConfig = lessonTypes.find((t) => t.value === type);

    setFormData((prev) => ({
      ...prev,
      lesson_type: type,
      max_participants: typeConfig?.defaultMax || 1,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate times
      if (formData.start_time >= formData.end_time) {
        throw new Error("L'heure de fin doit être après l'heure de début");
      }

      await lessonsApi.create(formData);
      onSuccess();
    } catch (err) {
      console.error('Error creating lesson:', err);
      setError(err.response?.data?.error || err.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  const isBlocked = formData.lesson_type === 'blocked';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content template-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>➕ Créer un cours standalone</h2>
          <button className="btn-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="alert alert-error">❌ {error}</div>}

            <div className="form-section">
              <h3>Informations de base</h3>

              <div className="form-row">
                <div className="form-group">
                  <label>Type de cours *</label>
                  <select
                    name="lesson_type"
                    value={formData.lesson_type}
                    onChange={handleTypeChange}
                    className="form-select"
                    required
                  >
                    {lessonTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Statut</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="scheduled">Planifié</option>
                    <option value="confirmed">Confirmé</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Nom du cours *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  placeholder={isBlocked ? 'Période bloquée' : 'Ex: Cours débutant'}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-textarea"
                  rows="3"
                  placeholder="Description optionnelle..."
                />
              </div>
            </div>

            <div className="form-section">
              <h3>📅 Date et horaires</h3>

              <div className="form-group">
                <label>Date *</label>
                <input
                  type="date"
                  name="lesson_date"
                  value={formData.lesson_date}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Heure de début *</label>
                  <input
                    type="time"
                    name="start_time"
                    value={formData.start_time}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Heure de fin *</label>
                  <input
                    type="time"
                    name="end_time"
                    value={formData.end_time}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>
            </div>

            {!isBlocked && (
              <div className="form-section">
                <h3>👥 Participants</h3>

                <div className="form-group">
                  <label>Nombre maximum de participants</label>
                  <input
                    type="number"
                    name="max_participants"
                    value={formData.max_participants}
                    onChange={handleChange}
                    className="form-input"
                    min="1"
                    max="50"
                  />
                  <small className="text-muted">Laisser vide pour aucune limite</small>
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Annuler
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Création...' : '✅ Créer le cours'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SingleLessonModal;
