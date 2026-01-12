import React from 'react';
import { Icons } from '../../../lib/icons';

const FormActions = ({ onSubmit, onCancel, submitting, isEdit, submitError }) => {
  return (
    <>
      {/* Submit Error Alert */}
      {submitError && (
        <div className="alert alert-error" style={{ margin: '16px 20px 0 20px' }}>
          <Icons.Warning style={{ marginRight: '8px', fontSize: '16px' }} />
          <strong>Erreur:</strong> {submitError}
        </div>
      )}

      <div className="modal-footer">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
          disabled={submitting}
        >
          <Icons.Cancel style={{ marginRight: '8px' }} />
          Annuler
        </button>
        <button type="submit" className="btn btn-primary" onClick={onSubmit} disabled={submitting}>
          {submitting ? (
            <>
              <Icons.Loading className="spin" style={{ marginRight: '8px' }} />
              Enregistrement...
            </>
          ) : (
            <>
              <Icons.Save style={{ marginRight: '8px' }} />
              {isEdit ? 'Mettre à jour' : 'Créer'}
            </>
          )}
        </button>
      </div>
    </>
  );
};

export default FormActions;
