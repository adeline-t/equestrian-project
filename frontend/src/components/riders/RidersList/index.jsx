import { useState } from 'react';
import { useRidersList } from '../../../hooks/useRidersList';
import RiderForm from './RiderForm';
import RiderCard from '../RiderCard';
import RidersTable from './RidersTable';
import FilterButtons from './FilterButtons';
import DeleteConfirmationModal from '../../common/DeleteConfirmationModal';
import Portal from '../../common/Portal';
import { Icons } from '../../../lib/libraries/icons.jsx';
import '../../../styles/common/modal.css';
import '../../../styles/common/alerts.css';
import '../../../styles/common/buttons.css';
import { calculateRiderStats, filterRidersByStatus } from '../../../lib/helpers/stats/riderStats.js';

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

      {riders.length > 0 && <FilterButtons filter={filter} stats={stats} onFilterChange={setFilter} />}

      {error && (
        <div className="error">
          <Icons.Warning /> {error}
          <button className="btn btn-sm btn-secondary ml-10" onClick={clearError}>
            Effacer
          </button>
        </div>
      )}

      {successMessage && (
        <div className="success">
          <Icons.Check /> {successMessage}
          <button className="btn btn-sm btn-secondary ml-10" onClick={clearSuccessMessage}>
            Effacer
          </button>
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

      {/* Rider Form Modal */}
      {showModal && (
        <Portal>
          <div
            className="modal-overlay"
            onClick={closeRiderModal}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}
          >
            <div
              className="modal"
              onClick={(e) => e.stopPropagation()}
              style={{
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
            >
              <div className="modal-header">
                <h3>
                  {editingRider ? (
                    <>
                      <Icons.Edit style={{ marginRight: '8px' }} />
                      Modifier le cavalier
                    </>
                  ) : (
                    <>
                      <Icons.Add style={{ marginRight: '8px' }} />
                      Nouveau cavalier
                    </>
                  )}
                </h3>
                <button className="modal-close" onClick={closeRiderModal}>
                  <Icons.Close />
                </button>
              </div>
              <RiderForm rider={editingRider} onSubmit={handleFormSubmit} onCancel={closeRiderModal} />
            </div>
          </div>
        </Portal>
      )}

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