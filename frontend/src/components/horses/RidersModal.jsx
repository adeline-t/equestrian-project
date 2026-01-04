import React from 'react';
import { Icons } from '../../lib/libraries/icons.jsx';

const RidersModal = ({ isOpen, onClose, horseName, riders, loading }) => {
  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '600px',
          width: '90%',
        }}
      >
        <div className="modal-header">
          <h3>
            <Icons.Users style={{ marginRight: '8px' }} />
            Cavaliers de {horseName}
          </h3>
          <button className="modal-close" onClick={onClose}>
            <Icons.Close />
          </button>
        </div>
        <div style={{ padding: '20px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <Icons.Loading className="spin" style={{ fontSize: '32px', marginBottom: '12px' }} />
              <div className="loading">Chargement des cavaliers...</div>
            </div>
          ) : riders?.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#718096' }}>
              <Icons.Users style={{ fontSize: '48px', marginBottom: '12px' }} />
              <p>Aucun cavalier actif pour ce cheval</p>
            </div>
          ) : (
            <div>
              <p
                style={{
                  marginBottom: '16px',
                  color: '#4a5568',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Icons.Info />
                {riders?.length} cavalier(s) actif(s)
              </p>
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  maxHeight: '400px',
                  overflowY: 'auto',
                }}
              >
                {riders?.map((rider, index) => (
                  <li
                    key={rider.id || index}
                    style={{
                      padding: '12px 16px',
                      borderBottom: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Icons.User style={{ marginRight: '12px', color: '#4299e1' }} />
                      <div style={{ fontWeight: '500', color: '#2d3748' }}>{rider.name}</div>
                    </div>
                    {rider.level && <span className="badge badge-secondary">{rider.level}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div style={{ marginTop: '20px' }}>
            <button className="btn btn-secondary" onClick={onClose} style={{ width: '100%' }}>
              <Icons.Close style={{ marginRight: '4px' }} /> Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RidersModal;
