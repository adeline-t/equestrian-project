import React, { useEffect } from 'react';
import { useCreateBlockedTime } from '../../../../hooks/useCreateBlockedTime.js';
import { Icons } from '../../../../lib/icons';
import '../../../../styles/features/events.css';
import Modal from '../../../common/Modal';
import BlockedTimeForm from './BlockedTimeForm';

function CreateBlockedTimeModal({ onClose, onSuccess, initialDate }) {
  const { formData, handleChange, setFormData, loading, error, createBlockedTime } =
    useCreateBlockedTime();

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
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Bloquer une période"
      size="medium"
      footer={
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
      }
    >
      {error && (
        <div className="alert alert-error mb-20">
          <Icons.Warning />
          {error}
        </div>
      )}

      <div className="alert alert-warning mb-20">
        <Icons.Info />
        Cette période sera bloquée et aucun cours ne pourra être créé pendant ce créneau.
      </div>

      <BlockedTimeForm formData={formData} handleChange={handleChange} setFormData={setFormData} />
    </Modal>
  );
}

export default CreateBlockedTimeModal;
