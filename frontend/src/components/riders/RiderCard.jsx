import PropTypes from 'prop-types';
import { useState } from 'react';
import { usePackageActions, usePairingActions, useRiderCard } from '../../hooks/index.js';
import { getRiderTypeLabel } from '../../lib/domain/riders.js';
import { formatDate, isActive } from '../../lib/helpers/index.js';
import { Icons } from '../../lib/icons.jsx';
import DeleteConfirmationModal from '../common/DeleteConfirmationModal.jsx';
import Modal from '../common/Modal.jsx';
import PackageForm from '../packages/PackageForm.jsx';
import PairingForm from '../pairings/PairingForm.jsx';
import { getRiderHorseLinkDescription } from '../../lib/domain/pairings.js';

/**
 * RiderCard - Detailed rider information card
 * Affiche UN SEUL forfait actif (le plus récent)
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
    setError(err?.message || String(err));
    setTimeout(() => setError(null), 5000);
  };

  const packageActions = usePackageActions(handleSuccess);
  const pairingActions = usePairingActions(handleSuccess);

  // Wrapper pour aligner la signature attendue par PackageForm (riderId, packageData)
  const handlePackageSubmit = async (rIdFromForm, packageData) => {
    try {
      // On force l'usage du riderId courant pour éviter incohérences si le form envoie autre chose
      await packageActions.handleSubmit(riderId, packageData);
    } catch (err) {
      handleError(err);
      throw err;
    }
  };

  const handlePairingSubmit = async (rIdFromForm, pairingData) => {
    try {
      await pairingActions.handleSubmit(riderId, pairingData);
    } catch (err) {
      handleError(err);
      throw err;
    }
  };

  // UN SEUL forfait actif
  const activePackage = packages?.find((pkg) => pkg.is_active && !pkg.deleted_at) || null;

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

          <div className="rider-card-grid">
            {/* Left Column */}
            <div className="rider-card-sidebar">
              {/* Contact */}
              <div className="info-card">
                <div className="info-card-header">
                  <h3>Coordonnées</h3>
                </div>
                <div className="info-card-body">
                  <div className="info-item-modern">
                    <div className="info-content">
                      <span className="info-label">Email</span>
                      <span className="info-value">{rider.email || 'Non renseigné'}</span>
                    </div>
                  </div>
                  <div className="info-item-modern">
                    <div className="info-content">
                      <span className="info-label">Téléphone</span>
                      <span className="info-value">{rider.phone || 'Non renseigné'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity */}
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
            </div>

            {/* Right Column */}
            <div className="rider-card-main">
              {/* Package Section */}
              <div className="data-card">
                <div className="data-card-header">
                  <div className="data-card-title">
                    <Icons.Packages />
                    <h3>Forfait</h3>
                    {activePackage && <span className="badge badge-success">Actif</span>}
                  </div>
                  {!activePackage && (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={packageActions.handleCreate}
                      title="Créer un forfait"
                    >
                      <Icons.Add />
                      <span>Créer</span>
                    </button>
                  )}
                </div>
                <div className="data-card-body">
                  {!activePackage ? (
                    <div className="empty-state-inline">
                      <Icons.Packages />
                      <p>Aucun forfait</p>
                    </div>
                  ) : (
                    <div className="package-single-view">
                      <div className="package-item-modern">
                        <div className="package-info">
                          <div className="package-detail">
                            <span className="package-label">Services hebdomadaires</span>
                            <span className="package-value">{activePackage.services_per_week}</span>
                          </div>
                          <div className="package-separator">•</div>
                          <div className="package-detail">
                            <span className="package-label">Cours collectifs</span>
                            <span className="package-value">
                              {activePackage.group_lessons_per_week}
                            </span>
                          </div>
                        </div>
                        <div className="package-actions">
                          <button
                            className="btn-icon-modern"
                            onClick={() => packageActions.handleEdit(activePackage)}
                            title="Modifier"
                          >
                            <Icons.Edit />
                          </button>
                          <button
                            className="btn-icon-modern danger"
                            onClick={() => packageActions.handleDeleteClick(activePackage)}
                            title="Supprimer"
                          >
                            <Icons.Delete />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Pairings Section */}
              <div className="data-card" style={{ marginTop: 16 }}>
                <div className="data-card-header">
                  <div className="data-card-title">
                    <Icons.Horse />
                    <h3>Chevaux</h3>
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
                      <p>Aucun cheval</p>
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
                            <span className="pairing-meta">
                              {getRiderHorseLinkDescription(pairing)}
                            </span>
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
                    Créer un forfait
                  </>
                )}
              </div>
            }
            size="medium"
          >
            <PackageForm
              initialPackage={packageActions.editingPackage}
              riderId={riderId}
              onSubmit={handlePackageSubmit}
              onCancel={packageActions.closeModal}
            />
          </Modal>

          {/* Package Delete Confirmation */}
          <DeleteConfirmationModal
            isOpen={packageActions.showDeleteModal}
            onClose={packageActions.closeDeleteModal}
            onRemoveFromInventory={async () => {
              try {
                await packageActions.handleRemoveFromInventory();
              } catch (err) {
                handleError(err);
              }
            }}
            onPermanentDelete={async () => {
              try {
                await packageActions.handlePermanentDelete();
              } catch (err) {
                handleError(err);
              }
            }}
            itemType="forfait"
          />

          {/* Pairing Modal */}
          <Modal
            isOpen={pairingActions.showPairingModal}
            onClose={pairingActions.closeModal}
            title={
              pairingActions.editingPairing ? (
                <>
                  <Icons.Edit />
                  Modifier la pension
                </>
              ) : (
                <>
                  <Icons.Add />
                  Nouvelle pension
                </>
              )
            }
            size="medium"
          >
            <PairingForm
              pairing={pairingActions.editingPairing}
              riders={riders}
              horses={horses}
              rider={rider}
              riderId={riderId}
              onSubmit={handlePairingSubmit}
              onCancel={pairingActions.closeModal}
            />
          </Modal>

          {/* Pairing Delete Modal */}
          <DeleteConfirmationModal
            isOpen={pairingActions.showDeleteModal}
            onClose={pairingActions.closeDeleteModal}
            onRemoveFromInventory={pairingActions.handleRemoveFromInventory}
            onPermanentDelete={pairingActions.handlePermanentDelete}
            itemType="pension"
          />
        </div>
      </Modal>
    </>
  );
}

RiderCard.propTypes = {
  riderId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default RiderCard;
