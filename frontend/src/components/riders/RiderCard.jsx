import PropTypes from 'prop-types';
import { useState } from 'react';
import { usePackageActions, usePairingActions, useRiderDetails } from '../../hooks/index.js';
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
import { useAppMode } from '../../context/AppMode.jsx';

function RiderCard({ riderId, onClose, onEdit, onDelete, onSuccess }) {
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const { mode } = useAppMode();

  // --- Hook: load single rider details ---
  const { rider, activePackage, activePairings, horses, loading, error, reload } =
    useRiderDetails(riderId);

  // --- Handlers for messages ---
  const handleSuccess = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 3000);
    reload();
    onSuccess();
  };
  const handleError = (err) => {
    setErrorMessage(err?.message || String(err));
    setTimeout(() => setErrorMessage(null), 5000);
  };

  // --- Package & Pairing action hooks ---
  const packageActions = usePackageActions(handleSuccess);
  const pairingActions = usePairingActions(handleSuccess);

  const handlePackageSubmit = async (_riderId, packageData) => {
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

  // --- Loading fallback ---
  if (loading) {
    return (
      <Modal isOpen onClose={onClose} size="lg">
        <div className="loading">
          <Icons.Loading className="spin" />
          <p>Chargement...</p>
        </div>
      </Modal>
    );
  }

  // --- Error fallback ---
  if (error) {
    return (
      <Modal isOpen onClose={onClose} size="sm">
        <div className="error">
          <div className="error-icon">
            <Icons.Warning />
          </div>
          <h3>Cavalier non trouvé</h3>
          <p>{error}</p>
        </div>
      </Modal>
    );
  }

  const isRiderActive = isActive(rider.activity_start_date, rider.activity_end_date);
  const riderTypeConfig = getRiderTypeConfig(rider.rider_type);
  const statusConfig = getStatusConfig(isRiderActive ? 'active' : 'inactive');

  return (
    <Modal
      isOpen
      onClose={onClose}
      size="xl"
      title={
        <div className="modal-header">
          <div className="info-card-avatar">
            <Icons.User />
          </div>
          <div className="modal-header-text">
            <h2>{rider.name}</h2>
            <div className="detail-card-meta">
              {riderTypeConfig && <DomainBadge config={riderTypeConfig} />}
              {statusConfig && <DomainBadge config={statusConfig} />}
            </div>
          </div>
          <div className="header-actions-group">
            <button
              className="btn-icon-modern"
              type="button"
              onClick={() => onEdit(rider)}
              title="Modifier"
            >
              <Icons.Edit />
            </button>
            {mode === 'admin' && (
              <button
                type="button"
                className="btn-icon-modern danger"
                onClick={() => onDelete(rider)}
                title="Supprimer"
              >
                <Icons.Delete />
              </button>
            )}
          </div>
        </div>
      }
    >
      <div className="modal-content-scrollable">
        {successMessage && (
          <div className="alert alert-success">
            <Icons.Check /> <span>{successMessage}</span>
          </div>
        )}
        {errorMessage && (
          <div className="alert alert-error">
            <Icons.Warning /> <span>{errorMessage}</span>
          </div>
        )}

        <div className="layout-grid-content">
          {/* Left Sidebar */}
          <div className="layout-sidebar-content">
            <div className="info-card">
              <div className="info-card-header">
                <h3>Coordonnées</h3>
              </div>
              <div className="info-card-body">
                <div className="info-item-modern">
                  <div className="info-content">
                    <span className="info-label">Email</span>
                    <span className="info-value">{rider.email || '-'}</span>
                  </div>
                </div>
                <div className="info-item-modern">
                  <div className="info-content">
                    <span className="info-label">Téléphone</span>
                    <span className="info-value">{rider.phone || '-'}</span>
                  </div>
                </div>
              </div>
            </div>

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
                    <span className="info-label">Début</span>
                    <span className="info-value">
                      {rider.activity_start_date ? formatDate(rider.activity_start_date) : '-'}
                    </span>
                  </div>
                </div>
                {rider.activity_end_date ? (
                  <div className="info-item-modern">
                    <div className="info-icon info-icon-warning">
                      <Icons.Warning />
                    </div>
                    <div className="info-content">
                      <span className="info-label">Fin</span>
                      <span className="info-value">{formatDate(rider.activity_end_date)}</span>
                    </div>
                  </div>
                ) : (
                  <div className="info-item-modern">
                    <div className="info-content">
                      <span className="info-label">En activité</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="layout-main-content">
            {/* Package */}
            <div className="info-card">
              <div className="info-card-header">
                <div className="info-card-title">
                  <h3>Forfait</h3>
                  {activePackage && <DomainBadge config={getStatusConfig('active')} />}
                </div>

                {!activePackage ? (
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={packageActions.handleCreate}
                  >
                    <Icons.Add /> Créer
                  </button>
                ) : (
                  <div className="header-actions-group">
                    <button
                      type="button"
                      className="btn-icon-modern"
                      onClick={() => packageActions.handleEdit(activePackage)}
                      title="Modifier"
                    >
                      <Icons.Edit />
                    </button>
                    <button
                      type="button"
                      className="btn-icon-modern danger"
                      onClick={() => packageActions.handleDeleteClick(activePackage)}
                      title="Supprimer"
                    >
                      <Icons.Delete />
                    </button>
                  </div>
                )}
              </div>
              <div className="info-card-body">
                {!activePackage ? (
                  <div className="empty-state-small">
                    <Icons.Packages />
                    <p>Aucun forfait</p>
                  </div>
                ) : (
                  <div className="detail-card-body">
                    <div className="package-item">
                      <span className="package-label">Services hebdomadaires</span>
                      <span className="package-value">{activePackage.services_per_week}</span>
                    </div>
                    <div className="package-item">
                      <span className="package-label">Cours collectifs</span>
                      <span className="package-value">
                        {activePackage.private_lessons_per_week}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Pairings */}
            <div className="data-card">
              <div className="data-card-header">
                <div className="data-card-title">
                  <Icons.Horse />
                  <h3>Chevaux</h3>
                  <span className="count-badge">{activePairings.length}</span>
                </div>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={pairingActions.handleCreate}
                >
                  <Icons.Add /> Nouveau
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
                    {activePairings.map((p) => {
                      const linkConfig = getRiderHorseLinkConfig(p.link_type);
                      const loanDays = p.loan_days || [];
                      return (
                        <div key={p.id} className="pairing-row">
                          <div className="pairing-info">
                            <div className="pairing-header">
                              <span>{p.horses?.name || 'N/A'}</span>
                              {linkConfig && <DomainBadge config={linkConfig} />}
                            </div>
                            {p.link_type === 'loan' && (
                              <div className="pairing-days">
                                {WEEK_DAYS_EN.map((dayEn, i) => (
                                  <span
                                    key={dayEn}
                                    className={`day-badge ${
                                      loanDays.includes(dayEn) ? 'active' : 'inactive'
                                    }`}
                                    title={
                                      loanDays.includes(dayEn)
                                        ? 'Jour de pension'
                                        : 'Pas de pension'
                                    }
                                  >
                                    {WEEK_DAYS[i]}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="pairing-actions">
                            <button
                              type="button"
                              className="btn-icon-modern"
                              onClick={() => pairingActions.handleEdit(p)}
                              title="Modifier"
                            >
                              <Icons.Edit />
                            </button>
                            <button
                              type="button"
                              className="btn-icon-modern danger"
                              onClick={() => pairingActions.handleDeleteClick(p)}
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

        {/* Modals */}
        <Modal
          isOpen={packageActions.showPackageModal}
          onClose={packageActions.closeModal}
          size="md"
        >
          <PackageForm
            initialPackage={packageActions.editingPackage}
            riderId={riderId}
            onSubmit={handlePackageSubmit}
            onCancel={packageActions.closeModal}
          />
        </Modal>

        <DeleteConfirmationModal
          isOpen={packageActions.showDeleteModal}
          allowSoftDelete={false}
          onClose={packageActions.closeDeleteModal}
          onPermanentDelete={packageActions.handlePermanentDelete}
          itemType="package"
        />

        <Modal
          isOpen={pairingActions.showPairingModal}
          onClose={pairingActions.closeModal}
          size="md"
        >
          <PairingForm
            pairing={pairingActions.editingPairing}
            riderId={riderId}
            excludedHorses={horses}
            onSubmit={handlePairingSubmit}
            onCancel={pairingActions.closeModal}
          />
        </Modal>

        <DeleteConfirmationModal
          isOpen={pairingActions.showDeleteModal}
          onClose={pairingActions.closeDeleteModal}
          onRemoveFromInventory={pairingActions.handleRemoveFromInventory}
          onPermanentDelete={pairingActions.handlePermanentDelete}
          itemType="pairing"
        />
      </div>
    </Modal>
  );
}

RiderCard.propTypes = {
  riderId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onClose: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
};

export default RiderCard;
