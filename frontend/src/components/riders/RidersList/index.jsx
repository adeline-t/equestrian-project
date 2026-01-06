import { useState } from 'react';
import { useRidersList } from '../../../hooks/useRidersList';
import RiderForm from './RiderForm/index.jsx';
import RiderCard from '../RiderCard';
import RidersTable from './RidersTable';
import FilterButtons from './FilterButtons';
import DeleteConfirmationModal from '../../common/DeleteConfirmationModal';
import Modal from '../../common/Modal';
import { Icons } from '../../../lib/libraries/icons.jsx';
import '../../../styles/common/modal.css';
import '../../../styles/common/alerts.css';
import '../../../styles/common/buttons.css';
import {
  calculateRiderStats,
  filterRidersByStatus,
} from '../../../lib/helpers/domains/riders/stats.js';

function RidersList() {
  const [filter, setFilter] = useState('all');

  const {
    // State
    riders,
    loading,
    error,
    showModal,
    editingRider,
    successMessage,
    selectedRiderId,
    showDeleteModal,
    riderToDelete,

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

    // Utility functions
    getStatusBadge,

    // State setters
    clearSuccessMessage,
    clearError,
  } = useRidersList();

  // Calculate statistics and filter riders
  const stats = calculateRiderStats(riders);
  const filteredRiders = filterRidersByStatus(riders, filter);

  if (loading) {
    return (
      <div className="loading">
        <Icons.Loading className="spin" /> Chargement des cavaliers...
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex-between mb-20">
        <h2>Liste des Cavaliers</h2>
        <button className="btn btn-primary" onClick={handleCreate}>
          <Icons.Add /> Nouveau Cavalier
        </button>
      </div>

      {riders.length > 0 && (
        <FilterButtons filter={filter} stats={stats} onFilterChange={setFilter} />
      )}

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '20px' }}>
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

      {successMessage && (
        <div className="alert alert-success" style={{ marginBottom: '20px' }}>
          <Icons.Check style={{ marginRight: '8px' }} />
          {successMessage}
        </div>
      )}

      {riders.length === 0 ? (
        <div className="empty-state" style={{ textAlign: 'center', padding: '40px' }}>
          <Icons.Users style={{ fontSize: '48px', color: '#ccc', marginBottom: '16px' }} />
          <p>Aucun cavalier trouvé</p>
          <button className="btn btn-primary mt-20" onClick={handleCreate}>
            <Icons.Add /> Ajouter un cavalier
          </button>
        </div>
      ) : filteredRiders.length === 0 ? (
        <div className="empty-state" style={{ textAlign: 'center', padding: '40px' }}>
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

      {/* Rider Card Modal */}
      {selectedRiderId && <RiderCard riderId={selectedRiderId} onClose={closeRiderCard} />}

      {/* Delete Confirmation Modal */}
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

RidersList.propTypes = {};

export default RidersList;
