import React, { useState } from 'react';
import { Icons } from '../../../lib/libraries/icons.jsx';
import Modal from '../../common/Modal';
import HorseForm from '../HorseForm';
import FilterButtons from './FilterButtons';
import HorsesTable from './HorsesTable';
import RidersModal from './RidersModal';
import EmptyState from './EmptyState';
import DeleteConfirmationModal from '../../common/DeleteConfirmationModal';
import { useHorsesList } from '../../../hooks/useHorsesList';
import { useHorseActions } from '../../../hooks/useHorseActions';
import { useHorseRiders } from '../../../hooks/useHorseRiders';
import { calculateHorseStats, filterHorsesByKind } from '../../../lib/helpers/domains/horses/stats.js';
import '../../../styles/common/modal.css';
import '../../../styles/common/alerts.css';
import '../../../styles/common/buttons.css';
import '../../../styles/components/horses.css';

function HorsesList() {
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState('all');

  // Load horses data
  const { horses, loading, error, reload } = useHorsesList();

  // Handle success messages
  const handleSuccess = (message) => {
    setSuccessMessage(message);
    setErrorMessage('');
    setTimeout(() => setSuccessMessage(''), 3000);
    reload();
  };

  // Handle errors
  const handleError = (err) => {
    const errorMsg = err?.message || 'Une erreur est survenue';
    setErrorMessage(errorMsg);
    setTimeout(() => setErrorMessage(''), 5000);
  };

  // Horse actions
  const horseActions = useHorseActions(handleSuccess);

  const handleFormSubmit = async (horseData) => {
    try {
      setErrorMessage('');
      await horseActions.handleSubmit(horseData);
    } catch (err) {
      console.error('Error submitting horse form:', err);
      handleError(err);
      throw err;
    }
  };

  const handleRemoveFromInventory = async () => {
    try {
      setErrorMessage('');
      await horseActions.handleRemoveFromInventory();
    } catch (err) {
      console.error('Error removing horse:', err);
      handleError(err);
    }
  };

  const handlePermanentDelete = async () => {
    try {
      setErrorMessage('');
      await horseActions.handlePermanentDelete();
    } catch (err) {
      console.error('Error deleting horse:', err);
      handleError(err);
    }
  };

  // Horse riders modal
  const ridersModal = useHorseRiders();

  const handleRidersClick = async (horse) => {
    try {
      setErrorMessage('');
      await ridersModal.handleRidersClick(horse);
    } catch (err) {
      console.error('Error loading riders:', err);
      handleError(err);
    }
  };

  // Calculate statistics and filter horses
  const stats = calculateHorseStats(horses);
  const filteredHorses = filterHorsesByKind(horses, filter);

  // Determine which error to display
  const displayError = errorMessage || error;

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

      {displayError && (
        <div className="alert alert-error" style={{ marginBottom: '20px' }}>
          <Icons.Warning style={{ marginRight: '8px' }} />
          {displayError}
        </div>
      )}

      {successMessage && (
        <div className="alert alert-success" style={{ marginBottom: '20px' }}>
          <Icons.Check style={{ marginRight: '8px' }} />
          {successMessage}
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
          onRidersClick={handleRidersClick}
        />
      )}

      {/* Horse Form Modal */}
      <Modal
        isOpen={horseActions.showModal}
        onClose={horseActions.closeModal}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {horseActions.editingHorse ? (
              <>
                <Icons.Edit /> Modifier le cheval
              </>
            ) : (
              <>
                <Icons.Add /> Nouveau cheval
              </>
            )}
          </div>
        }
        size="medium"
      >
        <HorseForm
          horse={horseActions.editingHorse}
          onSubmit={handleFormSubmit}
          onCancel={horseActions.closeModal}
        />
      </Modal>

      {/* Riders Modal */}
      <RidersModal
        isOpen={ridersModal.showRidersModal}
        onClose={ridersModal.closeRidersModal}
        horseRiders={ridersModal.selectedHorseRiders}
        loading={ridersModal.loadingRiders}
        error={ridersModal.error}
      />

      {/* Delete Confirmation Modal - UTILISEZ-LE DIRECTEMENT, PAS ENVELOPPÉ */}
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
