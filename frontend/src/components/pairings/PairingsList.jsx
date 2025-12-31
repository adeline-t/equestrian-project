import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { pairingsApi, ridersApi, horsesApi } from '../../services/api';
import PairingForm from './PairingForm';
import Portal from '../../utils/Portal';
import { Icons } from '../../utils/icons';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

function PairingsList() {
  const [pairings, setPairings] = useState([]);
  const [riders, setRiders] = useState([]);
  const [horses, setHorses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingPairing, setEditingPairing] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, inactive
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pairingToDelete, setPairingToDelete] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [pairingsData, ridersData, horsesData] = await Promise.all([
        pairingsApi.getAll(),
        ridersApi.getAll(),
        horsesApi.getAll(),
      ]);
      setPairings(pairingsData || []);
      setRiders(ridersData || []);
      setHorses(horsesData || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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

  const handleRemoveFromInventory = async () => {
    if (!pairingToDelete) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      await pairingsApi.update(pairingToDelete.id, {
        pairing_end_date: today,
      });
      setSuccessMessage(
        `Pension de ${pairingToDelete.riders?.name || 'cavalier'} sur ${
          pairingToDelete.horses?.name || 'cheval'
        } retirée de l'inventaire`
      );
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowDeleteModal(false);
      setPairingToDelete(null);
      loadData();
    } catch (err) {
      setError(err.message);
      setShowDeleteModal(false);
      setPairingToDelete(null);
    }
  };

  const handlePermanentDelete = async () => {
    if (!pairingToDelete) return;

    try {
      await pairingsApi.delete(pairingToDelete.id);
      setSuccessMessage(
        `Pension de ${pairingToDelete.riders?.name || 'cavalier'} sur ${
          pairingToDelete.horses?.name || 'cheval'
        } supprimée définitivement`
      );
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowDeleteModal(false);
      setPairingToDelete(null);
      loadData();
    } catch (err) {
      setError(err.message);
      setShowDeleteModal(false);
      setPairingToDelete(null);
    }
  };

  const handleFormSubmit = async (pairingData) => {
    try {
      if (editingPairing) {
        await pairingsApi.update(editingPairing.id, pairingData);
        setSuccessMessage('Pension modifiée avec succès');
      } else {
        await pairingsApi.create(pairingData);
        setSuccessMessage('Pension créée avec succès');
      }
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowModal(false);
      loadData();
    } catch (err) {
      throw err;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: fr });
    } catch {
      return dateString;
    }
  };

  const getKindLabel = (kind) => {
    return kind === 'horse' ? 'Cheval' : 'Poney';
  };

  const isActive = (startDate, endDate) => {
    const now = new Date();
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start && start > now) return false;
    if (end && end < now) return false;
    return true;
  };

  const getStatusBadge = (startDate, endDate) => {
    const active = isActive(startDate, endDate);
    return (
      <span className={`badge ${active ? 'badge-success' : 'badge-secondary'}`}>
        {active ? 'Actif' : 'Inactif'}
      </span>
    );
  };

  const filteredPairings = pairings.filter((pairing) => {
    if (filter === 'all') return true;
    const active = isActive(pairing.pairing_start_date, pairing.pairing_end_date);
    return filter === 'active' ? active : !active;
  });

  const stats = {
    total: pairings.length,
    active: pairings.filter((a) => isActive(a.pairing_start_date, a.pairing_end_date)).length,
    inactive: pairings.filter((a) => !isActive(a.pairing_start_date, a.pairing_end_date)).length,
  };

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

      {/* Filter */}
      {pairings.length > 0 && (
        <div className="filter-buttons mb-20">
          <button
            className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('all')}
          >
            Toutes ({stats.total})
          </button>
          <button
            className={`btn ${filter === 'active' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('active')}
          >
            <Icons.Check style={{ marginRight: '4px' }} />
            Actives ({stats.active})
          </button>
          <button
            className={`btn ${filter === 'inactive' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('inactive')}
          >
            <Icons.Close style={{ marginRight: '4px' }} />
            Inactives ({stats.inactive})
          </button>
        </div>
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
        <div className="empty-state">
          <div className="empty-state-icon">
            <Icons.Link style={{ fontSize: '64px' }} />
          </div>
          <h3>Aucune pension enregistrée</h3>
          <p>Commencez par créer la première pension entre un cavalier et un cheval</p>
          <button className="btn btn-primary" onClick={handleCreate}>
            <Icons.Add style={{ marginRight: '8px' }} />
            Créer la première pension
          </button>
        </div>
      ) : filteredPairings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Icons.List style={{ fontSize: '64px' }} />
          </div>
          <h3>Aucun résultat</h3>
          <p>Aucune pension {filter === 'active' ? 'active' : 'inactive'} trouvée</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Cavalier</th>
                <th>Cheval</th>
                <th>Type</th>
                <th>Début</th>
                <th>Fin</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPairings.map((pairing) => (
                <tr key={pairing.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {pairing.riders?.name || 'N/A'}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {pairing.horses?.name || 'N/A'}
                    </div>
                  </td>
                  <td>
                    <span className={`badge badge-${pairing.horses?.kind}`}>
                      {getKindLabel(pairing.horses?.kind)}
                    </span>
                  </td>
                  <td>{formatDate(pairing.pairing_start_date)}</td>
                  <td>{formatDate(pairing.pairing_end_date)}</td>
                  <td>{getStatusBadge(pairing.pairing_start_date, pairing.pairing_end_date)}</td>
                  <td className="actions">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleEdit(pairing)}
                    >
                      <Icons.Edit style={{ marginRight: '4px' }} />
                      Modifier
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteClick(pairing)}
                    >
                      <Icons.Delete style={{ marginRight: '4px' }} />
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
      {showDeleteModal && pairingToDelete && (
        <Portal>
          <div
            className="modal-overlay"
            onClick={() => setShowDeleteModal(false)}
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
                  <Icons.Warning style={{ marginRight: '8px', color: '#ed8936' }} />
                  Que faire avec cette pension ?
                </h3>
                <button className="modal-close" onClick={() => setShowDeleteModal(false)}>
                  <Icons.Close />
                </button>
              </div>
              <div style={{ padding: '20px' }}>
                <p style={{ marginBottom: '20px', color: '#4a5568' }}>
                  Pension de <strong>{pairingToDelete.riders?.name || 'cavalier'}</strong> sur{' '}
                  <strong>{pairingToDelete.horses?.name || 'cheval'}</strong>
                </p>
                <p style={{ marginBottom: '20px', color: '#4a5568' }}>
                  Choisissez l'action à effectuer :
                </p>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#2d3748' }}>
                    <Icons.Remove style={{ marginRight: '8px' }} />
                    Retirer de l'inventaire
                  </h4>
                  <p style={{ margin: '0 0 12px 0', color: '#718096', fontSize: '0.9rem' }}>
                    La pension restera dans la base de données mais sera marquée comme inactive. La
                    date de fin sera définie à aujourd'hui.
                  </p>
                  <button
                    className="btn btn-warning"
                    onClick={handleRemoveFromInventory}
                    style={{ width: '100%' }}
                  >
                    <Icons.Remove style={{ marginRight: '8px' }} />
                    Retirer de l'inventaire
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
                    <Icons.Delete style={{ marginRight: '8px' }} />
                    Supprimer définitivement
                  </h4>
                  <p style={{ margin: '0 0 12px 0', color: '#718096', fontSize: '0.9rem' }}>
                    La pension sera supprimée de la base de données de manière permanente. Cette
                    action ne peut pas être annulée.
                  </p>
                  <button
                    className="btn btn-danger"
                    onClick={handlePermanentDelete}
                    style={{ width: '100%' }}
                  >
                    <Icons.Delete style={{ marginRight: '8px' }} />
                    Supprimer définitivement
                  </button>
                </div>

                <div style={{ marginTop: '20px' }}>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowDeleteModal(false)}
                    style={{ width: '100%' }}
                  >
                    <Icons.Cancel style={{ marginRight: '8px' }} />
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}

PairingsList.propTypes = {};

export default PairingsList;
