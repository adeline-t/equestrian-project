import React from 'react';
import PropTypes from 'prop-types';
import BasicInfoSection from './BasicInfoSection';
import RecurrenceSection from './RecurrenceSection';
import ValiditySection from './ValiditySection';
import CapacitySection from './CapacitySection';
import { useTemplateForm } from '../../../hooks/useTemplateForm';
import '../../../styles/common/modal.css';
import '../../../styles/common/forms.css';
import '../../../styles/common/alerts.css';
import '../../../styles/common/buttons.css';
import '../../../styles/components/templates.css';

function TemplateModal({ template, onClose, onSuccess }) {
  const {
    formData,
    loading,
    error,
    handleChange,
    handleRecurrenceChange,
    handleDayToggle,
    handleSubmit,
  } = useTemplateForm(template, onSuccess);

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

          <BasicInfoSection formData={formData} onChange={handleChange} isBlocked={isBlocked} />

          <RecurrenceSection
            recurrenceRule={formData.recurrence_rule}
            onRecurrenceChange={handleRecurrenceChange}
            onDayToggle={handleDayToggle}
          />

          <ValiditySection formData={formData} onChange={handleChange} />

          {!isBlocked && <CapacitySection formData={formData} onChange={handleChange} />}

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

TemplateModal.propTypes = {
  template: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default TemplateModal;