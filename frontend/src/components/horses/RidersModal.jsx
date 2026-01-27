import PropTypes from 'prop-types';
import { Icons } from '../../lib/icons.jsx';
import {
  WEEK_DAYS,
  WEEK_DAYS_EN,
  getRiderHorseLinkConfig,
} from '../../lib/domain/domain-constants.js';
import DomainBadge from '../common/DomainBadge.jsx';
import Modal from '../common/Modal.jsx';

/**
 * RidersModal - Shows riders for a horse with their loan days
 */
function RidersModal({ isOpen, onClose, horseName, riders, loading, error }) {
  const getContent = () => {
    if (loading) {
      return (
        <div className="modal-loading">
          <Icons.Loading className="spin" />
          <p>Chargement des cavaliers...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="alert alert-error">
          <Icons.Warning />
          {error}
        </div>
      );
    }

    // ✅ Convertir en tableau si nécessaire
    const ridersArray = Array.isArray(riders) ? riders : [];

    if (ridersArray.length === 0) {
      return (
        <div className="empty-state">
          <Icons.Users />
          <p>Aucun cavalier actif pour ce cheval</p>
        </div>
      );
    }

    return (
      <div className="modal-content">
        <ul className="data-card">
          {ridersArray.map((pairing) => {
            const linkConfig = getRiderHorseLinkConfig(pairing.link_type);
            const isLoan = pairing.link_type === 'loan';
            const loanDays = pairing.loan_days || [];

            return (
              <li key={pairing.id} className="riders-modal-item">
                {/* Rider header */}
                <div className="modal-body">
                  <div className="modal-title mb-20">
                    <h4>{pairing.rider_name || 'N/A'}</h4>
                    {linkConfig && <DomainBadge config={linkConfig} />}
                  </div>

                  {/* Loan days - All days with visual distinction */}
                  {isLoan && (
                    <div className="pairing-days">
                      {WEEK_DAYS_EN.map((dayEn, index) => {
                        const isLoanDay = loanDays.includes(dayEn);
                        return (
                          <span
                            key={dayEn}
                            className={`day-badge ${isLoanDay ? 'active' : 'inactive'}`}
                            title={isLoanDay ? 'Jour de pension' : 'Pas de pension'}
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
        <div className="modal-title">
          <Icons.Users />
          Cavaliers de {horseName || 'ce cheval'}
        </div>
      }
      size="md"
    >
      {getContent()}
    </Modal>
  );
}

RidersModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  horseName: PropTypes.string,
  riders: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      rider_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      rider_name: PropTypes.string,
      link_type: PropTypes.string,
      loan_days: PropTypes.arrayOf(PropTypes.string),
      loan_days_per_week: PropTypes.number,
      pairing_start_date: PropTypes.string,
      pairing_end_date: PropTypes.string,
    })
  ),
  loading: PropTypes.bool,
  error: PropTypes.string,
};

export default RidersModal;
