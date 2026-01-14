import { useRidersList } from '../../hooks/useRidersList.js';
import { RIDER_TYPES, getRiderTypeLabel } from '../../lib/domain/riders.js';
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
    activityFilter,
    riderTypeFilter,
    ACTIVITY_STATUS_FILTERS,
    COMMON_FILTERS,
    setActivityFilter,
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
    <div className="card-enhanced">
      {/* Header */}
      <div className="flex-between mb-20">
        <h2>Liste des Cavaliers</h2>
        <button className="btn btn-primary" onClick={handleCreate}>
          <Icons.Add style={{ marginRight: '8px' }} />
          Nouveau Cavalier
        </button>
      </div>

      {/* Filters */}
      {riders.length > 0 && (
        <div className="filter-section mb-20">
          {/* Activity Filter */}
          <div className="filter-buttons mb-15">
            <button
              className={`btn ${
                activityFilter === ACTIVITY_STATUS_FILTERS.ACTIVE ? 'btn-primary' : 'btn-secondary'
              }`}
              onClick={() => setActivityFilter(ACTIVITY_STATUS_FILTERS.ACTIVE)}
            >
              Actifs ({stats.active})
            </button>
            <button
              className={`btn ${
                activityFilter === ACTIVITY_STATUS_FILTERS.INACTIVE
                  ? 'btn-primary'
                  : 'btn-secondary'
              }`}
              onClick={() => setActivityFilter(ACTIVITY_STATUS_FILTERS.INACTIVE)}
            >
              Inactifs ({stats.inactive})
            </button>
            <button
              className={`btn ${
                activityFilter === ACTIVITY_STATUS_FILTERS.ALL ? 'btn-primary' : 'btn-secondary'
              }`}
              onClick={() => setActivityFilter(ACTIVITY_STATUS_FILTERS.ALL)}
            >
              Tous ({stats.total})
            </button>
          </div>

          {/* Rider Type Filter */}
          <div className="filter-pills">
            <button
              className={`pill ${riderTypeFilter === COMMON_FILTERS.ALL ? 'pill-active' : ''}`}
              onClick={() => setRiderTypeFilter(COMMON_FILTERS.ALL)}
              data-rider-type="all"
            >
              Tous
            </button>
            {Object.values(RIDER_TYPES).map((type) => (
              <button
                key={type}
                className={`pill ${riderTypeFilter === type ? 'pill-active' : ''}`}
                onClick={() => setRiderTypeFilter(type)}
                data-rider-type={type}
              >
                {getRiderTypeLabel(type)}
              </button>
            ))}
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
          <Icons.Users style={{ fontSize: '48px', color: '#ccc', marginBottom: '16px' }} />
          <p>Aucun cavalier trouvé</p>
          <button className="btn btn-primary mt-20" onClick={handleCreate}>
            <Icons.Add style={{ marginRight: '8px' }} />
            Ajouter un cavalier
          </button>
        </div>
      ) : filteredRiders.length === 0 ? (
        <div className="empty-state">
          <Icons.Filter style={{ fontSize: '48px', color: '#ccc', marginBottom: '16px' }} />
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
                  <td>
                    <strong>{rider.name}</strong>
                  </td>
                  <td>
                    <span className="badge badge-rider-type" data-rider-type={rider.rider_type}>
                      {getRiderTypeLabel(rider.rider_type)}
                    </span>
                  </td>
                  <td>{rider.email || '-'}</td>
                  <td>{rider.phone || '-'}</td>
                  <td>
                    <span
                      className={`badge ${
                        getStatusBadge(rider) === 'Actif' ? 'badge-success' : 'badge-secondary'
                      }`}
                    >
                      {getStatusBadge(rider)}
                    </span>
                  </td>
                  <td className="table-actions">
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
