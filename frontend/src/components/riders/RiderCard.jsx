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
 * RiderCard - Detailed rider information card (Version modernisée)
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

  const isRiderActive = isActive(rider.activity_start_date, rider.activity_end_date);

  return (
    <>
      <Modal
        isOpen={true}
        onClose={onClose}
        title={
          <div className="rider-card-title">
            <div className="rider-card-avatar">
              <Icons.User />
            </div>
            <div className="rider-card-title-text">
              <h2>{rider.name}</h2>
              <div className="rider-card-meta">
                <span className="badge badge-rider-type" data-rider-type={rider.rider_type}>
                  {getRiderTypeLabel(rider.rider_type)}
                </span>
                <span className={`badge ${isRiderActive ? 'badge-success' : 'badge-secondary'}`}>
                  {isRiderActive ? 'Actif' : 'Inactif'}
                </span>
              </div>
            </div>
          </div>
        }
        size="xlarge"
      >
        <div className="rider-card-content">
          {/* Messages */}
          {successMessage && (
            <div className="alert alert-success">
              <Icons.Check />
              <span>{successMessage}</span>
            </div>
          )}
          {(error || loadError) && (
            <div className="alert alert-error">
              <Icons.Warning />
              <span>{error || loadError}</span>
            </div>
          )}

          {/* Main Content Grid */}
          <div className="rider-card-grid">
            {/* Left Column - Contact & Info */}
            <div className="rider-card-sidebar">
              {/* Contact Card */}
              <div className="info-card">
                <div className="info-card-header">
                  <h3>Coordonnées</h3>
                </div>
                <div className="info-card-body">
                  <div className="info-item-modern">
                    <div className="info-icon"></div>
                    <div className="info-content">
                      <span className="info-label">Email</span>
                      <span className="info-value">{rider.email || 'Non renseigné'}</span>
                    </div>
                  </div>
                  <div className="info-item-modern">
                    <div className="info-icon"></div>
                    <div className="info-content">
                      <span className="info-label">Téléphone</span>
                      <span className="info-value">{rider.phone || 'Non renseigné'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Period Card */}
              <div className="info-card">
                <div className="info-card-header">
                  <h3>Période d'activité</h3>
                </div>
                <div className="info-card-body">
                  <div className="info-item-modern">
                    <div className="info-icon success">
                      <Icons.Check />
                    </div>
                    <div className="info-content">
                      <span className="info-label">Date de début</span>
                      <span className="info-value">
                        {rider.activity_start_date
                          ? formatDate(rider.activity_start_date)
                          : 'Non définie'}
                      </span>
                    </div>
                  </div>
                  {rider.activity_end_date && (
                    <div className="info-item-modern">
                      <div className="info-icon warning">
                        <Icons.Warning />
                      </div>
                      <div className="info-content">
                        <span className="info-label">Date de fin</span>
                        <span className="info-value">{formatDate(rider.activity_end_date)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Stats Card */}
              <div className="stats-card">
                <div className="stat-item">
                  <div className="stat-icon packages">
                    <Icons.Packages />
                  </div>
                  <div className="stat-content">
                    <span className="stat-value">{activePackages.length}</span>
                    <span className="stat-label">Forfaits actifs</span>
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon pairings">
                    <Icons.Horse />
                  </div>
                  <div className="stat-content">
                    <span className="stat-value">{activePairings.length}</span>
                    <span className="stat-label">Pensions actives</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Packages & Pairings */}
            <div className="rider-card-main">
              {/* Packages Section */}
              <div className="data-card">
                <div className="data-card-header">
                  <div className="data-card-title">
                    <Icons.Packages />
                    <h3>Forfaits</h3>
                    <span className="count-badge">{activePackages.length}</span>
                  </div>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={packageActions.handleCreate}
                    title="Ajouter un forfait"
                  >
                    <Icons.Add />
                    <span>Nouveau</span>
                  </button>
                </div>
                <div className="data-card-body">
                  {activePackages.length === 0 ? (
                    <div className="empty-state-inline">
                      <Icons.Packages />
                      <p>Aucun forfait actif</p>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={packageActions.handleCreate}
                      >
                        <Icons.Add />
                        <span>Créer un forfait</span>
                      </button>
                    </div>
                  ) : (
                    <div className="packages-list-modern">
                      {activePackages.map((pkg) => (
                        <div key={pkg.id} className="package-item-modern">
                          <div className="package-info">
                            <div className="package-detail">
                              <span className="package-label">Services hebdomadaires</span>
                              <span className="package-value">{pkg.services_per_week}</span>
                            </div>
                            <div className="package-separator">•</div>
                            <div className="package-detail">
                              <span className="package-label">Cours collectifs</span>
                              <span className="package-value">{pkg.group_lessons_per_week}</span>
                            </div>
                          </div>
                          <button
                            className="btn-icon-modern"
                            onClick={() => packageActions.handleEdit(pkg)}
                            title="Modifier"
                          >
                            <Icons.Edit />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Pairings Section */}
              <div className="data-card">
                <div className="data-card-header">
                  <div className="data-card-title">
                    <Icons.Horse />
                    <h3>Pensions</h3>
                    <span className="count-badge">{activePairings.length}</span>
                  </div>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={pairingActions.handleCreate}
                    title="Ajouter une pension"
                  >
                    <Icons.Add />
                    <span>Nouveau</span>
                  </button>
                </div>
                <div className="data-card-body">
                  {activePairings.length === 0 ? (
                    <div className="empty-state-inline">
                      <Icons.Horse />
                      <p>Aucune pension active</p>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={pairingActions.handleCreate}
                      >
                        <Icons.Add />
                        <span>Créer une pension</span>
                      </button>
                    </div>
                  ) : (
                    <div className="pairings-list-modern">
                      {activePairings.map((pairing) => (
                        <div key={pairing.id} className="pairing-item-modern">
                          <div className="pairing-icon">
                            <Icons.Horse />
                          </div>
                          <div className="pairing-info">
                            <span className="pairing-horse-name">
                              {pairing.horses?.name || 'N/A'}
                            </span>
                            <span className="pairing-meta">Pension active</span>
                          </div>
                          <div className="pairing-actions">
                            <button
                              className="btn-icon-modern"
                              onClick={() => pairingActions.handleEdit(pairing)}
                              title="Modifier"
                            >
                              <Icons.Edit />
                            </button>
                            <button
                              className="btn-icon-modern danger"
                              onClick={() => pairingActions.handleDeleteClick(pairing)}
                              title="Supprimer"
                            >
                              <Icons.Delete />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
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
