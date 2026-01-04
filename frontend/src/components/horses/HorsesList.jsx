import React from 'react';
import PropTypes from 'prop-types';
import { useHorsesList } from '../../hooks/useHorsesList';
import { Icons } from '../../lib/libraries/icons';
import HorseForm from './HorseForm';
import HorsesTable from './HorsesTable';
import EmptyState from './EmptyState';
import FilterButtons from './FilterButtons';
import RidersModal from './RidersModal';

function HorsesList() {
  const {
    // State
    horses,
    loading,
    error,
    showModal,
    editingHorse,
    successMessage,
    filter,
    showDeleteModal,
    horseToDelete,
    showRidersModal,
    selectedHorseRiders,
    loadingRiders,
    filteredHorses,
    stats,

    // Actions
    handleRidersClick,
    handleCreate,
    handleEdit,
    handleDeleteClick,
    handleRemoveFromInventory,
    handlePermanentDelete,
    handleFormSubmit,
    setFilter,
    
    // Modal handlers
    closeHorseModal,
    closeRidersModal,
    closeDeleteModal,
    
    // Utility functions
    formatDate,
    getStatusBadge,
    getKindLabel,
    getOwnershipLabel,
    
    // State setters
    clearSuccessMessage,
    clearError
  } = useHorsesList();

  if (loading) {
    return (
      <div className="loading">
        <Icons.Loading className="spin" /> Chargement des chevaux...
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex-between mb-20">
        <h2>Liste des Chevaux</h2>
        <button className="btn btn-primary" onClick={handleCreate}>
          <Icons.Add /> Nouveau Cheval
        </button>
      </div>

      {horses.length > 0 && (
        <FilterButtons
          filter={filter}
          onFilterChange={setFilter}
          stats={stats}
        />
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

      {horses.length === 0 ? (
        <EmptyState type="no-horses" onAction={handleCreate} />
      ) : filteredHorses.length === 0 ? (
        <EmptyState type="no-filter-results" filter={filter} />
      ) : (
        <HorsesTable
          horses={filteredHorses}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          onRidersClick={handleRidersClick}
          formatDate={formatDate}
          getStatusBadge={getStatusBadge}
          getKindLabel={getKindLabel}
          getOwnershipLabel={getOwnershipLabel}
        />
      )}

      {/* Horse Form Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeHorseModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {editingHorse ? (
                  <>
                    <Icons.Edit style={{ marginRight: '8px' }} /> Modifier le cheval
                  </>
                ) : (
                  <>
                    <Icons.Add style={{ marginRight: '8px' }} /> Nouveau cheval
                  </>
                )}
              </h3>
              <button className="modal-close" onClick={closeHorseModal}>
                <Icons.Close />
              </button>
            </div>
            <HorseForm
              horse={editingHorse}
              onSubmit={handleFormSubmit}
              onCancel={closeHorseModal}
            />
          </div>
        </div>
      )}

      {/* Riders Modal */}
      <RidersModal
        isOpen={showRidersModal}
        onClose={closeRidersModal}
        horseName={selectedHorseRiders?.horseName}
        riders={selectedHorseRiders?.riders}
        loading={loadingRiders}
      />

      {/* Delete Modal */}
      {showDeleteModal && horseToDelete && (
        <div
          className="modal-overlay"
          onClick={closeDeleteModal}
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
              maxWidth: '500px',
            }}
          >
            <div className="modal-header">
              <h3>
                <Icons.Warning style={{ marginRight: '8px', color: '#ed8936' }} /> Que faire avec{' '}
                {horseToDelete.name} ?
              </h3>
              <button className="modal-close" onClick={closeDeleteModal}>
                <Icons.Close />
              </button>
            </div>
            <div style={{ padding: '20px' }}>
              <p style={{ marginBottom: '20px', color: '#4a5568' }}>
                Choisissez l'action à effectuer :
              </p>

              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#2d3748' }}>
                  <Icons.Remove style={{ marginRight: '8px' }} /> Retirer de l'inventaire
                </h4>
                <p style={{ margin: '0 0 12px 0', color: '#718096', fontSize: '0.9rem' }}>
                  Le cheval restera dans la base de données mais sera marqué comme inactif. La date
                  de fin d'activité sera définie à aujourd'hui.
                </p>
                <button
                  className="btn btn-warning"
                  onClick={handleRemoveFromInventory}
                  style={{ width: '100%' }}
                >
                  <Icons.Remove /> Retirer de l'inventaire
                </button>
              </div>

              <div
                style={{
                  borderTop: '1px solid #e2e8f0',
                  paddingTop: '20px',
                  marginTop: '20px',
                }}
              >
                <h4 style={{ margin: '0 0 8px 0', color: '#2d3748' }}>
                  <Icons.Delete style={{ marginRight: '8px' }} /> Supprimer définitivement
                </h4>
                <p style={{ margin: '0 0 12px 0', color: '#718096', fontSize: '0.9rem' }}>
                  Le cheval sera supprimé de la base de données de manière permanente. Cette action
                  ne peut pas être annulée.
                </p>
                <button
                  className="btn btn-danger"
                  onClick={handlePermanentDelete}
                  style={{ width: '100%' }}
                >
                  <Icons.Delete /> Supprimer définitivement
                </button>
              </div>

              <div style={{ marginTop: '20px' }}>
                <button
                  className="btn btn-secondary"
                  onClick={closeDeleteModal}
                  style={{ width: '100%' }}
                >
                  <Icons.Cancel style={{ marginRight: '4px' }} /> Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

HorsesList.propTypes = {};

export default HorsesList;