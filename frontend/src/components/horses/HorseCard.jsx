import PropTypes from 'prop-types';
import { useState } from 'react';
import { useHorseCard } from '../../hooks/useHorseCard.js';
import {
  getHorseTypeConfig,
  getLoanDays,
  getOwnerTypeConfig,
  getRiderHorseLinkConfig,
  getStatusConfig,
  WEEK_DAYS,
  WEEK_DAYS_EN,
} from '../../lib/domain/domain-constants.js';
import { formatDate, isActive } from '../../lib/helpers/index.js';
import { Icons } from '../../lib/icons.jsx';
import DeleteConfirmationModal from '../common/DeleteConfirmationModal.jsx';
import DomainBadge from '../common/DomainBadge.jsx';
import Modal from '../common/Modal.jsx';
import PairingForm from '../pairings/PairingForm.jsx';

/**
 * HorseCard - Detailed horse information card
 */
function HorseCard({ horseId, onClose, onEdit, onDelete, onSuccess }) {
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    fetchedHorse,
    loading,
    loadError,
    reload,
    // Pairing modal state
    showPairingModal,
    editingPairing,
    showDeletePairingModal,
    pairingToDelete,
    // Riders data
    riders,
    loadingRiders,
    // Pairing actions
    handleCreatePairing,
    handleEditPairing,
    handleDeletePairingClick,
    handlePairingSubmit,
    handleDeletePairing,
    closePairingModal,
    closeDeletePairingModal,
  } = useHorseCard(horseId);

  const horse = fetchedHorse;

  // Local success/error handlers for pairing operations
  function handleLocalSuccess(message) {
    setSuccessMessage(message);
    setErrorMessage('');
    setTimeout(() => setSuccessMessage(''), 3000);
    reload();
    onSuccess();
  }

  function handleLocalError(err) {
    setErrorMessage(err?.message || 'Une erreur est survenue');
    setTimeout(() => setErrorMessage(''), 5000);
  }

  const handlePairingFormSubmit = async (pairingData) => {
    try {
      setErrorMessage('');
      await handlePairingSubmit(pairingData);
      handleLocalSuccess(
        editingPairing?.id ? 'Pension modifiée avec succès' : 'Pension créée avec succès'
      );
    } catch (err) {
      handleLocalError(err);
      throw err;
    }
  };

  const handlePairingDelete = async () => {
    try {
      setErrorMessage('');
      await handleDeletePairing();
      handleLocalSuccess('Pension supprimée avec succès');
    } catch (err) {
      handleLocalError(err);
    }
  };

  if (loading) {
    return (
      <Modal isOpen={true} onClose={onClose} size="lg">
        <div className="loading">
          <Icons.Loading className="spin" />
          <p>Chargement...</p>
        </div>
      </Modal>
    );
  }

  if (!horse) {
    return (
      <Modal isOpen={true} onClose={onClose} size="sm">
        <div className="error">
          <div className="error-icon">
            <Icons.Warning />
          </div>
          <h3>Cheval non trouvé</h3>
        </div>
      </Modal>
    );
  }

  const active = isActive(horse.activity_start_date, horse.activity_end_date);
  const loanDays = getLoanDays(horse);
  const pairings = horse.pairings || [];

  const horseTypeConfig = getHorseTypeConfig(horse.kind);
  const statusConfig = getStatusConfig(active ? 'active' : 'inactive');
  const ownerTypeConfig = getOwnerTypeConfig(horse.ownership_type);

  return (
    <>
      <Modal
        isOpen={true}
        onClose={onClose}
        size="xl"
        title={
          <div className="detail-card-title">
            <div className="detail-card-avatar">
              <Icons.Horse />
            </div>

            <div className="detail-card-title-text">
              <h2>{horse.name}</h2>
              <div className="detail-card-meta">
                {horseTypeConfig && <DomainBadge config={horseTypeConfig} />}
                {statusConfig && <DomainBadge config={statusConfig} />}
              </div>
            </div>

            <div className="detail-card-actions">
              <button
                className="btn-icon-modern"
                onClick={() => onEdit(horse)}
                title="Modifier le cheval"
              >
                <Icons.Edit />
              </button>
              <button
                className="btn-icon-modern danger"
                onClick={() => onDelete(horse)}
                title="Supprimer le cheval"
              >
                <Icons.Delete />
              </button>
            </div>
          </div>
        }
      >
        <div className="detail-card-content">
          {/* Messages */}
          {successMessage && (
            <div className="alert alert-success">
              <Icons.Check />
              <span>{successMessage}</span>
            </div>
          )}
          {(errorMessage || loadError) && (
            <div className="alert alert-error">
              <Icons.Warning />
              <span>{errorMessage || loadError}</span>
            </div>
          )}

          <div className="detail-card-grid">
            {/* Left Column */}
            <div className="detail-card-sidebar">
              {/* Owner */}
              <div className="info-card">
                <div className="info-card-header">
                  <h3>Propriétaire</h3>
                </div>
                <div className="info-card-body">
                  <div className="info-item-modern">
                    <div className="info-content">
                      <div className="info-value">
                        {ownerTypeConfig && <DomainBadge config={ownerTypeConfig} />}
                      </div>
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
                      <span className="info-label">Début</span>
                      <span className="info-value">
                        {horse.activity_start_date ? formatDate(horse.activity_start_date) : '-'}
                      </span>
                    </div>
                  </div>
                  {horse.activity_end_date ? (
                    <div className="info-item-modern">
                      <div className="info-icon info-icon-warning">
                        <Icons.Warning />
                      </div>
                      <div className="info-content">
                        <span className="info-label">Fin</span>
                        <span className="info-value">{formatDate(horse.activity_end_date)}</span>
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
            <div className="detail-card-main">
              {/* Pairings Section */}
              <div className="data-card">
                <div className="data-card-header">
                  <div className="data-card-title">
                    <h3>Cavaliers</h3>
                    <span className="count-badge">{pairings.length}</span>
                  </div>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={handleCreatePairing}
                    title="Ajouter une pension"
                  >
                    <Icons.Add />
                    Ajouter
                  </button>
                </div>
                <div className="data-card-body">
                  {pairings.length === 0 ? (
                    <div className="empty-state-small">
                      <Icons.User />
                      <p>Aucune pension</p>
                    </div>
                  ) : (
                    <div className="pairings-list-modern">
                      {pairings.map((pairing) => {
                        const linkConfig = getRiderHorseLinkConfig(pairing.link_type);
                        const isLoan = pairing.link_type === 'loan';
                        const loanDaysPairing = pairing.loan_days || [];

                        return (
                          <div key={pairing.id} className="pairing-item-modern">
                            <div className="pairing-info">
                              <div className="pairing-header">
                                <span>{pairing.rider_name}</span>
                                {linkConfig && <DomainBadge config={linkConfig} />}
                              </div>
                              {isLoan && (
                                <div className="pairing-days">
                                  {WEEK_DAYS_EN.map((dayEn, i) => (
                                    <span
                                      key={dayEn}
                                      className={`day-badge ${
                                        loanDaysPairing.includes(dayEn) ? 'active' : 'inactive'
                                      }`}
                                      title={
                                        loanDaysPairing.includes(dayEn)
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
                                className="btn-icon-modern"
                                onClick={() => handleEditPairing(pairing)}
                                title="Modifier"
                              >
                                <Icons.Edit />
                              </button>
                              <button
                                className="btn-icon-modern danger"
                                onClick={() => handleDeletePairingClick(pairing)}
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
        </div>
      </Modal>

      {/* Pairing Form Modal */}
      {showPairingModal && (
        <Modal
          isOpen={showPairingModal}
          onClose={closePairingModal}
          title={editingPairing?.id ? 'Modifier la pension' : 'Nouvelle pension'}
          size="md"
        >
          {loadingRiders ? (
            <div className="loading">
              <Icons.Loading className="spin" />
              <p>Chargement des cavaliers...</p>
            </div>
          ) : (
            <PairingForm
              pairing={editingPairing}
              riders={riders}
              horse={horse}
              horseId={horse.id}
              onSubmit={handlePairingFormSubmit}
              onCancel={closePairingModal}
            />
          )}
        </Modal>
      )}

      {/* Delete Pairing Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeletePairingModal}
        onClose={closeDeletePairingModal}
        onPermanentDelete={handlePairingDelete}
        itemType="package"
        itemName={pairingToDelete?.rider_name}
        hideRemoveFromInventory={true}
      />
    </>
  );
}

HorseCard.propTypes = {
  horseId: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
};

export default HorseCard;
