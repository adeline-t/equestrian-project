import PropTypes from 'prop-types';
import { Icons } from '../../lib/icons.jsx';
import { WEEK_DAYS, WEEK_DAYS_EN } from '../../lib/domain/domain-constants.js';
import Modal from '../common/Modal.jsx';
import '../../styles/components/horses.css';

/**
 * RidersModal - Shows riders for a horse with their loan days
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
            margin: '16px',
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
          {horseRiders.riders.map((pairing) => {
            const isLoan = pairing.link_type === 'loan';
            const loanDays = pairing.loan_days || [];

            return (
              <li
                key={pairing.id}
                style={{
                  padding: '16px',
                  borderBottom: '1px solid var(--color-gray-200)',
                  backgroundColor: 'var(--color-white)',
                }}
              >
                {/* Rider header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: isLoan ? '12px' : '0',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', fontSize: '15px', marginBottom: '4px' }}>
                      {pairing.riders?.name || 'N/A'}
                    </div>
                    <span
                      className={`pairing-type-badge ${isLoan ? 'loan' : 'own'}`}
                      style={{ fontSize: '11px' }}
                    >
                      {isLoan ? 'Demi-pension' : 'Propriétaire'}
                    </span>
                  </div>

                  {/* Loan days - All days with visual distinction */}
                  {isLoan && (
                    <div
                      className="pairing-days"
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '4px',
                        flexWrap: 'wrap',
                        marginTop: '12px',
                        paddingTop: '12px',
                      }}
                    >
                      {WEEK_DAYS_EN.map((dayEn, index) => {
                        const isLoanDay = loanDays.includes(dayEn);
                        return (
                          <span
                            key={dayEn}
                            className={`day-badge ${isLoanDay ? 'active' : 'inactive'}`}
                            title={isLoanDay ? 'Jour de pension' : 'Pas de pension'}
                            style={{
                              minWidth: '38px',
                              padding: '5px 8px',
                              fontSize: '11px',
                            }}
                          >
                            {WEEK_DAYS[index]}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
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
        link_type: PropTypes.string,
        loan_days: PropTypes.arrayOf(PropTypes.string),
        pairing_start_date: PropTypes.string,
        pairing_end_date: PropTypes.string,
        riders: PropTypes.shape({
          id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
          name: PropTypes.string,
        }),
      })
    ),
  }),
  loading: PropTypes.bool,
  error: PropTypes.string,
};

export default RidersModal;
