import { Icons } from '../../../lib/icons';
import { useRidersList } from '../../../hooks/useRidersList';

import '../../../styles/index.css';

import DeleteConfirmationModal from '../../common/DeleteConfirmationModal';
import Modal from '../../common/Modal';
import RiderCard from '../RiderCard';
import FilterButtons from './FilterButtons';
import RiderForm from './RiderForm';
import RidersTable from './RidersTable';

function RidersList() {
  const {
    // Data
    filteredRiders,
    riders,
    stats,

    // UI state
    loading,
    error,
    showModal,
    editingRider,
    successMessage,
    selectedRiderId,
    showDeleteModal,
    riderToDelete,

    // Filters
    activityFilter,
    setActivityFilter,
    kindFilter,
    setKindFilter,

    // Actions
    handleCreate,
    handleEdit,
    handleViewDetails,
    handleDeleteClick,
    handleRemoveFromInventory,
    handlePermanentDelete,
    handleFormSubmit,

    // Modal handlers
    closeRiderModal,
    closeDeleteModal,
    closeRiderCard,

    // Utilities
    getStatusBadge,

    // Message helpers
    clearSuccessMessage,
    clearError,
  } = useRidersList();

  /* ------------------------------------------------------------------ */
  /* Loading                                                            */
  /* ------------------------------------------------------------------ */

  if (loading) {
    return (
      <div className="loading">
        <Icons.Loading className="spin" /> Chargement des cavaliers...
      </div>
    );
  }

  /* ------------------------------------------------------------------ */
  /* Render                                                             */
  /* ------------------------------------------------------------------ */

  return (
    <div className="card-enhanced">
      <div className="flex-between mb-20">
        <h2>Liste des Cavaliers</h2>
        <button className="btn btn-primary" onClick={handleCreate}>
          <Icons.Add /> Nouveau Cavalier
        </button>
      </div>

      {/* Filters */}
      {riders.length > 0 && (
        <FilterButtons
          activityFilter={activityFilter}
          riderKindFilter={kindFilter}
          stats={stats}
          onActivityFilterChange={setActivityFilter}
          onRiderKindFilterChange={setKindFilter}
        />
      )}

      {/* Error */}
      {error && (
        <div className="alert alert-error mb-20">
          <Icons.Warning style={{ marginRight: '8px' }} />
          {error}
          <button
            className="btn btn-sm btn-secondary"
            onClick={clearError}
            style={{ marginLeft: '12px' }}
          >
            Effacer
          </button>
        </div>
      )}

      {/* Success */}
      {successMessage && (
        <div className="alert alert-success mb-20">
          <Icons.Check style={{ marginRight: '8px' }} />
          {successMessage}
          <button
            className="btn btn-sm btn-secondary"
            onClick={clearSuccessMessage}
            style={{ marginLeft: '12px' }}
          >
            OK
          </button>
        </div>
      )}

      {/* Content */}
      {riders.length === 0 ? (
        <div className="empty-state text-center p-40">
          <Icons.Users style={{ fontSize: '48px', color: '#ccc', marginBottom: '16px' }} />
          <p>Aucun cavalier trouvé</p>
          <button className="btn btn-primary mt-20" onClick={handleCreate}>
            <Icons.Add /> Ajouter un cavalier
          </button>
        </div>
      ) : filteredRiders.length === 0 ? (
        <div className="empty-state text-center p-40">
          <Icons.Filter style={{ fontSize: '48px', color: '#ccc', marginBottom: '16px' }} />
          <p>Aucun cavalier ne correspond au filtre sélectionné</p>
        </div>
      ) : (
        <RidersTable
          riders={filteredRiders}
          onViewDetails={handleViewDetails}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          getStatusBadge={getStatusBadge}
        />
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={closeRiderModal}
        size="medium"
        title={
          <div className="flex gap-8 align-center">
            {editingRider ? (
              <>
                <Icons.Edit /> Modifier le cavalier
              </>
            ) : (
              <>
                <Icons.Add /> Nouveau cavalier
              </>
            )}
          </div>
        }
      >
        <RiderForm rider={editingRider} onSubmit={handleFormSubmit} onCancel={closeRiderModal} />
      </Modal>

      {/* Rider details */}
      {selectedRiderId && <RiderCard riderId={selectedRiderId} onClose={closeRiderCard} />}

      {/* Delete confirmation */}
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
