import { useRidersList } from '../../hooks/useRidersList.js';
import {
  getRiderHorseLinkConfig,
  getRiderTypeLabel,
  RIDER_TYPES,
  WEEK_DAYS,
  WEEK_DAYS_EN,
} from '../../lib/domain/domain-constants.js';
import { Icons } from '../../lib/icons.jsx';
import '../../styles/components/riders.css';
import DeleteConfirmationModal from '../common/DeleteConfirmationModal.jsx';
import Modal from '../common/Modal.jsx';
import RiderCard from './RiderCard.jsx';
import RiderForm from './RiderForm.jsx';

/**
 * RidersList - Main riders list component
 */
function RidersList() {
  const {
    riders,
    filteredRiders,
    stats,
    loading,
    error,
    showModal,
    editingRider,
    selectedRiderId,
    showDeleteModal,
    riderToDelete,
    successMessage,
    riderTypeFilter,
    COMMON_FILTERS,
    includeInactive,
    toggleIncludeInactive,
    setRiderTypeFilter,
    handleCreate,
    handleEdit,
    handleViewDetails,
    handleDeleteClick,
    handleRemoveFromInventory,
    handlePermanentDelete,
    handleFormSubmit,
    closeRiderModal,
    closeDeleteModal,
    closeRiderCard,
    getStatusBadge,
    getRiderPairingDays,
    clearSuccessMessage,
    clearError,
  } = useRidersList();

  // Handler pour le clic sur une ligne
  const handleRowClick = (e, riderId) => {
    // Ne pas ouvrir la card si on a cliqué sur un bouton d'action
    if (e.target.closest('.table-actions') || e.target.closest('button')) {
      return;
    }
    handleViewDetails(riderId);
  };

  // Obtenir les chevaux d'un cavalier avec leur type de pairing
  const getRiderHorses = (rider) => {
    if (!rider.pairings || rider.pairings.length === 0) {
      return null;
    }
    return rider.pairings;
  };

  if (loading) {
    return (
      <div className="loading">
        <Icons.Loading className="spin" /> Chargement des cavaliers...
      </div>
    );
  }

  const renderRiderDays = (rider) => {
    const days = getRiderPairingDays(rider);

    if (days.length === 0) {
      return <span className="text-muted">-</span>;
    }

    return (
      <div className="loan-days-cell">
        {WEEK_DAYS_EN.map((dayEn, index) => {
          const isActive = days.includes(dayEn);
          return (
            <span
              key={dayEn}
              className={`day-badge ${isActive ? 'active' : 'inactive'}`}
              title={isActive ? 'Jour de pairing' : 'Pas de pairing'}
            >
              {WEEK_DAYS[index]}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="card-enhanced riders-list">
      <div className="flex-between mb-20">
        <h2>Liste des Cavaliers</h2>

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

          <button className="btn btn-primary" onClick={handleCreate}>
            <Icons.Add style={{ marginRight: '8px' }} />
            Nouveau Cavalier
          </button>
        </div>
      </div>

      {/* Filters */}
      {riders.length > 0 && (
        <div className="filter-section mb-20">
          {/* Rider Type Filter */}
          <div className="filter-pills">
            <button
              className={`pill ${riderTypeFilter === COMMON_FILTERS.ALL ? 'pill-active' : ''}`}
              onClick={() => setRiderTypeFilter(COMMON_FILTERS.ALL)}
              data-rider-type="all"
            >
              Tous
            </button>
            <button
              className={`pill ${riderTypeFilter === RIDER_TYPES.OWNER ? 'pill-active' : ''}`}
              onClick={() => setRiderTypeFilter(RIDER_TYPES.OWNER)}
              data-rider-type={RIDER_TYPES.OWNER}
            >
              {getRiderTypeLabel(RIDER_TYPES.OWNER)}
            </button>
            <button
              className={`pill ${riderTypeFilter === RIDER_TYPES.CLUB ? 'pill-active' : ''}`}
              onClick={() => setRiderTypeFilter(RIDER_TYPES.CLUB)}
              data-rider-type={RIDER_TYPES.CLUB}
            >
              {getRiderTypeLabel(RIDER_TYPES.CLUB)}
            </button>
            <button
              className={`pill ${riderTypeFilter === RIDER_TYPES.LOANER ? 'pill-active' : ''}`}
              onClick={() => setRiderTypeFilter(RIDER_TYPES.LOANER)}
              data-rider-type={RIDER_TYPES.LOANER}
            >
              {getRiderTypeLabel(RIDER_TYPES.LOANER)}
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      {error && (
        <div className="alert alert-error mb-20">
          <Icons.Warning style={{ marginRight: '8px' }} />
          {error}
          <button className="btn btn-sm btn-secondary ml-10" onClick={clearError}>
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
      {riders.length === 0 ? (
        <div className="empty-state">
          <Icons.Users
            style={{ fontSize: '48px', color: 'var(--color-gray-400)', marginBottom: '16px' }}
          />
          <p>Aucun cavalier trouvé</p>
          <button className="btn btn-primary mt-20" onClick={handleCreate}>
            <Icons.Add style={{ marginRight: '8px' }} />
            Ajouter un cavalier
          </button>
        </div>
      ) : filteredRiders.length === 0 ? (
        <div className="empty-state">
          <Icons.Filter
            style={{ fontSize: '48px', color: 'var(--color-gray-400)', marginBottom: '16px' }}
          />
          <p>Aucun cavalier ne correspond au filtre</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Type</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Chevaux</th>
                <th>Jours</th>
                <th> </th>
              </tr>
            </thead>
            <tbody>
              {filteredRiders.map((rider) => {
                const horses = getRiderHorses(rider);

                return (
                  <tr
                    key={rider.id}
                    className="rider-row rider-row-clickable"
                    onClick={(e) => handleRowClick(e, rider.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td data-label="Nom">
                      <strong>{rider.name}</strong>
                    </td>

                    <td data-label="Type">
                      <span className="badge badge-rider-type" data-rider-type={rider.rider_type}>
                        {getRiderTypeLabel(rider.rider_type)}
                      </span>
                    </td>

                    <td data-label="Email">{rider.email || '-'}</td>

                    <td data-label="Téléphone">{rider.phone || '-'}</td>

                    <td data-label="Chevaux">
                      {horses ? (
                        <div className="horses-badges">
                          {horses.map((pairing) => {
                            const linkConfig = getRiderHorseLinkConfig(pairing.link_type);
                            const horseName = pairing.horses?.name || pairing.horse?.name;

                            return (
                              <span
                                key={pairing.id}
                                className={`badge ${linkConfig.badgeClass}`}
                                data-link-type={pairing.link_type}
                                title={`${horseName} - ${linkConfig.label}`}
                              >
                                <Icons.Horse style={{ fontSize: '12px', marginRight: '4px' }} />
                                {horseName}
                              </span>
                            );
                          })}
                        </div>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>

                    <td data-label="Jours">{renderRiderDays(rider)}</td>

                    <td data-label="Actions" className="table-actions">
                      <div className="action-buttons">
                        <button
                          className="btn-icon btn-icon-view"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(rider.id);
                          }}
                          title="Voir les détails"
                        >
                          <Icons.View />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      <Modal
        isOpen={showModal}
        onClose={closeRiderModal}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {editingRider ? (
              <>
                <Icons.Edit />
                Modifier le cavalier
              </>
            ) : (
              <>
                <Icons.Add />
                Nouveau cavalier
              </>
            )}
          </div>
        }
        size="medium"
      >
        <RiderForm rider={editingRider} onSubmit={handleFormSubmit} onCancel={closeRiderModal} />
      </Modal>

      {selectedRiderId && (
        <RiderCard
          riderId={selectedRiderId}
          onClose={closeRiderCard}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      )}

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        onRemoveFromInventory={handleRemoveFromInventory}
        onPermanentDelete={handlePermanentDelete}
        itemType="cavalier"
        itemName={riderToDelete?.name}
      />
    </div>
  );
}

export default RidersList;
