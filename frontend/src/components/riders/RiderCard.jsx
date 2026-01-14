import PropTypes from 'prop-types';
import { useState } from 'react';
import { usePackageActions, usePairingActions, useRiderCard } from '../../hooks';
import { getRiderTypeLabel } from '../../lib/domain/riders.js';
import { formatDate, isActive } from '../../lib/helpers/index.js';
import { Icons } from '../../lib/icons.jsx';
import DeleteConfirmationModal from '../common/DeleteConfirmationModal.jsx';
import Modal from '../common/Modal.jsx';
import PackageForm from '../packages/PackageForm';
import PairingForm from '../pairings/PairingForm';

/**
 * RiderCard - Detailed rider information card
 */
function RiderCard({ riderId, onClose }) {
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState(null);

  const {
    rider,
    packages,
    pairings,
    riders,
    horses,
    loading,
    error: loadError,
    reload,
  } = useRiderCard(riderId);

  const handleSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
    reload();
  };

  const handleError = (err) => {
    setError(err.message);
    setTimeout(() => setError(null), 5000);
  };

  const packageActions = usePackageActions(handleSuccess);
  const pairingActions = usePairingActions(handleSuccess);

  const handlePackageSubmit = async (packageData) => {
    try {
      await packageActions.handleSubmit(riderId, packageData);
    } catch (err) {
      handleError(err);
      throw err;
    }
  };

  const handlePairingSubmit = async (pairingData) => {
    try {
      await pairingActions.handleSubmit(riderId, pairingData);
    } catch (err) {
      handleError(err);
      throw err;
    }
  };

  const activePackages =
    packages?.filter((pkg) => isActive(pkg.activity_start_date, pkg.activity_end_date)) || [];

  const activePairings =
    pairings?.filter((pairing) => isActive(pairing.pairing_start_date, pairing.pairing_end_date)) ||
    [];

  if (loading) {
    return (
      <Modal isOpen={true} onClose={onClose} size="large">
        <div className="modal-loading">
          <Icons.Loading className="spin" style={{ fontSize: '32px' }} />
          <p>Chargement...</p>
        </div>
      </Modal>
    );
  }

  if (!rider) {
    return (
      <Modal isOpen={true} onClose={onClose} size="small">
        <div className="modal-error">
          <Icons.Warning style={{ fontSize: '32px', color: 'var(--color-danger)' }} />
          <h3>Cavalier non trouvé</h3>
        </div>
      </Modal>
    );
  }

  return (
    <>
      <Modal
        isOpen={true}
        onClose={onClose}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Icons.User />
            {rider.name}
            <span className="badge badge-rider-type" data-rider-type={rider.rider_type}>
              {getRiderTypeLabel(rider.rider_type)}
            </span>
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

        {/* Rider Info */}
        <div className="section mb-20">
          <h3 className="mb-15">
            <Icons.Info style={{ marginRight: '8px' }} />
            Informations
          </h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">{rider.email || '-'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Téléphone:</span>
              <span className="info-value">{rider.phone || '-'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Type:</span>
              <span className="badge badge-rider-type" data-rider-type={rider.rider_type}>
                {getRiderTypeLabel(rider.rider_type)}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Début:</span>
              <span className="info-value">
                {rider.activity_start_date ? formatDate(rider.activity_start_date) : '-'}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Fin:</span>
              <span className="info-value">
                {rider.activity_end_date ? formatDate(rider.activity_end_date) : '-'}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Statut:</span>
              <span
                className={`badge ${
                  isActive(rider.activity_start_date, rider.activity_end_date)
                    ? 'badge-success'
                    : 'badge-secondary'
                }`}
              >
                {isActive(rider.activity_start_date, rider.activity_end_date) ? 'Actif' : 'Inactif'}
              </span>
            </div>
          </div>
        </div>

        {/* Packages */}
        <div className="section mb-20">
          <div className="flex-between mb-15">
            <h3>
              <Icons.Packages style={{ marginRight: '8px' }} />
              Forfaits ({activePackages.length})
            </h3>
            <button className="btn btn-sm btn-primary" onClick={packageActions.handleCreate}>
              <Icons.Add />
            </button>
          </div>
          {activePackages.length === 0 ? (
            <p className="empty-message">Aucun forfait actif</p>
          ) : (
            <ul className="list-simple">
              {activePackages.map((pkg) => (
                <li key={pkg.id}>
                  Services: {pkg.services_per_week} | Cours: {pkg.group_lessons_per_week}
                  <button
                    className="btn btn-sm btn-secondary ml-10"
                    onClick={() => packageActions.handleEdit(pkg)}
                  >
                    <Icons.Edit />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Pairings */}
        <div className="section">
          <div className="flex-between mb-15">
            <h3>
              <Icons.Horse style={{ marginRight: '8px' }} />
              Pensions ({activePairings.length})
            </h3>
            <button className="btn btn-sm btn-primary" onClick={pairingActions.handleCreate}>
              <Icons.Add />
            </button>
          </div>
          {activePairings.length === 0 ? (
            <p className="empty-message">Aucune pension active</p>
          ) : (
            <ul className="list-simple">
              {activePairings.map((pairing) => (
                <li key={pairing.id}>
                  {pairing.horses?.name || 'N/A'}
                  <button
                    className="btn btn-sm btn-secondary ml-10"
                    onClick={() => pairingActions.handleEdit(pairing)}
                  >
                    <Icons.Edit />
                  </button>
                  <button
                    className="btn btn-sm btn-danger ml-5"
                    onClick={() => pairingActions.handleDeleteClick(pairing)}
                  >
                    <Icons.Delete />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Modal>

      {/* Package Modal */}
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

      {/* Pairing Modal */}
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

      {/* Delete Modals */}
      <DeleteConfirmationModal
        isOpen={packageActions.showDeleteModal}
        onClose={packageActions.closeDeleteModal}
        onRemoveFromInventory={packageActions.handleRemoveFromInventory}
        onPermanentDelete={packageActions.handlePermanentDelete}
        itemType="forfait"
      />

      <DeleteConfirmationModal
        isOpen={pairingActions.showDeleteModal}
        onClose={pairingActions.closeDeleteModal}
        onRemoveFromInventory={pairingActions.handleRemoveFromInventory}
        onPermanentDelete={pairingActions.handlePermanentDelete}
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
