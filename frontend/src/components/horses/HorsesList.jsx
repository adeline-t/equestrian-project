import { useState } from 'react';
import { useHorseActions, useHorseRiders } from '../../hooks';
import { useHorsesList } from '../../hooks/useHorsesList.js';
import { Icons } from '../../lib/icons.jsx';
import { getHorseKindLabel, WEEK_DAYS, WEEK_DAYS_EN } from '../../lib/domain/domain-constants.js';
import { isActive } from '../../lib/helpers/index.js';
import DeleteConfirmationModal from '../common/DeleteConfirmationModal.jsx';
import Modal from '../common/Modal.jsx';
import HorseForm from './HorseForm.jsx';
import RidersModal from './RidersModal.jsx';
import '../../styles/components/horses.css';

/**
 * HorsesList - Main horses list component
 * Modern design with improved filters like RidersList
 */
function HorsesList() {
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
    HORSE_KIND_FILTERS,
    OWNERSHIP_TYPE_FILTERS,
    setKindFilter,
    setOwnershipFilter,
    toggleIncludeInactive,
    reload,
    clearError,
  } = useHorsesList();

  const handleSuccess = (message) => {
    setSuccessMessage(message);
    setErrorMessage('');
    setTimeout(() => setSuccessMessage(''), 3000);
    reload();
  };

  const handleError = (err) => {
    setErrorMessage(err?.message || 'Une erreur est survenue');
    setTimeout(() => setErrorMessage(''), 5000);
  };

  const horseActions = useHorseActions(handleSuccess);
  const ridersModal = useHorseRiders();

  const handleFormSubmit = async (horseData) => {
    try {
      setErrorMessage('');
      await horseActions.handleSubmit(horseData);
    } catch (err) {
      handleError(err);
      throw err;
    }
  };

  const handleRidersClick = async (horse) => {
    try {
      setErrorMessage('');
      await ridersModal.handleRidersClick(horse);
    } catch (err) {
      handleError(err);
    }
  };

  const clearSuccessMessage = () => setSuccessMessage('');
  const clearErrorMessage = () => {
    setErrorMessage('');
    clearError();
  };

  const getOwnershipLabel = (ownership) => {
    const labels = {
      laury: 'Laury',
      private_owner: 'Propriétaire',
      club: 'Club',
      other: 'Autre',
    };
    return labels[ownership] || ownership;
  };

  /**
   * Render loan days badges for a horse - shows all days with visual distinction
   */
  const renderLoanDays = (horse) => {
    const loanDays = horse.loan_days || [];

    return (
      <div className="loan-days-cell">
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
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            className={`btn ${includeInactive ? 'btn-secondary' : 'btn-outline-secondary'}`}
            onClick={toggleIncludeInactive}
            title={includeInactive ? 'Masquer les inactifs' : 'Afficher les inactifs'}
          >
            <Icons.Filter style={{ marginRight: '8px' }} />
            {includeInactive
              ? `Inactifs inclus (${stats.inactive})`
              : `Afficher inactifs (${stats.inactive})`}
          </button>
          <button className="btn btn-primary" onClick={horseActions.handleCreate}>
            <Icons.Add style={{ marginRight: '8px' }} />
            Nouveau Cheval
          </button>
        </div>
      </div>

      {/* Filters */}
      {horses.length > 0 && (
        <div className="filter-section mb-20">
          {/* Horse Kind Filter */}
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

          {/* Ownership Type Filter */}
          <div className="filter-pills">
            <button
              className={`pill ${
                ownershipFilter === OWNERSHIP_TYPE_FILTERS.ALL ? 'pill-active' : ''
              }`}
              onClick={() => setOwnershipFilter(OWNERSHIP_TYPE_FILTERS.ALL)}
              data-ownership-type="all"
            >
              Tous propriétaires
            </button>
            <button
              className={`pill ${
                ownershipFilter === OWNERSHIP_TYPE_FILTERS.LAURY ? 'pill-active' : ''
              }`}
              onClick={() => setOwnershipFilter(OWNERSHIP_TYPE_FILTERS.LAURY)}
              data-ownership-type="laury"
            >
              Laury ({stats.laury})
            </button>
            <button
              className={`pill ${
                ownershipFilter === OWNERSHIP_TYPE_FILTERS.PRIVATE_OWNER ? 'pill-active' : ''
              }`}
              onClick={() => setOwnershipFilter(OWNERSHIP_TYPE_FILTERS.PRIVATE_OWNER)}
              data-ownership-type="private_owner"
            >
              Propriétaires ({stats.private_owner})
            </button>
            <button
              className={`pill ${
                ownershipFilter === OWNERSHIP_TYPE_FILTERS.CLUB ? 'pill-active' : ''
              }`}
              onClick={() => setOwnershipFilter(OWNERSHIP_TYPE_FILTERS.CLUB)}
              data-ownership-type="club"
            >
              Club ({stats.club})
            </button>
            <button
              className={`pill ${
                ownershipFilter === OWNERSHIP_TYPE_FILTERS.OTHER ? 'pill-active' : ''
              }`}
              onClick={() => setOwnershipFilter(OWNERSHIP_TYPE_FILTERS.OTHER)}
              data-ownership-type="other"
            >
              Autre ({stats.other})
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      {displayError && (
        <div className="alert alert-error mb-20">
          <Icons.Warning style={{ marginRight: '8px' }} />
          {displayError}
          <button className="btn btn-sm btn-secondary ml-10" onClick={clearErrorMessage}>
            Effacer
          </button>
        </div>
      )}

      {successMessage && (
        <div className="alert alert-success mb-20">
          <Icons.Check style={{ marginRight: '8px' }} />
          {successMessage}
          <button className="btn btn-sm btn-secondary ml-10" onClick={clearSuccessMessage}>
            OK
          </button>
        </div>
      )}

      {/* Table */}
      {horses.length === 0 ? (
        <div className="empty-state">
          <Icons.Horse
            style={{ fontSize: '48px', color: 'var(--color-gray-400)', marginBottom: '16px' }}
          />
          <p>Aucun cheval trouvé</p>
          <button className="btn btn-primary mt-20" onClick={horseActions.handleCreate}>
            <Icons.Add style={{ marginRight: '8px' }} />
            Ajouter un cheval
          </button>
        </div>
      ) : filteredHorses.length === 0 ? (
        <div className="empty-state">
          <Icons.Filter
            style={{ fontSize: '48px', color: 'var(--color-gray-400)', marginBottom: '16px' }}
          />
          <p>Aucun cheval ne correspond au filtre</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Type</th>
                <th>Propriétaire</th>
                <th>Cavaliers Actifs</th>
                <th>Jours de pension</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredHorses.map((horse) => (
                <tr key={horse.id} className="horse-row">
                  <td data-label="Nom">
                    <strong>{horse.name}</strong>
                  </td>
                  <td data-label="Type">
                    <span className="badge badge-kind" data-kind={horse.kind}>
                      {getHorseKindLabel(horse.kind)}
                    </span>
                  </td>
                  <td data-label="Propriétaire">
                    <span className="badge badge-info">
                      {getOwnershipLabel(horse.ownership_type)}
                    </span>
                  </td>
                  <td data-label="Cavaliers Actifs">
                    <span
                      className={`riders-count-badge ${
                        horse.active_riders_count > 0 ? 'clickable' : ''
                      }`}
                      onClick={() => horse.active_riders_count > 0 && handleRidersClick(horse)}
                      title={
                        horse.active_riders_count > 0
                          ? 'Cliquer pour voir les cavaliers'
                          : 'Aucun cavalier actif'
                      }
                    >
                      <Icons.Users />
                      {horse.active_riders_count || 0}
                    </span>
                  </td>
                  <td data-label="Jours de pension">{renderLoanDays(horse)}</td>
                  <td data-label="Statut">
                    <span
                      className={`badge ${
                        isActive(horse.activity_start_date, horse.activity_end_date)
                          ? 'badge-success'
                          : 'badge-secondary'
                      }`}
                    >
                      {isActive(horse.activity_start_date, horse.activity_end_date)
                        ? 'Actif'
                        : 'Inactif'}
                    </span>
                  </td>
                  <td data-label="Actions" className="table-actions">
                    <div className="action-buttons">
                      <button
                        className="btn-icon btn-icon-edit"
                        onClick={() => horseActions.handleEdit(horse)}
                        title="Modifier"
                      >
                        <Icons.Edit />
                      </button>
                      <button
                        className="btn-icon btn-icon-delete"
                        onClick={() => horseActions.handleDeleteClick(horse)}
                        title="Supprimer"
                      >
                        <Icons.Delete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      <Modal
        isOpen={horseActions.showModal}
        onClose={horseActions.closeModal}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {horseActions.editingHorse ? (
              <>
                <Icons.Edit />
                Modifier le cheval
              </>
            ) : (
              <>
                <Icons.Add />
                Nouveau cheval
              </>
            )}
          </div>
        }
        size="medium"
      >
        <HorseForm
          horse={horseActions.editingHorse}
          onSubmit={handleFormSubmit}
          onCancel={horseActions.closeModal}
        />
      </Modal>

      <RidersModal
        isOpen={ridersModal.showRidersModal}
        onClose={ridersModal.closeRidersModal}
        horseRiders={ridersModal.selectedHorseRiders}
        loading={ridersModal.loadingRiders}
        error={ridersModal.error}
      />

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
