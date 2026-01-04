import React from 'react';
import PropTypes from 'prop-types';
import { useRidersList } from '../../hooks/useRidersList';
import RiderForm from './RiderForm';
import RiderCard from './RiderCard';
import RidersTable from './RidersTable';
import RidersStats from './RidersStats';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import Portal from '../../components/common/Portal';
import { Icons } from '../../lib/libraries/icons';

function RidersList() {
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
    stats,

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
    formatDate,
    getStatusBadge,
    
    // State setters
    clearSuccessMessage,
    clearError
  } = useRidersList();

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

      {/* Stats Dashboard */}
      <RidersStats stats={stats} />

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

      <RidersTable
        riders={riders}
        onViewDetails={handleViewDetails}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        formatDate={formatDate}
        getStatusBadge={getStatusBadge}
      />

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
              <RiderForm
                rider={editingRider}
                onSubmit={handleFormSubmit}
                onCancel={closeRiderModal}
              />
            </div>
          </div>
        </Portal>
      )}

      {/* Rider Card Modal */}
      {selectedRiderId && (
        <RiderCard
          riderId={selectedRiderId}
          onClose={closeRiderCard}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={handleRemoveFromInventory}
        riderName={riderToDelete?.name}
      />
    </div>
  );
}

RidersList.propTypes = {};

export default RidersList;