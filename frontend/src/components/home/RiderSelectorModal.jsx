import { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from '../common/Modal';
import { useCurrentRider } from '../../hooks/useCurrrentRider';
import { getRiderTypeLabel, RIDER_TYPES } from '../../lib/domain/domain-constants';
import '../../styles/features/home.css';

const COMMON_FILTERS = {
  ALL: 'all',
};

export default function RiderSelectorModal({ isOpen, onClose }) {
  const { activeRiders, loading, selectRider } = useCurrentRider();
  const [riderTypeFilter, setRiderTypeFilter] = useState(COMMON_FILTERS.ALL);

  // Filtre les riders selon le riderTypeFilter
  const filteredRiders =
    riderTypeFilter === COMMON_FILTERS.ALL
      ? activeRiders
      : activeRiders.filter((r) => r.rider_type === riderTypeFilter);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sélectionnez votre profil" size="small">
      {loading ? (
        <p>Chargement des cavaliers...</p>
      ) : (
        <>
          {/* Filters */}
          {activeRiders.length > 0 && (
            <div className="filter-section mb-20">
              <div className="filter-pills">
                <button
                  className={`pill ${riderTypeFilter === COMMON_FILTERS.ALL ? 'pill-active' : ''}`}
                  onClick={() => setRiderTypeFilter(COMMON_FILTERS.ALL)}
                  data-rider-type="all"
                >
                  Tous
                </button>
                <button
                  className={`pill ${riderTypeFilter === RIDER_TYPES.OWNER ? 'pill-active' : ''}`}
                  onClick={() => setRiderTypeFilter(RIDER_TYPES.OWNER)}
                  data-rider-type={RIDER_TYPES.OWNER}
                >
                  {getRiderTypeLabel(RIDER_TYPES.OWNER)}
                </button>
                <button
                  className={`pill ${riderTypeFilter === RIDER_TYPES.CLUB ? 'pill-active' : ''}`}
                  onClick={() => setRiderTypeFilter(RIDER_TYPES.CLUB)}
                  data-rider-type={RIDER_TYPES.CLUB}
                >
                  {getRiderTypeLabel(RIDER_TYPES.CLUB)}
                </button>
                <button
                  className={`pill ${riderTypeFilter === RIDER_TYPES.LOANER ? 'pill-active' : ''}`}
                  onClick={() => setRiderTypeFilter(RIDER_TYPES.LOANER)}
                  data-rider-type={RIDER_TYPES.LOANER}
                >
                  {getRiderTypeLabel(RIDER_TYPES.LOANER)}
                </button>
              </div>
            </div>
          )}

          {/* Riders List */}
          <div className="button-group">
            {filteredRiders.map((r) => (
              <button
                key={r.id}
                className="btn btn-outline-secondary"
                onClick={() => {
                  selectRider(r);
                  onClose();
                }}
              >
                <strong>{r.name}</strong>
              </button>
            ))}
            {filteredRiders.length === 0 && <p>Aucun cavalier correspondant au filtre.</p>}
          </div>
        </>
      )}
    </Modal>
  );
}

RiderSelectorModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
