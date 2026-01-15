import PropTypes from 'prop-types';
import { Icons } from '../../lib/icons.jsx';
import Modal from '../common/Modal.jsx';
import '../../styles/common/alerts.css';

/**
 * RidersModal - Shows riders for a horse
 */
function RidersModal({ isOpen, onClose, horseRiders, loading, error }) {
  const getContent = () => {
    if (loading) {
      return (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Icons.Loading className="spin" style={{ fontSize: '32px', marginBottom: '12px' }} />
          <p>Chargement des cavaliers...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="alert alert-error">
          <Icons.Warning style={{ marginRight: '8px' }} />
          {error}
        </div>
      );
    }

    if (!horseRiders?.riders || horseRiders.riders.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-gray-500)' }}>
          <Icons.Users style={{ fontSize: '48px', marginBottom: '12px' }} />
          <p>Aucun cavalier actif pour ce cheval</p>
        </div>
      );
    }

    return (
      <div>
        <p
          style={{
            marginBottom: '16px',
            color: 'var(--color-gray-600)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Icons.Info />
          {horseRiders.riders.length} cavalier(s) actif(s)
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
          {horseRiders.riders.map((rider) => (
            <li
              key={rider.id}
              style={{
                padding: '12px 16px',
                borderBottom: '1px solid var(--color-gray-200)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <Icons.User style={{ color: 'var(--color-info-blue)', flexShrink: 0 }} />
              <div style={{ fontWeight: '500' }}>{rider.name}</div>
            </li>
          ))}
        </ul>
      </div>
    );
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
      })
    ),
  }),
  loading: PropTypes.bool,
  error: PropTypes.string,
};

export default RidersModal;
