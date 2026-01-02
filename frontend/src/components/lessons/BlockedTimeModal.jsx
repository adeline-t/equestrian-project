import React, { useState } from 'react';
import { lessonsApi } from '../../services/calendarApi';
import Portal from '../../utils/Portal';
import { Icons } from '../../utils/icons';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import './LessonModal.css';

function BlockedTimeModal({ onClose, onSuccess, initialDate = null, initialStartTime = null, initialEndTime = null }) {
  const [formData, setFormData] = useState({
    lesson_date: initialDate || format(new Date(), 'yyyy-MM-dd'),
    start_time: initialStartTime || '09:00',
    end_time: initialEndTime || '10:00',
    lesson_type: 'blocked',
    name: '',
    description: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Auto-generate name based on date and time if not manually set
    if (name !== 'name' && !formData.name) {
      const autoName = `Bloqué - ${format(parseISO(formData.lesson_date), 'dd/MM', { locale: fr })} ${formData.start_time}`;
      setFormData(prev => ({
        ...prev,
        [name]: value,
        name: autoName
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const calculateDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return '0 min';
    
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    const duration = endMinutes - startMinutes;
    
    if (duration < 60) {
      return `${duration} min`;
    } else {
      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;
      return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (formData.start_time >= formData.end_time) {
        throw new Error("L'heure de fin doit être après l'heure de début");
      }

      // Ensure name is set
      const finalFormData = {
        ...formData,
        name: formData.name || `Bloqué - ${format(parseISO(formData.lesson_date), 'dd/MM', { locale: fr })} ${formData.start_time}`
      };

      await lessonsApi.create(finalFormData);
      onSuccess();
    } catch (err) {
      console.error('Error creating blocked time:', err);
      setError(err.response?.data?.error || err.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Portal>
      <div className="modal-overlay" onClick={onClose}>
        <div 
          className="modal-content" 
          onClick={(e) => e.stopPropagation()}
          style={{ maxWidth: '600px' }}
        >
          <div className="modal-header">
            <h2>
              <Icons.Blocked style={{ marginRight: '8px' }} />
              Créer une plage bloquée
            </h2>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body" style={{ padding: '20px' }}>
              {error && (
                <div className="alert alert-error" style={{ marginBottom: '15px' }}>
                  <Icons.Warning style={{ marginRight: '8px' }} />
                  {error}
                </div>
              )}

              {/* Date */}
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label style={{ fontSize: '14px', marginBottom: '5px', display: 'block' }}>
                  <Icons.Calendar style={{ marginRight: '4px', fontSize: '12px' }} />
                  Date *
                </label>
                <input
                  type="date"
                  name="lesson_date"
                  value={formData.lesson_date}
                  onChange={handleChange}
                  className="form-input"
                  required
                  style={{ fontSize: '14px' }}
                />
              </div>

              {/* Time */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
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
                <div style={{ 
                  background: '#f8f9fa', 
                  padding: '8px 12px', 
                  borderRadius: '6px',
                  fontSize: '13px',
                  color: '#6c757d',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Icons.Clock style={{ fontSize: '14px' }} />
                  Durée: {calculateDuration(formData.start_time, formData.end_time)}
                </div>
              </div>

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
                  placeholder="Laissez vide pour un nom automatique"
                  style={{ fontSize: '14px' }}
                />
              </div>

              {/* Description */}
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label style={{ fontSize: '14px', marginBottom: '5px', display: 'block' }}>
                  <Icons.Info style={{ marginRight: '4px', fontSize: '12px' }} />
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-textarea"
                  rows="3"
                  placeholder="Raison du blocage (optionnel)..."
                  style={{ fontSize: '14px' }}
                />
              </div>

              {/* Preview */}
              <div style={{
                background: '#fff5f5',
                border: '1px solid #feb2b2',
                borderRadius: '6px',
                padding: '12px',
                fontSize: '13px',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '6px',
                }}>
                  <Icons.Blocked style={{ fontSize: '16px', color: '#e53e3e' }} />
                  <strong>{formData.name || 'Bloqué'}</strong>
                  <span
                    style={{
                      marginLeft: 'auto',
                      padding: '2px 8px',
                      background: '#e53e3e',
                      color: 'white',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                    }}
                  >
                    Bloqué
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '15px', color: '#718096', fontSize: '12px' }}>
                  <span>
                    <Icons.Calendar style={{ fontSize: '11px', marginRight: '4px' }} />
                    {format(parseISO(formData.lesson_date), 'dd/MM/yyyy', { locale: fr })}
                  </span>
                  <span>
                    <Icons.Clock style={{ fontSize: '11px', marginRight: '4px' }} />
                    {formData.start_time} - {formData.end_time}
                  </span>
                  <span>
                    <Icons.Info style={{ fontSize: '11px', marginRight: '4px' }} />
                    {calculateDuration(formData.start_time, formData.end_time)}
                  </span>
                </div>
                {formData.description && (
                  <div style={{ marginTop: '6px', fontSize: '12px', color: '#4a5568' }}>
                    {formData.description}
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <div className="modal-actions-compact">
                <button
                  type="button"
                  className="btn btn-sm btn-secondary"
                  onClick={onClose}
                  disabled={loading}
                >
                  <Icons.Cancel style={{ marginRight: '6px', fontSize: '14px' }} />
                  Annuler
                </button>
                <button type="submit" className="btn btn-sm btn-danger" disabled={loading}>
                  {loading ? (
                    <>
                      <Icons.Loading className="spin" style={{ marginRight: '6px', fontSize: '14px' }} />
                      Création...
                    </>
                  ) : (
                    <>
                      <Icons.Blocked style={{ marginRight: '6px', fontSize: '14px' }} />
                      Bloquer
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Portal>
  );
}

export default BlockedTimeModal;