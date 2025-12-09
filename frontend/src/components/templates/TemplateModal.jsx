import React, { useState, useEffect } from 'react';
import { templatesApi } from '../../services/calendarApi';
import { ridersApi, horsesApi } from '../../services/api';

function TemplateModal({ template, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    lesson_type: 'group',
    start_time: '19:00',
    duration_minutes: 60,
    valid_from: new Date().toISOString().split('T')[0],
    valid_until: '',
    max_participants: 8,
    min_participants: 2,
    recurrence_rule: {
      frequency: 'weekly',
      interval: 1,
      byDay: ['monday'],
      startTime: '19:00',
      duration: 60,
    },
  });

  const [riders, setRiders] = useState([]);
  const [horses, setHorses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
    if (template) {
      // Parse recurrence_rule if it's a string
      let recurrenceRule = template.recurrence_rule;
      if (typeof recurrenceRule === 'string') {
        try {
          recurrenceRule = JSON.parse(recurrenceRule);
        } catch (e) {
          console.error('Error parsing recurrence_rule:', e);
          recurrenceRule = {
            frequency: 'weekly',
            interval: 1,
            byDay: ['monday'],
            startTime: template.start_time || '19:00',
            duration: template.duration_minutes || 60,
          };
        }
      }

      const templateData = {
        ...template,
        valid_from: template.valid_from || new Date().toISOString().split('T')[0],
        valid_until: template.valid_until || '',
        recurrence_rule: recurrenceRule,
      };

      // Ensure blocked templates have 0 participants
      if (template.lesson_type === 'blocked') {
        templateData.max_participants = 0;
        templateData.min_participants = 0;
      }

      setFormData(templateData);
    }
  }, [template]);

  const loadData = async () => {
    try {
      const [ridersData, horsesData] = await Promise.all([ridersApi.getAll(), horsesApi.getAll()]);
      setRiders(ridersData);
      setHorses(horsesData);
    } catch (err) {
      console.error('Error loading data:', err);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const updated = {
        ...prev,
        [field]: value,
      };

      // If changing to blocked type, set participants to 0
      if (field === 'lesson_type' && value === 'blocked') {
        updated.max_participants = 0;
        updated.min_participants = 0;
      }

      // If changing FROM blocked type, restore default participant values
      if (field === 'lesson_type' && prev.lesson_type === 'blocked' && value !== 'blocked') {
        if (value === 'private') {
          updated.max_participants = 1;
          updated.min_participants = 1;
        } else if (value === 'group') {
          updated.max_participants = 8;
          updated.min_participants = 2;
        } else {
          updated.max_participants = 8;
          updated.min_participants = 1;
        }
      }

      // Synchroniser avec recurrence_rule
      if (field === 'start_time') {
        updated.recurrence_rule = {
          ...prev.recurrence_rule,
          startTime: value,
        };
      }
      if (field === 'duration_minutes') {
        updated.recurrence_rule = {
          ...prev.recurrence_rule,
          duration: parseInt(value) || 60,
        };
      }

      return updated;
    });
  };

  const handleRecurrenceChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      recurrence_rule: {
        ...prev.recurrence_rule,
        [field]: value,
      },
    }));
  };

  const handleDayToggle = (day) => {
    const currentDays = formData.recurrence_rule.byDay || [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter((d) => d !== day)
      : [...currentDays, day];

    handleRecurrenceChange('byDay', newDays);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const submitData = { ...formData };

      // Ensure recurrence_rule is properly formatted
      if (typeof submitData.recurrence_rule === 'object') {
        // Make sure all required fields are present
        submitData.recurrence_rule = {
          frequency: submitData.recurrence_rule.frequency || 'weekly',
          interval: parseInt(submitData.recurrence_rule.interval) || 1,
          byDay: submitData.recurrence_rule.byDay || [],
          startTime: submitData.start_time,
          duration: parseInt(submitData.duration_minutes) || 60,
        };
      }

      // Force 0 participants for blocked lessons
      if (submitData.lesson_type === 'blocked') {
        submitData.max_participants = 0;
        submitData.min_participants = 0;
      } else {
        // Convert to integers for non-blocked lessons
        if (submitData.max_participants !== undefined && submitData.max_participants !== null) {
          submitData.max_participants = parseInt(submitData.max_participants);
          // Ensure it's a valid number
          if (isNaN(submitData.max_participants)) {
            submitData.max_participants = null;
          }
        }

        if (submitData.min_participants !== undefined && submitData.min_participants !== null) {
          submitData.min_participants = parseInt(submitData.min_participants);
          // Ensure it's a valid number, default to 1
          if (isNaN(submitData.min_participants) || submitData.min_participants < 1) {
            submitData.min_participants = 1;
          }
        }
      }

      // Validate weekly recurrence has at least one day selected
      if (
        submitData.recurrence_rule.frequency === 'weekly' &&
        (!submitData.recurrence_rule.byDay || submitData.recurrence_rule.byDay.length === 0)
      ) {
        setError('Veuillez sélectionner au moins un jour de la semaine');
        setLoading(false);
        return;
      }

      console.log('Submitting template data:', submitData); // Debug

      if (template) {
        await templatesApi.update(template.id, submitData);
      } else {
        await templatesApi.create(submitData);
      }
      onSuccess();
    } catch (err) {
      console.error('Submit error:', err);
      const errorMessage =
        err.response?.data?.error || err.message || 'Erreur lors de la sauvegarde';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const lessonTypes = [
    { value: 'private', label: '👤 Cours Particulier', maxP: 1, minP: 1 },
    { value: 'group', label: '👥 Cours Collectif', maxP: 8, minP: 2 },
    { value: 'training', label: '🎓 Stage', maxP: 12, minP: 3 },
    { value: 'competition', label: '🏆 Concours', maxP: null, minP: 1 },
    { value: 'event', label: '🎉 Événement', maxP: null, minP: 1 },
    { value: 'blocked', label: '🚫 Plage Bloquée', maxP: 0, minP: 0 },
  ];

  const weekDays = [
    { value: 'monday', label: 'Lun' },
    { value: 'tuesday', label: 'Mar' },
    { value: 'wednesday', label: 'Mer' },
    { value: 'thursday', label: 'Jeu' },
    { value: 'friday', label: 'Ven' },
    { value: 'saturday', label: 'Sam' },
    { value: 'sunday', label: 'Dim' },
  ];

  const isBlocked = formData.lesson_type === 'blocked';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content template-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{template ? 'Modifier le template' : 'Nouveau template de cours'}</h2>
          <button className="btn-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="template-form">
          {error && (
            <div className="alert alert-error">
              <strong>Erreur:</strong> {error}
            </div>
          )}

          {/* Informations de base */}
          <div className="form-section">
            <h3>Informations générales</h3>

            <div className="form-group">
              <label>Nom du cours *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
                placeholder="Ex: Cours collectif débutants - Lundi soir"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                rows="3"
                placeholder="Description du cours..."
                className="form-textarea"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Type de cours *</label>
                <select
                  value={formData.lesson_type}
                  onChange={(e) => handleChange('lesson_type', e.target.value)}
                  required
                  className="form-select"
                >
                  {lessonTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Heure de début *</label>
                <input
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => handleChange('start_time', e.target.value)}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Durée (minutes) *</label>
                <input
                  type="number"
                  value={formData.duration_minutes}
                  onChange={(e) => handleChange('duration_minutes', parseInt(e.target.value) || 60)}
                  min="15"
                  step="15"
                  required
                  className="form-input"
                />
              </div>
            </div>

            {isBlocked && (
              <div className="alert alert-info">
                ℹ️ Les plages bloquées empêchent toute réservation de cours sur ce créneau. Elles
                peuvent être annulées ponctuellement pour permettre des cours exceptionnels.
              </div>
            )}
          </div>

          {/* Règle de récurrence */}
          <div className="form-section">
            <h3>Récurrence</h3>

            <div className="form-row">
              <div className="form-group">
                <label>Fréquence</label>
                <select
                  value={formData.recurrence_rule.frequency}
                  onChange={(e) => handleRecurrenceChange('frequency', e.target.value)}
                  className="form-select"
                >
                  <option value="daily">Quotidien</option>
                  <option value="weekly">Hebdomadaire</option>
                  <option value="monthly">Mensuel</option>
                </select>
              </div>

              <div className="form-group">
                <label>Intervalle</label>
                <input
                  type="number"
                  value={formData.recurrence_rule.interval}
                  onChange={(e) =>
                    handleRecurrenceChange('interval', parseInt(e.target.value) || 1)
                  }
                  min="1"
                  className="form-input"
                />
                <small className="text-muted">
                  {formData.recurrence_rule.frequency === 'weekly' &&
                    `Toutes les ${formData.recurrence_rule.interval} semaine(s)`}
                  {formData.recurrence_rule.frequency === 'daily' &&
                    `Tous les ${formData.recurrence_rule.interval} jour(s)`}
                  {formData.recurrence_rule.frequency === 'monthly' &&
                    `Tous les ${formData.recurrence_rule.interval} mois`}
                </small>
              </div>
            </div>

            {formData.recurrence_rule.frequency === 'weekly' && (
              <div className="form-group">
                <label>Jours de la semaine *</label>
                <div className="day-selector">
                  {weekDays.map((day) => (
                    <button
                      key={day.value}
                      type="button"
                      className={`day-button ${
                        (formData.recurrence_rule.byDay || []).includes(day.value) ? 'active' : ''
                      }`}
                      onClick={() => handleDayToggle(day.value)}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
                {formData.recurrence_rule.byDay?.length === 0 && (
                  <small className="text-danger">
                    ⚠️ Sélectionnez au moins un jour de la semaine
                  </small>
                )}
              </div>
            )}
          </div>

          {/* Dates de validité */}
          <div className="form-section">
            <h3>Période de validité</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Date de début *</label>
                <input
                  type="date"
                  value={formData.valid_from}
                  onChange={(e) => handleChange('valid_from', e.target.value)}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Date de fin (optionnelle)</label>
                <input
                  type="date"
                  value={formData.valid_until || ''}
                  onChange={(e) => handleChange('valid_until', e.target.value)}
                  min={formData.valid_from}
                  className="form-input"
                />
                <small className="text-muted">Laisser vide pour un template sans date de fin</small>
              </div>
            </div>
          </div>

          {/* Capacité (sauf pour plages bloquées) */}
          {!isBlocked && (
            <div className="form-section">
              <h3>Capacité</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Participants minimum *</label>
                  <input
                    type="number"
                    value={formData.min_participants}
                    onChange={(e) =>
                      handleChange('min_participants', parseInt(e.target.value) || 1)
                    }
                    min="1"
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>
                    Participants maximum {formData.lesson_type === 'competition' && '(optionnel)'}
                  </label>
                  <input
                    type="number"
                    value={formData.max_participants || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      handleChange('max_participants', val === '' ? null : parseInt(val));
                    }}
                    min={formData.min_participants}
                    placeholder={
                      formData.lesson_type === 'competition' ? 'Illimité' : 'Nombre maximum'
                    }
                    className="form-input"
                  />
                  {formData.lesson_type === 'competition' && (
                    <small className="text-muted">
                      Laisser vide pour un nombre illimité de participants
                    </small>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
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
              {loading ? 'Enregistrement...' : template ? 'Mettre à jour' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TemplateModal;
