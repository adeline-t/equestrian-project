import React from 'react';
import PropTypes from 'prop-types';
import { useRiderCard } from '../../hooks/useRiderCard';
import { RiderCardHeader } from './RiderCardHeader';
import { RiderTabs } from './RiderTabs';
import { RiderInfo } from './RiderInfo';
import { PackagesList } from './PackagesList';
import { PairingsList } from './PairingsList';
import { OwnedHorsesList } from './OwnedHorsesList';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import Portal from '../../components/common/Portal';
import { Icons } from '../../lib/libraries/icons';
import * as commonStyles from '../../styles/common/common.module.css';

function RiderCard({ riderId, onClose }) {
  // Note: Since this component takes riderId, we need to fetch the rider first
  // For now, we'll assume the parent passes the full rider object
  // This would be better handled with a wrapper or by modifying the hook
  
  const [rider, setRider] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const {
    activeTab,
    showDeleteModal,
    packages,
    pairings,
    horses,
    loading: dataLoading,
    error: dataError,
    setActiveTab,
    setShowDeleteModal,
    handleDelete,
    handlePackageStatusChange,
    handlePairingStatusChange,
    handlePackageAdd,
    handlePairingAdd,
    getRiderStats
  } = useRiderCard({ rider, onPackageAdd: null, onPairingAdd: null, onUpdate: null });

  // Fetch rider data when riderId changes
  React.useEffect(() => {
    const fetchRider = async () => {
      try {
        setLoading(true);
        setError(null);
        const { ridersApi } = await import('../../services/api');
        const riderData = await ridersApi.getById(riderId);
        setRider(riderData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (riderId) {
      fetchRider();
    }
  }, [riderId]);

  const tabs = [
    {
      id: 'info',
      label: 'Informations',
      content: <RiderInfo rider={rider} stats={getRiderStats()} />
    },
    {
      id: 'packages',
      label: `Forfaits (${packages.length})`,
      content: (
        <PackagesList
          packages={packages}
          loading={dataLoading.packages}
          rider={rider}
          onStatusChange={handlePackageStatusChange}
          onAdd={handlePackageAdd}
        />
      )
    },
    {
      id: 'pairings',
      label: `Pairings (${pairings.length})`,
      content: (
        <PairingsList
          pairings={pairings}
          loading={dataLoading.pairings}
          rider={rider}
          onStatusChange={handlePairingStatusChange}
          onAdd={handlePairingAdd}
        />
      )
    },
    {
      id: 'horses',
      label: `Chevaux (${horses.length})`,
      content: (
        <OwnedHorsesList
          horses={horses}
          loading={dataLoading.horses}
        />
      )
    }
  ];

  if (loading) {
    return (
      <Portal>
        <div className="modal-overlay">
          <div className="modal rider-card-modal">
            <div className="loading">
              Chargement des informations du cavalier...
            </div>
          </div>
        </div>
      </Portal>
    );
  }

  if (error || !rider) {
    return (
      <Portal>
        <div className="modal-overlay" onClick={onClose}>
          <div className="modal rider-card-modal">
            <div className="error">
              {error || 'Cavalier non trouvé'}
            </div>
          </div>
        </div>
      </Portal>
    );
  }

  return (
    <Portal>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal rider-card-modal" onClick={(e) => e.stopPropagation()}>
          <RiderCardHeader
            rider={rider}
            onEdit={() => { /* TODO: Implement edit */ }}
            onDelete={() => setShowDeleteModal(true)}
          />

          <RiderTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Fermer
            </button>
          </div>

          <DeleteConfirmationModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={handleDelete}
            riderName={rider.name}
          />
        </div>
      </div>
    </Portal>
  );
}

RiderCard.propTypes = {
  riderId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default RiderCard;