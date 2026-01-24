import PropTypes from 'prop-types';
import { useState } from 'react';
import { usePackageActions, usePairingActions, useRiderCard } from '../../hooks/index.js';
import {
  getRiderTypeConfig,
  getRiderHorseLinkConfig,
  WEEK_DAYS,
  WEEK_DAYS_EN,
} from '../../lib/domain/domain-constants.js';
import { getStatusConfig } from '../../lib/domain/domain-constants.js';
import { formatDate, isActive } from '../../lib/helpers/index.js';
import { Icons } from '../../lib/icons.jsx';
import DomainBadge from '../common/DomainBadge.jsx';
import DeleteConfirmationModal from '../common/DeleteConfirmationModal.jsx';
import Modal from '../common/Modal.jsx';
import PackageForm from '../packages/PackageForm.jsx';
import PairingForm from '../pairings/PairingForm.jsx';
import '../../styles/features/pairings.css';
import '../../styles/features/riders.css';
import { useAppMode } from '../../context/AppMode.jsx';

/**
 * RiderCard - Detailed rider information card
 * Affiche UN SEUL forfait actif (le plus récent)
 */
function RiderCard({ riderId, onClose, onEdit, onDelete }) {
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState(null);
  const mode = useAppMode();

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

  // Nouvelle signature simplifiée - PairingForm envoie directement formData
  const handlePairingSubmit = async (pairingData) => {
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
          <Icons.Loading className="spin" />
          <p>Chargement...</p>
        </div>
      </Modal>
    );
  }

  if (!rider) {
    return (
      <Modal isOpen={true} onClose={onClose} size="small">
        <div className="modal-error">
          <Icons.Warning />
          <h3>Cavalier non trouvé</h3>
        </div>
      </Modal>
    );
  }

  const isRiderActive = isActive(rider.activity_start_date, rider.activity_end_date);
  const riderTypeConfig = getRiderTypeConfig(rider.rider_type);
  const statusConfig = getStatusConfig(isRiderActive ? 'active' : 'inactive');

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
                {riderTypeConfig && <DomainBadge config={riderTypeConfig} />}
                {statusConfig && <DomainBadge config={statusConfig} />}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="rider-card-actions">
              <button
                className="btn-icon-modern"
                onClick={() => onEdit(rider)}
                title="Modifier le cavalier"
              >
                <Icons.Edit />
              </button>
              {mode === 'admin' && (
                <button
                  className="btn-icon-modern danger"
                  onClick={() => onDelete(rider)}
                  title="Supprimer le cavalier"
                >
                  <Icons.Delete />
                </button>
              )}
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
                    <div className="info-icon info-icon-success">
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
                      <div className="info-icon info-icon-warning">
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
                    {activePackage && <DomainBadge config={getStatusConfig('active')} />}
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
                    <div className="empty-state-small">
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
                          <div className="package-separator"> </div>
                          <div className="package-detail">
                            <span className="package-label">Cours collectifs</span>
                            <span className="package-value">
                              {activePackage.group_lessons_per_week}
                            </span>
                          </div>
                        </div>
                        <div className="pairing-actions">
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
                    <div className="empty-state-small">
                      <Icons.Horse />
                      <p>Aucun cheval</p>
                    </div>
                  ) : (
                    <div className="pairings-list-modern">
                      {activePairings.map((pairing) => {
                        const linkConfig = getRiderHorseLinkConfig(pairing.link_type);
                        const loanDays = pairing.loan_days || [];

                        return (
                          <div key={pairing.id} className="pairing-item-modern">
                            <div className="pairing-info">
                              <div className="pairing-header">
                                <span className="pairing-horse-name">
                                  {pairing.horses?.name || 'N/A'}
                                </span>
                                {linkConfig && <DomainBadge config={linkConfig} />}
                              </div>
                              {pairing.link_type === 'loan' && (
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
                        );
                      })}
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
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default RiderCard;
