import React, { useEffect } from 'react';
import { useEventBlockedCreate } from '../../../../hooks/useEventBlockedCreate.js';
import { Icons } from '../../../../lib/icons';
import Modal from '../../../common/Modal';
import BlockedTimeForm from './BlockedTimeForm';

function CreateBlockedTimeModal({ onClose, onSuccess, initialDate }) {
  const { formData, handleChange, setFormData, loading, error, createBlockedTime } =
    useEventBlockedCreate();

  // Initialize date when modal opens
  useEffect(() => {
    if (initialDate) {
      setFormData((prev) => ({ ...prev, slot_date: initialDate }));
    }
  }, [initialDate, setFormData]);

  const handleSubmit = async () => {
    const result = await createBlockedTime();
    if (result.success) {
      onSuccess?.();
      onClose();
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Bloquer une période" size="md">
      <div className="entity-form">
        {error && (
          <div className="alert alert-error">
            <Icons.Warning />
            {error}
          </div>
        )}

        <div className="alert alert-warning">
          <Icons.Info />
          Cette période sera bloquée et aucun cours ne pourra être créé pendant ce créneau.
        </div>

        <BlockedTimeForm
          formData={formData}
          handleChange={handleChange}
          setFormData={setFormData}
        />

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
            <Icons.Cancel />
            Annuler
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <Icons.Loading className="spin" />
                Création...
              </>
            ) : (
              <>
                <Icons.Blocked />
                Bloquer
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default CreateBlockedTimeModal;
