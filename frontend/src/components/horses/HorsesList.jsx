import { useState } from 'react';
import { useHorseActions, useHorseRiders } from '../../hooks';
import { useHorsesList } from '../../hooks/useHorsesList.js';
import { Icons } from '../../lib/icons.jsx';
import {
  getHorseTypeConfig,
  getOwnerTypeConfig,
  WEEK_DAYS_EN,
  weekDayCodeToFr,
  getLoanDays,
} from '../../lib/domain/domain-constants.js';
import DomainBadge from '../common/DomainBadge.jsx';
import DeleteConfirmationModal from '../common/DeleteConfirmationModal.jsx';
import Modal from '../common/Modal.jsx';
import HorseForm from './HorseForm.jsx';
import HorseCard from './HorseCard.jsx';
import RidersModal from './RidersModal.jsx';
import {
  HORSE_KIND_FILTERS,
  OWNERSHIP_TYPE_FILTERS,
} from '../../lib/helpers/filters/activityFilters.js';
import '../../styles/features/horses/horses-list.css';
import { useAppMode } from '../../context/AppMode.jsx';

function HorsesList() {
  const { mode } = useAppMode();
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    horses,
    filteredHorses,
    stats,
    loading,
    error,
    includeInactive,
    kindFilter,
    ownershipFilter,
    setKindFilter,
    setOwnershipFilter,
    toggleIncludeInactive,
    reload,
    clearError,
  } = useHorsesList();

  const horseActions = useHorseActions(handleSuccess);
  const ridersModal = useHorseRiders();

  function handleSuccess(message) {
    setSuccessMessage(message);
    setErrorMessage('');
    setTimeout(() => setSuccessMessage(''), 3000);
    reload();
  }

  function handleError(err) {
    setErrorMessage(err?.message || 'Une erreur est survenue');
    setTimeout(() => setErrorMessage(''), 5000);
  }

  const handleFormSubmit = async (horseData) => {
    try {
      setErrorMessage('');
      await horseActions.handleSubmit(horseData);
    } catch (err) {
      handleError(err);
      throw err;
    }
  };

  const handleRidersClick = async (horse, e) => {
    e.stopPropagation();
    try {
      setErrorMessage('');
      await ridersModal.handleRidersClick(horse);
    } catch (err) {
      handleError(err);
    }
  };

  const handleRowClick = (horse, e) => {
    if (mode !== 'admin') return;
    if (e.target.closest('.count-badge-interactive')) return;
    horseActions.openHorseCard(horse);
  };

  const renderLoanDays = (horse) => {
    const loanDays = getLoanDays(horse);
    return (
      <div className="days-cell">
        {WEEK_DAYS_EN.map((dayCode) => (
          <span
            key={dayCode}
            className={`day-badge ${loanDays.includes(dayCode) ? 'active' : 'inactive'}`}
            title={loanDays.includes(dayCode) ? 'Jour de pension' : 'Pas de pension'}
          >
            {weekDayCodeToFr(dayCode)}
          </span>
        ))}
      </div>
    );
  };

  const displayError = errorMessage || error;

  if (loading) {
    return (
      <div className="loading">
        <Icons.Loading className="spin" /> Chargement des chevaux...
      </div>
    );
  }

  return (
    <div className="card">
      {/* Header */}
      <div className="list-header">
        <h2>Liste des Chevaux</h2>
        {mode === 'admin' && (
          <div className="list-header-actions">
            <button
              className={`btn ${includeInactive ? 'btn-secondary' : 'btn-outline-secondary'}`}
              onClick={toggleIncludeInactive}
            >
              <Icons.Filter />
              {includeInactive
                ? `Inactifs inclus (${stats.inactive})`
                : `Afficher inactifs (${stats.inactive})`}
            </button>
            <button className="btn btn-primary" onClick={horseActions.handleCreate}>
              <Icons.Add /> Nouveau Cheval
            </button>
          </div>
        )}
      </div>

      {/* Filters */}
      {horses.length > 0 && (
        <div className="list-filters">
          <div className="filter-pills">
            <button
              className={`pill ${kindFilter === HORSE_KIND_FILTERS.ALL ? 'pill-active' : ''}`}
              onClick={() => setKindFilter(HORSE_KIND_FILTERS.ALL)}
            >
              Tous
            </button>
            <button
              className={`pill ${kindFilter === HORSE_KIND_FILTERS.HORSE ? 'pill-active' : ''}`}
              onClick={() => setKindFilter(HORSE_KIND_FILTERS.HORSE)}
            >
              Chevaux ({stats.horse})
            </button>
            <button
              className={`pill ${kindFilter === HORSE_KIND_FILTERS.PONY ? 'pill-active' : ''}`}
              onClick={() => setKindFilter(HORSE_KIND_FILTERS.PONY)}
            >
              Poneys ({stats.pony})
            </button>
          </div>
          {mode === 'admin' && (
            <div className="filter-pills">
              <button
                className={`pill ${
                  ownershipFilter === OWNERSHIP_TYPE_FILTERS.ALL ? 'pill-active' : ''
                }`}
                onClick={() => setOwnershipFilter(OWNERSHIP_TYPE_FILTERS.ALL)}
              >
                Tous propriétaires
              </button>
              <button
                className={`pill ${
                  ownershipFilter === OWNERSHIP_TYPE_FILTERS.LAURY ? 'pill-active' : ''
                }`}
                onClick={() => setOwnershipFilter(OWNERSHIP_TYPE_FILTERS.LAURY)}
              >
                Laury ({stats.laury})
              </button>
              <button
                className={`pill ${
                  ownershipFilter === OWNERSHIP_TYPE_FILTERS.PRIVATE_OWNER ? 'pill-active' : ''
                }`}
                onClick={() => setOwnershipFilter(OWNERSHIP_TYPE_FILTERS.PRIVATE_OWNER)}
              >
                Propriétaires ({stats.private_owner})
              </button>
              <button
                className={`pill ${
                  ownershipFilter === OWNERSHIP_TYPE_FILTERS.CLUB ? 'pill-active' : ''
                }`}
                onClick={() => setOwnershipFilter(OWNERSHIP_TYPE_FILTERS.CLUB)}
              >
                Club ({stats.club})
              </button>
            </div>
          )}
        </div>
      )}

      {/* Messages */}
      <div className="list-messages">
        {displayError && (
          <div className="alert alert-error">
            <Icons.Warning /> {displayError}
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => {
                setErrorMessage('');
                clearError();
              }}
            >
              Effacer
            </button>
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success">
            <Icons.Check /> {successMessage}
            <button className="btn btn-sm btn-secondary" onClick={() => setSuccessMessage('')}>
              OK
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      {horses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Icons.Horse />
          </div>
          <p>Aucun cheval trouvé</p>
        </div>
      ) : filteredHorses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Icons.Filter />
          </div>
          <p>Aucun cheval ne correspond au filtre</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Type</th>
                {mode === 'admin' && (
                  <>
                    <th>Propriétaire</th>
                    <th>Cavaliers actifs</th>
                  </>
                )}
                <th>Jours de pension</th>
                <th> </th>
              </tr>
            </thead>
            <tbody>
              {filteredHorses.map((horse) => {
                const horseTypeConfig = getHorseTypeConfig(horse.kind);
                const ownerTypeConfig = getOwnerTypeConfig(horse.ownership_type);

                return (
                  <tr
                    key={horse.id}
                    onClick={(e) => handleRowClick(horse, e)}
                    className="row-clickable"
                  >
                    <td>
                      <strong>{horse.name}</strong>
                    </td>
                    <td>{horseTypeConfig && <DomainBadge config={horseTypeConfig} />}</td>
                    {mode === 'admin' && (
                      <>
                        <td>{ownerTypeConfig && <DomainBadge config={ownerTypeConfig} />}</td>
                        <td>
                          <span
                            className={`count-badge-interactive ${
                              horse.active_riders_count > 0 ? 'clickable' : ''
                            }`}
                            onClick={(e) =>
                              horse.active_riders_count > 0 && handleRidersClick(horse, e)
                            }
                          >
                            <Icons.Users /> {horse.active_riders_count || 0}
                          </span>
                        </td>
                      </>
                    )}
                    <td>{renderLoanDays(horse)}</td>
                    {mode === 'admin' && (
                      <td className="table-actions">
                        <button
                          className="btn-icon-modern"
                          onClick={(e) => handleRowClick(horse, e)}
                          title="Voir les détails"
                        >
                          <Icons.View />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      <Modal
        isOpen={horseActions.showModal}
        onClose={horseActions.closeModal}
        title={horseActions.editingHorse ? 'Modifier le cheval' : 'Nouveau cheval'}
      >
        <HorseForm
          horse={horseActions.editingHorse}
          onSubmit={handleFormSubmit}
          onCancel={horseActions.closeModal}
        />
      </Modal>

      {horseActions.showHorseCard && horseActions.selectedHorse && (
        <HorseCard
          horseId={horseActions.selectedHorse.id}
          onClose={horseActions.closeHorseCard}
          onEdit={(h) => {
            horseActions.closeHorseCard();
            horseActions.handleEdit(h);
          }}
          onDelete={(h) => {
            horseActions.closeHorseCard();
            horseActions.handleDeleteClick(h);
          }}
          onSuccess={handleSuccess}
        />
      )}

      {ridersModal.showRidersModal && ridersModal.selectedHorseRiders && (
        <RidersModal
          horseName={ridersModal.selectedHorseRiders.horseName}
          riders={ridersModal.selectedHorseRiders.riders}
          isOpen={ridersModal.showRidersModal}
          onClose={ridersModal.closeRidersModal}
          onSuccess={handleSuccess}
        />
      )}

      <DeleteConfirmationModal
        isOpen={horseActions.showDeleteModal}
        onClose={horseActions.closeDeleteModal}
        onRemoveFromInventory={horseActions.handleRemoveFromInventory}
        onPermanentDelete={horseActions.handlePermanentDelete}
        itemType="horse"
        itemName={horseActions.horseToDelete?.name}
      />
    </div>
  );
}

export default HorsesList;
