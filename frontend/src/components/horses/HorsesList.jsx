import { useState } from 'react';
import { useHorseActions, useHorseRiders } from '../../hooks';
import { useHorsesList } from '../../hooks/useHorsesList.js';
import { Icons } from '../../lib/icons.jsx';
import {
  getHorseTypeConfig,
  getOwnerTypeConfig,
  getStatusConfig,
  WEEK_DAYS_EN,
  weekDayCodeToFr,
  getLoanDays,
} from '../../lib/domain/domain-constants.js';
import { isActive } from '../../lib/helpers/index.js';
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
import '../../styles/features/horses.css';
import { useAppMode } from '../../context/AppMode.jsx';

function HorsesList() {
  // --- Hooks en haut du composant ---
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { mode } = useAppMode();

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

  // --- Handlers ---
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
    if (e.target.closest('.riders-count-badge')) return;
    horseActions.openHorseCard(horse);
  };

  const clearSuccessMessage = () => setSuccessMessage('');
  const clearErrorMessage = () => {
    setErrorMessage('');
    clearError();
  };

  const renderLoanDays = (horse) => {
    const loanDays = getLoanDays(horse);
    return (
      <div className="loan-days-cell">
        {WEEK_DAYS_EN.map((dayCode) => {
          const isLoanDay = loanDays.includes(dayCode);
          return (
            <span
              key={dayCode}
              className={`day-badge ${isLoanDay ? 'active' : 'inactive'}`}
              title={isLoanDay ? 'Jour de pension' : 'Pas de pension'}
            >
              {weekDayCodeToFr(dayCode)}
            </span>
          );
        })}
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
    <div className="card-enhanced">
      {/* Header */}
      <div className="flex-between mb-20">
        <div className="header-title">
          <h2>Liste des Chevaux</h2>
        </div>
        {mode === 'admin' && (
          <div className="flex gap-12">
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
              <Icons.Add />
              Nouveau Cheval
            </button>
          </div>
        )}
      </div>

      {/* Filters */}
      {horses.length > 0 && (
        <div className="filter-section mb-20">
          <div className="filter-pills mb-10">
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
              <button
                className={`pill ${
                  ownershipFilter === OWNERSHIP_TYPE_FILTERS.OTHER ? 'pill-active' : ''
                }`}
                onClick={() => setOwnershipFilter(OWNERSHIP_TYPE_FILTERS.OTHER)}
              >
                Autre ({stats.other})
              </button>
            </div>
          )}
        </div>
      )}

      {/* Messages */}
      {displayError && (
        <div className="alert alert-error mb-20">
          <Icons.Warning />
          {displayError}
          <button className="btn btn-sm btn-secondary ml-10" onClick={clearErrorMessage}>
            Effacer
          </button>
        </div>
      )}

      {successMessage && (
        <div className="alert alert-success mb-20">
          <Icons.Check />
          {successMessage}
          <button className="btn btn-sm btn-secondary ml-10" onClick={clearSuccessMessage}>
            OK
          </button>
        </div>
      )}

      {/* Table */}
      {horses.length === 0 ? (
        <div className="empty-state">
          <Icons.Horse />
          <p>Aucun cheval trouvé</p>
        </div>
      ) : filteredHorses.length === 0 ? (
        <div className="empty-state">
          <Icons.Filter />
          <p>Aucun cheval ne correspond au filtre</p>
        </div>
      ) : (
        <div className="table-responsive">
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
                const active = isActive(horse.activity_start_date, horse.activity_end_date);
                const horseTypeConfig = getHorseTypeConfig(horse.kind);
                const ownerTypeConfig = getOwnerTypeConfig(horse.ownership_type);

                return (
                  <tr
                    key={horse.id}
                    onClick={(e) => handleRowClick(horse, e)}
                    className="horse-row-clickable"
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
                            className={`riders-count-badge ${
                              horse.active_riders_count > 0 ? 'clickable' : ''
                            }`}
                            onClick={(e) =>
                              horse.active_riders_count > 0 && handleRidersClick(horse, e)
                            }
                          >
                            <Icons.Users />
                            {horse.active_riders_count || 0}
                          </span>
                        </td>
                      </>
                    )}
                    <td>{renderLoanDays(horse)}</td>
                    {mode === 'admin' && (
                      <>
                        <td data-label="Actions" className="table-actions">
                          <div className="action-buttons">
                            <button
                              className="btn-icon btn-icon-view"
                              onClick={(e) => handleRowClick(horse, e)}
                              title="Voir les détails"
                            >
                              <Icons.View />
                            </button>
                          </div>
                        </td>
                      </>
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
          horse={horseActions.selectedHorse}
          onClose={horseActions.closeHorseCard}
          onEdit={(horse) => {
            horseActions.closeHorseCard();
            horseActions.handleEdit(horse);
          }}
          onDelete={(horse) => {
            horseActions.closeHorseCard();
            horseActions.handleDeleteClick(horse);
          }}
        />
      )}

      {ridersModal.showRidersModal && ridersModal.selectedHorseRiders && (
        <RidersModal
          horseName={ridersModal.selectedHorseRiders.horseName}
          riders={ridersModal.selectedHorseRiders.riders}
          isOpen={ridersModal.showRidersModal}
          onClose={ridersModal.closeRidersModal}
        />
      )}

      <DeleteConfirmationModal
        isOpen={horseActions.showDeleteModal}
        onClose={horseActions.closeDeleteModal}
        onRemoveFromInventory={horseActions.handleRemoveFromInventory}
        onPermanentDelete={horseActions.handlePermanentDelete}
        itemType="cheval"
        itemName={horseActions.horseToDelete?.name}
      />
    </div>
  );
}

export default HorsesList;
