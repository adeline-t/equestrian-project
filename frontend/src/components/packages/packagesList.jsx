import { usePackagesList } from '../../hooks/usePackagesList';
import PackageForm from './PackageForm';
import PackagesTable from './PackagesTable';
import PackageFilterButtons from './PackageFilterButtons';
import PackageDeleteModal from '../common/DeleteConfirmationModal';
import Portal from '../../components/common/Portal';
import { Icons } from '../../lib/libraries/icons.jsx';

function PackagesList() {
  const {
    // State
    packages,
    riders,
    loading,
    error,
    showModal,
    editingPackage,
    successMessage,
    filter,
    showDeleteModal,
    packageToDelete,
    filteredPackages,
    stats,

    // Actions
    handleCreate,
    handleEdit,
    handleDeleteClick,
    handleRemoveFromInventory,
    handlePermanentDelete,
    handleFormSubmit,
    setFilter,

    // Modal handlers
    closePackageModal,
    closeDeleteModal,

    // Utility functions
    getStatusBadge,
    getRiderName,

    // State setters
    clearSuccessMessage,
    clearError,
  } = usePackagesList();

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
        <h2>Liste des Forfaits</h2>
        <button className="btn btn-primary" onClick={handleCreate}>
          <Icons.Add /> Nouveau Forfait
        </button>
      </div>

      {packages.length > 0 && (
        <PackageFilterButtons filter={filter} onFilterChange={setFilter} stats={stats} />
      )}

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
        packages={filteredPackages}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        getStatusBadge={getStatusBadge}
        getRiderName={getRiderName}
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

PackagesList.propTypes = {};

export default PackagesList;
