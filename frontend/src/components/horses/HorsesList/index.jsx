import React, { useState } from 'react';
import { Icons } from '../../../lib/libraries/icons.jsx';
import HorseForm from '../HorseForm';
import FilterButtons from './FilterButtons';
import HorsesTable from './HorsesTable';
import RidersModal from './RidersModal';
import EmptyState from './EmptyState';
import DeleteConfirmationModal from '../../riders/RiderCard/DeleteConfirmationModal';
import { useHorsesList } from '../../../hooks/useHorsesList';
import { useHorseActions } from '../../../hooks/useHorseActions';
import { useHorseRiders } from '../../../hooks/useHorseRiders';
import { calculateHorseStats, filterHorsesByKind } from '../../../utils/horseStats';
import '../../../styles/common/modal.css';
import '../../../styles/common/alerts.css';
import '../../../styles/common/buttons.css';
import './HorsesList.css';

function HorsesList() {
  const [successMessage, setSuccessMessage] = useState('');
  const [filter, setFilter] = useState('all');

  // Load horses data
  const { horses, loading, error, reload, setError } = useHorsesList();

  // Handle success messages
  const handleSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
    reload();
  };

  // Handle errors
  const handleError = (err) => {
    setError(err.message);
    setTimeout(() => setError(null), 5000);
  };

  // Horse actions
  const horseActions = useHorseActions(handleSuccess);

  const handleFormSubmit = async (horseData) => {
    try {
      await horseActions.handleSubmit(horseData);
    } catch (err) {
      handleError(err);
      throw err;
    }
  };

  const handleRemoveFromInventory = async () => {
    try {
      await horseActions.handleRemoveFromInventory();
    } catch (err) {
      handleError(err);
    }
  };

  const handlePermanentDelete = async () => {
    try {
      await horseActions.handlePermanentDelete();
    } catch (err) {
      handleError(err);
    }
  };

  // Horse riders modal
  const ridersModal = useHorseRiders();

  // Calculate statistics and filter horses
  const stats = calculateHorseStats(horses);
  const filteredHorses = filterHorsesByKind(horses, filter);

  // Loading state
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
        <button className="btn btn-primary" onClick={horseActions.handleCreate}>
          <Icons.Add /> Nouveau Cheval
        </button>
      </div>

      {horses.length > 0 && (
        <FilterButtons filter={filter} stats={stats} onFilterChange={setFilter} />
      )}

      {error && (
        <div className="error">
          <Icons.Warning /> {error}
        </div>
      )}
      {successMessage && (
        <div className="success">
          <Icons.Check /> {successMessage}
        </div>
      )}

      {horses.length === 0 ? (
        <EmptyState type="no-horses" onCreate={horseActions.handleCreate} />
      ) : filteredHorses.length === 0 ? (
        <EmptyState type="no-results" filter={filter} />
      ) : (
        <HorsesTable
          horses={filteredHorses}
          onEdit={horseActions.handleEdit}
          onDelete={horseActions.handleDeleteClick}
          onRidersClick={ridersModal.handleRidersClick}
        />
      )}

      {/* Horse Form Modal */}
      {horseActions.showModal && (
        <div className="modal-overlay" onClick={horseActions.closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {horseActions.editingHorse ? (
                  <>
                    <Icons.Edit style={{ marginRight: '8px' }} /> Modifier le cheval
                  </>
                ) : (
                  <>
                    <Icons.Add style={{ marginRight: '8px' }} /> Nouveau cheval
                  </>
                )}
              </h3>
              <button className="modal-close" onClick={horseActions.closeModal}>
                <Icons.Close />
              </button>
            </div>
            <HorseForm
              horse={horseActions.editingHorse}
              onSubmit={handleFormSubmit}
              onCancel={horseActions.closeModal}
            />
          </div>
        </div>
      )}

      {/* Riders Modal */}
      <RidersModal
        isOpen={ridersModal.showRidersModal}
        onClose={ridersModal.closeRidersModal}
        horseRiders={ridersModal.selectedHorseRiders}
        loading={ridersModal.loadingRiders}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={horseActions.showDeleteModal}
        onClose={horseActions.closeDeleteModal}
        onRemoveFromInventory={handleRemoveFromInventory}
        onPermanentDelete={handlePermanentDelete}
        itemType="cheval"
        itemName={horseActions.horseToDelete?.name}
      />
    </div>
  );
}

export default HorsesList;
