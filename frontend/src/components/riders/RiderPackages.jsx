import React from 'react';
import PropTypes from 'prop-types';
import { useRiderPackages } from '../../hooks/useRiderPackages';
import PackageForm from '../packages/PackageForm';
import PackagesTable from './PackagesTable';
import PackageDeleteModal from './PackageDeleteModal';
import Portal from '../../components/common/Portal';
import { Icons } from '../../lib/libraries/icons';

function RiderPackages({ riderId, riderName }) {
  const {
    // State
    packages,
    riders,
    loading,
    error,
    showModal,
    editingPackage,
    successMessage,
    showDeleteModal,
    packageToDelete,
    activePackages,

    // Actions
    handleCreate,
    handleEdit,
    handleDeleteClick,
    handleRemoveFromInventory,
    handlePermanentDelete,
    handleFormSubmit,
    
    // Modal handlers
    closePackageModal,
    closeDeleteModal,
    
    // Utility functions
    formatDate,
    getStatusBadge,
    
    // State setters
    clearSuccessMessage,
    clearError
  } = useRiderPackages(riderId);

  if (loading) {
    return (
      <div className="loading">
        <Icons.Loading className="spin" /> Chargement des forfaits...
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex-between mb-20">
        <div>
          <h2>Forfaits de {riderName}</h2>
          <p className="subtitle">
            {activePackages.length} forfait(s) actif(s) sur {packages.length} total
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleCreate}>
          <Icons.Add /> Nouveau Forfait
        </button>
      </div>

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

      <PackagesTable
        packages={packages}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        formatDate={formatDate}
        getStatusBadge={getStatusBadge}
      />

      {/* Package Form Modal */}
      {showModal && (
        <Portal>
          <div
            className="modal-overlay"
            onClick={closePackageModal}
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
                  {editingPackage ? (
                    <>
                      <Icons.Edit style={{ marginRight: '8px' }} />
                      Modifier le forfait
                    </>
                  ) : (
                    <>
                      <Icons.Add style={{ marginRight: '8px' }} />
                      Nouveau forfait
                    </>
                  )}
                </h3>
                <button className="modal-close" onClick={closePackageModal}>
                  <Icons.Close />
                </button>
              </div>
              <PackageForm
                package={editingPackage}
                riders={riders}
                riderId={riderId}
                onSubmit={handleFormSubmit}
                onCancel={closePackageModal}
              />
            </div>
          </div>
        </Portal>
      )}

      {/* Delete Modal */}
      <PackageDeleteModal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        packageName={packageToDelete?.name || `Forfait #${packageToDelete?.id}`}
        onRemoveFromInventory={handleRemoveFromInventory}
        onPermanentDelete={handlePermanentDelete}
      />
    </div>
  );
}

RiderPackages.propTypes = {
  riderId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  riderName: PropTypes.string.isRequired,
};

export default RiderPackages;