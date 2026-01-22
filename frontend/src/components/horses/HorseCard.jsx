import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useHorseCard } from '../../hooks/index.js';
import { riderService } from '../../services/index.js';
import {
  getHorseTypeConfig,
  getOwnerTypeConfig,
  getStatusConfig,
  getRiderHorseLinkConfig,
  WEEK_DAYS,
  WEEK_DAYS_EN,
  getLoanDays,
} from '../../lib/domain/domain-constants.js';
import { isActive, formatDate } from '../../lib/helpers/index.js';
import { Icons } from '../../lib/icons.jsx';
import DomainBadge from '../common/DomainBadge.jsx';
import DeleteConfirmationModal from '../common/DeleteConfirmationModal.jsx';
import Modal from '../common/Modal.jsx';
import PairingForm from '../pairings/PairingForm.jsx';
import '../../styles/features/horses.css';

/**
 * HorseCard - Detailed horse information card (RiderCard style)
 */
function HorseCard({ horse: initialHorse, onClose, onEdit, onDelete }) {
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [riders, setRiders] = useState([]);
  const [loadingRiders, setLoadingRiders] = useState(false);

  const {
    horse: fetchedHorse,
    loading,
    error: loadError,
    reload,
    // Pairing modal state
    showPairingModal,
    editingPairing,
    showDeletePairingModal,
    pairingToDelete,
    // Pairing actions
    handleCreatePairing,
    handleEditPairing,
    handleDeletePairingClick,
    handlePairingSubmit,
    handleDeletePairing,
    closePairingModal,
    closeDeletePairingModal,
  } = useHorseCard(initialHorse?.id);

  const horse = fetchedHorse || initialHorse;

  // Load riders for the pairing form
  useEffect(() => {
    const loadRiders = async () => {
      try {
        setLoadingRiders(true);
        const data = await riderService.getAll();
        setRiders(data || []);
      } catch (err) {
        console.error('Error loading riders:', err);
      } finally {
        setLoadingRiders(false);
      }
    };

    if (showPairingModal) {
      loadRiders();
    }
  }, [showPairingModal]);

  function handleSuccess(message) {
    setSuccessMessage(message);
    setErrorMessage('');
    setTimeout(() => setSuccessMessage(''), 3000);
  }

  function handleError(err) {
    setErrorMessage(err?.message || 'Une erreur est survenue');
    setTimeout(() => setErrorMessage(''), 5000);
  }

  const handlePairingFormSubmit = async (pairingData) => {
    try {
      setErrorMessage('');
      await handlePairingSubmit(pairingData);
      handleSuccess(
        editingPairing?.id ? 'Pension modifiée avec succès' : 'Pension créée avec succès'
      );
    } catch (err) {
      handleError(err);
      throw err;
    }
  };

  const handlePairingDelete = async () => {
    try {
      setErrorMessage('');
      await handleDeletePairing();
      handleSuccess('Pension supprimée avec succès');
    } catch (err) {
      handleError(err);
    }
  };

  if (loading && !initialHorse) {
    return (
      <Modal isOpen={true} onClose={onClose} size="large">
        <div className="modal-loading">
          <Icons.Loading className="spin" />
          <p>Chargement...</p>
        </div>
      </Modal>
    );
  }

  if (!horse) {
    return (
      <Modal isOpen={true} onClose={onClose} size="small">
        <div className="modal-error">
          <Icons.Warning />
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
        size="xlarge"
        title={
          <div className="horse-card-title">
            <div className="horse-card-avatar">
              <Icons.Horse />
            </div>

            <div className="horse-card-title-text">
              <h2>{horse.name}</h2>
              <div className="horse-card-meta">
                {horseTypeConfig && <DomainBadge config={horseTypeConfig} />}
                {statusConfig && <DomainBadge config={statusConfig} />}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="horse-card-actions">
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
        <div className="horse-card-content">
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

          <div className="horse-card-grid">
            {/* Left Column */}
            <div className="horse-card-sidebar">
              {/* Owner */}
              <div className="info-card">
                <div className="info-card-header">
                  <h3>Propriétaire</h3>
                </div>
                <div className="info-card-body">
                  <div className="info-item-modern">
                    <div className="info-content">
                      <span className="info-label">Type</span>
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
                      <span className="info-label">Date de début</span>
                      <span className="info-value">
                        {horse.activity_start_date
                          ? formatDate(horse.activity_start_date)
                          : 'Non définie'}
                      </span>
                    </div>
                  </div>
                  {horse.activity_end_date ? (
                    <div className="info-item-modern">
                      <div className="info-icon info-icon-warning">
                        <Icons.Warning />
                      </div>
                      <div className="info-content">
                        <span className="info-label">Date de fin</span>
                        <span className="info-value">{formatDate(horse.activity_end_date)}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="info-item-modern">
                      <div className="info-content">
                        <span className="info-label">en activité</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="horse-card-main">
              {/* Pairings Section */}
              <div className="data-card">
                <div className="data-card-header">
                  <div className="data-card-title">
                    <Icons.User />
                    <h3>Cavaliers</h3>
                    <span className="count-badge">{pairings.length}</span>
                  </div>
                  <button
                    className="btn btn-sm btn-primary"
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
                                <span className="pairing-horse-name">{pairing.rider_name}</span>
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
        >
          {loadingRiders ? (
            <div className="modal-loading">
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
        itemType="pension"
        itemName={pairingToDelete?.rider_name}
        hideRemoveFromInventory={true}
      />
    </>
  );
}

HorseCard.propTypes = {
  horse: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default HorseCard;
