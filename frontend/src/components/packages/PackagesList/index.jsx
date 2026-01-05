import { usePackagesList } from '../../../hooks/usePackagesList.js';
import PackageForm from '../PackageForm.jsx';
import PackagesTable from './PackagesTable.jsx';
import PackageFilterButtons from './PackageFilterButtons.jsx';
import PackageDeleteModal from '../../common/DeleteConfirmationModal.jsx';
import { Icons } from '../../../lib/libraries/icons.jsx';

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

      <PackagesTable
        packages={filteredPackages}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        getStatusBadge={getStatusBadge}
        getRiderName={getRiderName}
      />

      {/* Package Form Modal */}
      {showModal && (
        <PackageForm
          package={editingPackage}
          riders={riders}
          onSubmit={handleFormSubmit}
          onCancel={closePackageModal}
        />
      )}

      {/* Delete Modal */}
      <PackageDeleteModal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        onRemoveFromInventory={handleRemoveFromInventory}
        onPermanentDelete={handlePermanentDelete}
        itemType="forfait"
        itemName={packageToDelete?.name || `Forfait #${packageToDelete?.id}`}
      />
    </div>
  );
}

PackagesList.propTypes = {};

export default PackagesList;
