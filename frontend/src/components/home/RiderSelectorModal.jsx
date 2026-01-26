import { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from '../common/Modal';
import { useCurrentRider } from '../../hooks/useCurrrentRider';
import { getRiderTypeLabel, RIDER_TYPES } from '../../lib/domain/domain-constants';
import { COMMON_FILTERS } from '../../lib/helpers/filters/activityFilters';
import { Icons } from '../../lib/icons';
import '../../styles/features/home/riders-selector.css';

// Map des icônes par type de cavalier
const RIDER_TYPE_ICONS = {
  [RIDER_TYPES.OWNER]: Icons.Horse,
  [RIDER_TYPES.CLUB]: Icons.Users,
  [RIDER_TYPES.LOANER]: Icons.User,
};

export default function RiderSelectorModal({ isOpen, onClose }) {
  const { activeRiders, loading, selectRider } = useCurrentRider();
  const [riderTypeFilter, setRiderTypeFilter] = useState(COMMON_FILTERS.ALL);

  // Filtre les riders selon le riderTypeFilter
  const filteredRiders =
    riderTypeFilter === COMMON_FILTERS.ALL
      ? activeRiders
      : activeRiders.filter((r) => r.rider_type === riderTypeFilter);

  const handleSelectRider = (rider) => {
    selectRider(rider);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sélectionnez votre profil" size="md">
      <div className="rider-selector-content">
        {loading ? (
          <div className="loading">
            <div className="loading-spinner" />
            <p>Chargement des cavaliers...</p>
          </div>
        ) : (
          <>
            {/* Filters */}
            {activeRiders.length > 0 && (
              <div className="rider-selector-filters">
                <div className="filter-pills">
                  <button
                    className={`pill ${
                      riderTypeFilter === COMMON_FILTERS.ALL ? 'pill-active' : ''
                    }`}
                    onClick={() => setRiderTypeFilter(COMMON_FILTERS.ALL)}
                  >
                    Tous
                  </button>
                  <button
                    className={`pill ${riderTypeFilter === RIDER_TYPES.OWNER ? 'pill-active' : ''}`}
                    onClick={() => setRiderTypeFilter(RIDER_TYPES.OWNER)}
                  >
                    {getRiderTypeLabel(RIDER_TYPES.OWNER)}
                  </button>
                  <button
                    className={`pill ${riderTypeFilter === RIDER_TYPES.CLUB ? 'pill-active' : ''}`}
                    onClick={() => setRiderTypeFilter(RIDER_TYPES.CLUB)}
                  >
                    {getRiderTypeLabel(RIDER_TYPES.CLUB)}
                  </button>
                  <button
                    className={`pill ${
                      riderTypeFilter === RIDER_TYPES.LOANER ? 'pill-active' : ''
                    }`}
                    onClick={() => setRiderTypeFilter(RIDER_TYPES.LOANER)}
                  >
                    {getRiderTypeLabel(RIDER_TYPES.LOANER)}
                  </button>
                </div>
              </div>
            )}

            {/* Riders List */}
            <div className="rider-selector-list">
              {filteredRiders.map((rider) => {
                const Icon = RIDER_TYPE_ICONS[rider.rider_type] || Icons.User;
                return (
                  <div
                    key={rider.id}
                    className="rider-selector-card"
                    onClick={() => handleSelectRider(rider)}
                  >
                    <div className="rider-selector-icon">
                      <Icon />
                    </div>
                    <div className="rider-selector-info">
                      <div className="rider-selector-name">{rider.name}</div>
                      <div className="rider-selector-type">
                        {getRiderTypeLabel(rider.rider_type)}
                      </div>
                    </div>
                    <div className="rider-selector-chevron">›</div>
                  </div>
                );
              })}

              {filteredRiders.length === 0 && (
                <div className="empty-state-small">
                  <p>Aucun cavalier correspondant au filtre.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}

RiderSelectorModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
