import React from 'react';
import PropTypes from 'prop-types';
import Modal from '../../common/Modal';
import { Icons } from '../../../lib/icons';
import '../../../styles/common/modal.css';
import '../../../styles/common/badges.css';
import '../../../styles/common/buttons.css';

function RidersModal({ isOpen, onClose, horseRiders, loading }) {
  // Loading content
  const loadingContent = (
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <Icons.Loading className="spin" style={{ fontSize: '32px', marginBottom: '12px' }} />
      <p>Chargement des cavaliers...</p>
    </div>
  );

  // Empty state content
  const emptyContent = (
    <div style={{ textAlign: 'center', padding: '40px', color: '#718096' }}>
      <Icons.Users style={{ fontSize: '48px', marginBottom: '12px' }} />
      <p>Aucun cavalier actif pour ce cheval</p>
    </div>
  );

  // Riders list content
  const ridersContent = (
    <div>
      <p
        style={{
          marginBottom: '16px',
          color: '#4a5568',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.95rem',
        }}
      >
        <Icons.Info />
        {horseRiders?.riders.length} cavalier(s) actif(s)
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
        {horseRiders?.riders.map((rider, index) => (
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Icons.User style={{ color: '#4299e1', flexShrink: 0 }} />
              <div style={{ fontWeight: '500', color: '#2d3748' }}>{rider.name}</div>
            </div>
            {rider.level && <span className="badge badge-secondary">{rider.level}</span>}
          </li>
        ))}
      </ul>
    </div>
  );

  // Determine which content to show
  const getContent = () => {
    if (loading) return loadingContent;
    if (!horseRiders?.riders || horseRiders.riders.length === 0) return emptyContent;
    return ridersContent;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Icons.Users />
          Cavaliers de {horseRiders?.horseName}
        </div>
      }
      size="medium"
    >
      {getContent()}
    </Modal>
  );
}

RidersModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  horseRiders: PropTypes.shape({
    horseName: PropTypes.string,
    riders: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        name: PropTypes.string,
        level: PropTypes.string,
      })
    ),
  }),
  loading: PropTypes.bool,
};

export default RidersModal;
