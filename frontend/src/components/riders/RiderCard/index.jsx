import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Portal from '../../../utils/Portal';
import { Icons } from '../../../utils/icons';
import PackageForm from '../../packages/PackageForm';
import PairingForm from '../../pairings/PairingForm';
import Modal from '../../common/Modal';
import RiderInfo from './RiderInfo';
import OwnedHorsesList from './OwnedHorsesList';
import PackagesList from './PackagesList';
import PairingsList from './PairingsList';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { useRiderCard } from '../../../hooks/useRiderCard';
import { usePackageActions } from '../../../hooks/usePackageActions';
import { usePairingActions } from '../../../hooks/usePairingActions';
import {
  filterActivePackages,
  filterActivePairings,
  filterActiveHorses,
} from '../../../utils/activityFilters';
import '../../../styles/common/modal.css';
import '../../../styles/common/alerts.css';
import '../../../styles/common/buttons.css';
import './RiderCard.css';

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
      <Portal>
        <div className="modal-overlay">
          <div className="modal rider-card-modal">
            <div className="loading">
              <Icons.Loading className="spin" style={{ marginRight: '8px' }} />
              Chargement des informations du cavalier...
            </div>
          </div>
        </div>
      </Portal>
    );
  }

  // Error state
  if (!rider) {
    return (
      <Portal>
        <div className="modal-overlay" onClick={onClose}>
          <div className="modal rider-card-modal">
            <div className="error">
              <Icons.Warning style={{ marginRight: '8px' }} />
              Cavalier non trouvé
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
          <div className="modal-header">
            <h2>
              <Icons.User style={{ marginRight: '8px' }} />
              {rider.name}
            </h2>
            <button className="modal-close" onClick={onClose}>
              <Icons.Close />
            </button>
          </div>

          <div className="modal-body rider-card-content">
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
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              <Icons.Close style={{ marginRight: '8px' }} />
              Fermer
            </button>
          </div>
        </div>

        {/* Package Form Modal */}
        {packageActions.showPackageModal && (
          <div
            className="modal-overlay"
            onClick={packageActions.closeModal}
            style={{ zIndex: 1001 }}
          >
            <div
              className="modal"
              onClick={(e) => e.stopPropagation()}
              style={{ maxHeight: '90vh', overflowY: 'auto' }}
            >
              <div className="modal-header">
                <h3>
                  {packageActions.editingPackage ? (
                    <>
                      <Icons.Edit style={{ marginRight: '8px' }} />
                      Modifier le forfait
                    </>
                  ) : (
                    <>
                      <Icons.Add style={{ marginRight: '8px' }} />
                      Nouveau forfait
                    </>
                  )}
                </h3>
                <button className="modal-close" onClick={packageActions.closeModal}>
                  <Icons.Close />
                </button>
              </div>
              <PackageForm
                package={packageActions.editingPackage}
                riders={riders}
                riderId={riderId}
                onSubmit={handlePackageSubmit}
                onCancel={packageActions.closeModal}
              />
            </div>
          </div>
        )}

        {/* Pairing Form Modal */}
        {pairingActions.showPairingModal && (
          <div
            className="modal-overlay"
            onClick={pairingActions.closeModal}
            style={{ zIndex: 1001 }}
          >
            <div
              className="modal"
              onClick={(e) => e.stopPropagation()}
              style={{ maxHeight: '90vh', overflowY: 'auto' }}
            >
              <div className="modal-header">
                <h3>
                  {pairingActions.editingPairing ? (
                    <>
                      <Icons.Edit style={{ marginRight: '8px' }} />
                      Modifier la pension
                    </>
                  ) : (
                    <>
                      <Icons.Add style={{ marginRight: '8px' }} />
                      Nouvelle pension
                    </>
                  )}
                </h3>
                <button className="modal-close" onClick={pairingActions.closeModal}>
                  <Icons.Close />
                </button>
              </div>
              <PairingForm
                pairing={pairingActions.editingPairing}
                riders={riders}
                horses={horses}
                riderId={riderId}
                onSubmit={handlePairingSubmit}
                onCancel={pairingActions.closeModal}
              />
            </div>
          </div>
        )}

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
      </div>
    </Portal>
  );
}

RiderCard.propTypes = {
  riderId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default RiderCard;