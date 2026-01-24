import { useState } from 'react';
import { Icons } from '../../lib/icons';
import '../../styles/features/home.css';
import Modal from '../common/Modal';

const ADMIN_PASSWORD = 'defly';

export default function AdminPasswordModal({ isOpen, onClose, onSuccess }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();

    if (password === ADMIN_PASSWORD) {
      setPassword('');
      setError('');
      onSuccess();
    } else {
      setError('Mot de passe incorrect');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="small"
      title={
        <span className="modal-title">
          <Icons.Lock />
          Accès administrateur
        </span>
      }
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose}>
            Annuler
          </button>
          <button className="btn btn-primary" onClick={submit}>
            Valider
          </button>
        </>
      }
    >
      <form onSubmit={submit}>
        <div className="form-group">
          <label>Mot de passe</label>
          <input
            type="password"
            value={password}
            autoFocus
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
          />
        </div>

        {error && <p className="form-error">{error}</p>}
      </form>
    </Modal>
  );
}
