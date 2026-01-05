import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Icons } from '../../../lib/libraries/icons.jsx';
import PackageForm from '../../packages/PackageForm';
import PairingForm from '../../pairings/PairingForm';
import Modal from '../../common/Modal';
import RiderInfo from './RiderInfo';
import OwnedHorsesList from './OwnedHorsesList';
import PackagesList from './PackagesList.jsx';
import PairingsList from './PairingsList.jsx';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { useRiderCard } from '../../../hooks/useRiderCard';
import { usePackageActions } from '../../../hooks/usePackageActions';
import { usePairingActions } from '../../../hooks/usePairingActions';
import {
  filterActivePackages,
  filterActivePairings,
  filterActiveHorses,
} from '../../../lib/helpers/filters/activityFilters.js';
import '../../../styles/common/modal.css';
import '../../../styles/common/alerts.css';
import '../../../styles/common/buttons.css';
import '../../../styles/components/riders.css';

function RiderCard({ riderId, onClose }) {
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState(null);

  // Load rider data
  const {
    rider,
    packages,
    pairings,
    ownedHorses,
    riders,
    horses,
    loading,
    error: loadError,
    reload,
  } = useRiderCard(riderId);

  // Handle success messages
  const handleSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
    reload();
  };

  // Handle errors
  const handleError = (err) => {
    setError(err.message);
    setTimeout(() => setError(null), 5000);
  };

  // Package actions
  const packageActions = usePackageActions(handleSuccess);

  const handlePackageSubmit = async (packageData) => {
    try {
      await packageActions.handleSubmit(riderId, packageData);
    } catch (err) {
      handleError(err);
      throw err;
    }
  };

  const handlePackageRemove = async () => {
    try {
      await packageActions.handleRemoveFromInventory();
    } catch (err) {
      handleError(err);
    }
  };

  const handlePackageDelete = async () => {
    try {
      await packageActions.handlePermanentDelete();
    } catch (err) {
      handleError(err);
    }
  };

  // Pairing actions
  const pairingActions = usePairingActions(handleSuccess);

  const handlePairingSubmit = async (pairingData) => {
    try {
      await pairingActions.handleSubmit(riderId, pairingData);
    } catch (err) {
      handleError(err);
      throw err;
    }
  };

  const handlePairingRemove = async () => {
    try {
      await pairingActions.handleRemoveFromInventory();
    } catch (err) {
      handleError(err);
    }
  };

  const handlePairingDelete = async () => {
    try {
      await pairingActions.handlePermanentDelete();
    } catch (err) {
      handleError(err);
    }
  };

  // Filter active items
  const activePackages = filterActivePackages(packages);
  const activePairings = filterActivePairings(pairings);
  const activeOwnedHorses = filterActiveHorses(ownedHorses);

  // Loading state
  if (loading) {
    return (
      <Modal isOpen={true} onClose={onClose} size="large">
        <div className="modal-loading">
          <Icons.Loading className="spin" style={{ fontSize: '32px' }} />
          <p>Chargement des informations du cavalier...</p>
        </div>
      </Modal>
    );
  }

  // Error state
  if (!rider) {
    return (
      <Modal isOpen={true} onClose={onClose} size="small">
        <div className="modal-error">
          <Icons.Warning style={{ fontSize: '32px', color: '#dc3545' }} />
          <h3>Cavalier non trouvé</h3>
        </div>
      </Modal>
    );
  }

  return (
    <>
      {/* Main Rider Card Modal */}
      <Modal
        isOpen={true}
        onClose={onClose}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Icons.User />
            {rider.name}
          </div>
        }
        size="large"
      >
        {successMessage && (
          <div className="alert alert-success mb-20">
            <Icons.Check style={{ marginRight: '8px' }} />
            {successMessage}
          </div>
        )}
        {(error || loadError) && (
          <div className="alert alert-error mb-20">
            <Icons.Warning style={{ marginRight: '8px' }} />
            {error || loadError}
          </div>
        )}

        <RiderInfo rider={rider} />
        <OwnedHorsesList horses={activeOwnedHorses} />
        <PackagesList
          packages={activePackages}
          onAdd={packageActions.handleCreate}
          onEdit={packageActions.handleEdit}
        />
        <PairingsList
          pairings={activePairings}
          onAdd={pairingActions.handleCreate}
          onEdit={pairingActions.handleEdit}
          onDelete={pairingActions.handleDeleteClick}
        />
      </Modal>

      {/* Package Form Modal */}
      <Modal
        isOpen={packageActions.showPackageModal}
        onClose={packageActions.closeModal}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {packageActions.editingPackage ? (
              <>
                <Icons.Edit />
                Modifier le forfait
              </>
            ) : (
              <>
                <Icons.Add />
                Nouveau forfait
              </>
            )}
          </div>
        }
        size="medium"
      >
        <PackageForm
          package={packageActions.editingPackage}
          riders={riders}
          riderId={riderId}
          onSubmit={handlePackageSubmit}
          onCancel={packageActions.closeModal}
        />
      </Modal>

      {/* Pairing Form Modal */}
      <Modal
        isOpen={pairingActions.showPairingModal}
        onClose={pairingActions.closeModal}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {pairingActions.editingPairing ? (
              <>
                <Icons.Edit />
                Modifier la pension
              </>
            ) : (
              <>
                <Icons.Add />
                Nouvelle pension
              </>
            )}
          </div>
        }
        size="medium"
      >
        <PairingForm
          pairing={pairingActions.editingPairing}
          riders={riders}
          horses={horses}
          riderId={riderId}
          onSubmit={handlePairingSubmit}
          onCancel={pairingActions.closeModal}
        />
      </Modal>

      {/* Delete Package Modal */}
      <DeleteConfirmationModal
        isOpen={packageActions.showDeleteModal}
        onClose={packageActions.closeDeleteModal}
        onRemoveFromInventory={handlePackageRemove}
        onPermanentDelete={handlePackageDelete}
        itemType="forfait"
      />

      {/* Delete Pairing Modal */}
      <DeleteConfirmationModal
        isOpen={pairingActions.showDeleteModal}
        onClose={pairingActions.closeDeleteModal}
        onRemoveFromInventory={handlePairingRemove}
        onPermanentDelete={handlePairingDelete}
        itemType="pension"
      />
    </>
  );
}

RiderCard.propTypes = {
  riderId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default RiderCard;
