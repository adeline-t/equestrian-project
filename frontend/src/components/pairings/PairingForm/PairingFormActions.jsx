import React from 'react';
import PropTypes from 'prop-types';
import { Icons } from '../../../lib/icons';

const PairingFormActions = ({ onSubmit, onCancel, submitting, isEdit }) => {
  return (
    <div className="modal-footer">
      <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={submitting}>
        <Icons.Cancel />
        Annuler
      </button>
      <button type="submit" className="btn btn-primary" onClick={onSubmit} disabled={submitting}>
        {submitting ? (
          <>
            <Icons.Loading className="spin" />
            Enregistrement...
          </>
        ) : (
          <>
            <Icons.Save />
            {isEdit ? 'Mettre à jour' : 'Créer'}
          </>
        )}
      </button>
    </div>
  );
};

PairingFormActions.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  submitting: PropTypes.bool,
  isEdit: PropTypes.bool,
};

export default PairingFormActions;
