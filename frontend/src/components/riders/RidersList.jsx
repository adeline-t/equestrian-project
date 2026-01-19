import { useRidersList } from '../../hooks/useRidersList.js';
import { getRiderTypeLabel } from '../../lib/domain/domain-constants.js';
import { Icons } from '../../lib/icons.jsx';
import DeleteConfirmationModal from '../common/DeleteConfirmationModal.jsx';
import Modal from '../common/Modal.jsx';
import RiderCard from './RiderCard.jsx';
import RiderForm from './RiderForm.jsx';
import '../../styles/components/riders.css';

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
    clearSuccessMessage,
    clearError,
  } = useRidersList();

  if (loading) {
    return (
      <div className="loading">
        <Icons.Loading className="spin" /> Chargement des cavaliers...
      </div>
    );
  }

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
              className={`pill ${riderTypeFilter === 'owner' ? 'pill-active' : ''}`}
              onClick={() => setRiderTypeFilter('owner')}
              data-rider-type="owner"
            >
              {getRiderTypeLabel('owner')}
            </button>
            <button
              className={`pill ${riderTypeFilter === 'club' ? 'pill-active' : ''}`}
              onClick={() => setRiderTypeFilter('club')}
              data-rider-type="club"
            >
              {getRiderTypeLabel('club')}
            </button>
            <button
              className={`pill ${riderTypeFilter === 'loaner' ? 'pill-active' : ''}`}
              onClick={() => setRiderTypeFilter('loaner')}
              data-rider-type="loaner"
            >
              {getRiderTypeLabel('loaner')}
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
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRiders.map((rider) => (
                <tr key={rider.id} className="rider-row">
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

                  <td data-label="Statut">
                    <span
                      className={`badge ${
                        getStatusBadge(rider) === 'Actif' ? 'badge-success' : 'badge-secondary'
                      }`}
                    >
                      {getStatusBadge(rider)}
                    </span>
                  </td>

                  <td data-label="Actions" className="table-actions">
                    <div className="action-buttons">
                      <button
                        className="btn-icon btn-icon-view"
                        onClick={() => handleViewDetails(rider.id)}
                        title="Voir les détails"
                      >
                        <Icons.View />
                      </button>
                      <button
                        className="btn-icon btn-icon-edit"
                        onClick={() => handleEdit(rider)}
                        title="Modifier"
                      >
                        <Icons.Edit />
                      </button>
                      <button
                        className="btn-icon btn-icon-delete"
                        onClick={() => handleDeleteClick(rider)}
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

      {selectedRiderId && <RiderCard riderId={selectedRiderId} onClose={closeRiderCard} />}

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
