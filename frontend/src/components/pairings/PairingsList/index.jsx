import React, { useState } from 'react';
import Portal from '../../../components/common/Portal';
import { Icons } from '../../../lib/libraries/icons.jsx';
import { pairingsApi } from '../../../services/api';
import PairingForm from '../PairingForm';
import PairingsFilterButtons from './PairingsFilterButtons';
import PairingsTable from './PairingsTable';
import PairingsEmptyState from './PairingsEmptyState';
import PairingDeleteModal from './PairingDeleteModal';
import { usePairingsList } from '../../../hooks/usePairingsList';
import { calculatePairingStats, filterPairingsByStatus } from '../../../utils/pairingStats';
import '../../../styles/common/modal.css';
import '../../../styles/common/alerts.css';
import '../../../styles/common/buttons.css';
import './PairingsList.css';

function PairingsList() {
  const [successMessage, setSuccessMessage] = useState('');
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingPairing, setEditingPairing] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pairingToDelete, setPairingToDelete] = useState(null);

  // Load pairings data
  const { pairings, riders, horses, loading, error, reload, setError } = usePairingsList();

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

  // CRUD operations
  const handleCreate = () => {
    setEditingPairing(null);
    setShowModal(true);
  };

  const handleEdit = (pairing) => {
    setEditingPairing(pairing);
    setShowModal(true);
  };

  const handleDeleteClick = (pairing) => {
    setPairingToDelete(pairing);
    setShowDeleteModal(true);
  };

  const handleFormSubmit = async (pairingData) => {
    try {
      if (editingPairing) {
        await pairingsApi.update(editingPairing.id, pairingData);
        handleSuccess('Pension modifiée avec succès');
      } else {
        await pairingsApi.create(pairingData);
        handleSuccess('Pension créée avec succès');
      }
      setShowModal(false);
    } catch (err) {
      handleError(err);
      throw err;
    }
  };

  const handleRemoveFromInventory = async () => {
    if (!pairingToDelete) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      await pairingsApi.update(pairingToDelete.id, {
        pairing_end_date: today,
      });
      handleSuccess(
        `Pension de ${pairingToDelete.riders?.name || 'cavalier'} sur ${
          pairingToDelete.horses?.name || 'cheval'
        } retirée de l'inventaire`
      );
      setShowDeleteModal(false);
      setPairingToDelete(null);
    } catch (err) {
      handleError(err);
      setShowDeleteModal(false);
      setPairingToDelete(null);
    }
  };

  const handlePermanentDelete = async () => {
    if (!pairingToDelete) return;

    try {
      await pairingsApi.delete(pairingToDelete.id);
      handleSuccess(
        `Pension de ${pairingToDelete.riders?.name || 'cavalier'} sur ${
          pairingToDelete.horses?.name || 'cheval'
        } supprimée définitivement`
      );
      setShowDeleteModal(false);
      setPairingToDelete(null);
    } catch (err) {
      handleError(err);
      setShowDeleteModal(false);
      setPairingToDelete(null);
    }
  };

  // Calculate statistics and filter pairings
  const stats = calculatePairingStats(pairings);
  const filteredPairings = filterPairingsByStatus(pairings, filter);

  // Loading state
  if (loading) {
    return (
      <div className="loading">
        <Icons.Loading className="spin" style={{ marginRight: '8px' }} />
        Chargement des pensions...
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex-between mb-20">
        <h2>
          <Icons.Link style={{ marginRight: '8px' }} />
          Pensions
        </h2>
        <button className="btn btn-primary" onClick={handleCreate}>
          <Icons.Add style={{ marginRight: '8px' }} />
          Nouvelle pension
        </button>
      </div>

      {pairings.length > 0 && (
        <PairingsFilterButtons filter={filter} stats={stats} onFilterChange={setFilter} />
      )}

      {error && (
        <div className="error">
          <Icons.Warning style={{ marginRight: '8px' }} />
          {error}
        </div>
      )}
      {successMessage && (
        <div className="success">
          <Icons.Check style={{ marginRight: '8px' }} />
          {successMessage}
        </div>
      )}

      {pairings.length === 0 ? (
        <PairingsEmptyState type="no-pairings" onCreate={handleCreate} />
      ) : filteredPairings.length === 0 ? (
        <PairingsEmptyState type="no-results" filter={filter} />
      ) : (
        <PairingsTable
          pairings={filteredPairings}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      )}

      {/* Form Modal */}
      {showModal && (
        <Portal>
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>
                  {editingPairing ? (
                    <>
                      <Icons.Edit style={{ marginRight: '8px' }} />
                      Modifier la pension
                    </>
                  ) : (
                    <>
                      <Icons.Add style={{ marginRight: '8px' }} />
                      Nouvelle pension
                    </>
                  )}
                </h3>
                <button className="modal-close" onClick={() => setShowModal(false)}>
                  <Icons.Close />
                </button>
              </div>
              <PairingForm
                pairing={editingPairing}
                riders={riders}
                horses={horses}
                onSubmit={handleFormSubmit}
                onCancel={() => setShowModal(false)}
              />
            </div>
          </div>
        </Portal>
      )}

      {/* Delete Modal */}
      <PairingDeleteModal
        isOpen={showDeleteModal}
        pairing={pairingToDelete}
        onClose={() => setShowDeleteModal(false)}
        onRemove={handleRemoveFromInventory}
        onDelete={handlePermanentDelete}
      />
    </div>
  );
}

export default PairingsList;
