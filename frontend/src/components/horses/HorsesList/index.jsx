import { useState } from 'react';
import { useHorseActions } from '../../../hooks/useHorseActions';
import { useHorseRiders } from '../../../hooks/useHorseRiders';
import { useHorsesList } from '../../../hooks/useHorsesList';
import {
  calculateHorseStats,
  filterHorsesByKind,
} from '../../../lib/helpers/domains/horses/stats.js';
import { Icons } from '../../../lib/icons';
import '../../../styles/index.css';
import DeleteConfirmationModal from '../../common/DeleteConfirmationModal';
import Modal from '../../common/Modal';
import HorseForm from '../HorseForm';
import FilterButtons from './FilterButtons';
import HorsesTable from './HorsesTable';
import RidersModal from './RidersModal';

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

  // Clear messages
  const clearError = () => {
    setErrorMessage('');
  };

  // Loading state
  if (loading) {
    return (
      <div className="loading">
        <Icons.Loading className="spin" /> Chargement des chevaux...
      </div>
    );
  }

  return (
    <div className="card-enhanced">
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

      {horses.length === 0 ? (
        <div className="empty-state" style={{ textAlign: 'center', padding: '40px' }}>
          <Icons.Horse style={{ fontSize: '48px', color: '#ccc', marginBottom: '16px' }} />
          <p>Aucun cheval trouvé</p>
          <button className="btn btn-primary mt-20" onClick={horseActions.handleCreate}>
            <Icons.Add /> Ajouter un cheval
          </button>
        </div>
      ) : filteredHorses.length === 0 ? (
        <div className="empty-state" style={{ textAlign: 'center', padding: '40px' }}>
          <Icons.Filter style={{ fontSize: '48px', color: '#ccc', marginBottom: '16px' }} />
          <p>Aucun cheval ne correspond au filtre sélectionné</p>
        </div>
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
