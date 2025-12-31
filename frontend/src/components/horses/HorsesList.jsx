import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Icons } from '../../utils/icons';
import { horsesApi } from '../../services/api';
import HorseForm from './HorseForm';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

function HorsesList() {
  const [horses, setHorses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingHorse, setEditingHorse] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [filter, setFilter] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [horseToDelete, setHorseToDelete] = useState(null);

  // New state for riders modal
  const [showRidersModal, setShowRidersModal] = useState(false);
  const [selectedHorseRiders, setSelectedHorseRiders] = useState(null);
  const [loadingRiders, setLoadingRiders] = useState(false);

  useEffect(() => {
    loadHorses();
  }, []);

  const loadHorses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await horsesApi.getAll();
      setHorses(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRidersClick = async (horse) => {
    if (horse.active_riders_count === 0) return;

    try {
      setLoadingRiders(true);
      setShowRidersModal(true);

      const data = await horsesApi.getRiders(horse.id);

      const ridersWithPairing = data.map((pairing) => ({
        ...pairing.riders,
        pairingId: pairing.id,
        pairingStartDate: pairing.pairing_start_date,
        pairingEndDate: pairing.pairing_end_date,
      }));

      setSelectedHorseRiders({
        horseName: horse.name,
        riders: ridersWithPairing || [],
      });
    } catch (err) {
      console.error('Error loading riders:', err);
      setError('Erreur lors du chargement des cavaliers');
      setShowRidersModal(false);
    } finally {
      setLoadingRiders(false);
    }
  };

  const handleCreate = () => {
    setEditingHorse(null);
    setShowModal(true);
  };

  const handleEdit = (horse) => {
    setEditingHorse(horse);
    setShowModal(true);
  };

  const handleDeleteClick = (horse) => {
    setHorseToDelete(horse);
    setShowDeleteModal(true);
  };

  const handleRemoveFromInventory = async () => {
    if (!horseToDelete) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      await horsesApi.update(horseToDelete.id, {
        activity_end_date: today,
      });
      setSuccessMessage(`${horseToDelete.name} a été retiré de l'inventaire`);
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowDeleteModal(false);
      setHorseToDelete(null);
      loadHorses();
    } catch (err) {
      setError(err.message);
      setShowDeleteModal(false);
      setHorseToDelete(null);
    }
  };

  const handlePermanentDelete = async () => {
    if (!horseToDelete) return;

    try {
      await horsesApi.delete(horseToDelete.id);
      setSuccessMessage(`${horseToDelete.name} a été supprimé définitivement`);
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowDeleteModal(false);
      setHorseToDelete(null);
      loadHorses();
    } catch (err) {
      setError(err.message);
      setShowDeleteModal(false);
      setHorseToDelete(null);
    }
  };

  const handleFormSubmit = async (horseData) => {
    try {
      if (editingHorse) {
        await horsesApi.update(editingHorse.id, horseData);
        setSuccessMessage('Cheval modifié avec succès');
      } else {
        await horsesApi.create(horseData);
        setSuccessMessage('Cheval créé avec succès');
      }
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowModal(false);
      loadHorses();
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

  const getKindLabel = (kind) => {
    return kind === 'horse' ? 'Cheval' : 'Poney';
  };

  const getOwnershipLabel = (ownership) => {
    return `${ownership}`;
  };

  const filteredHorses = horses.filter((horse) => {
    if (filter === 'all') return true;
    return horse.kind === filter;
  });

  const stats = {
    total: horses.length,
    horses: horses.filter((h) => h.kind === 'horse').length,
    ponies: horses.filter((h) => h.kind === 'pony').length,
    active: horses.filter((h) => isActive(h.activity_start_date, h.activity_end_date)).length,
  };

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
        <div className="filter-buttons mb-20">
          <button
            className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('all')}
          >
            Tous ({stats.total})
          </button>
          <button
            className={`btn ${filter === 'horse' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('horse')}
          >
            Chevaux ({stats.horses})
          </button>
          <button
            className={`btn ${filter === 'pony' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('pony')}
          >
            Poneys ({stats.ponies})
          </button>
        </div>
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
        <div className="empty-state">
          <div className="empty-state-icon">
            <Icons.Horse style={{ fontSize: '64px' }} />
          </div>
          <h3>Aucun cheval enregistré</h3>
          <p>Commencez par ajouter votre premier cheval</p>
          <button className="btn btn-primary" onClick={handleCreate}>
            <Icons.Add /> Créer le premier cheval
          </button>
        </div>
      ) : filteredHorses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Icons.List style={{ fontSize: '64px' }} />
          </div>
          <h3>Aucun résultat</h3>
          <p>Aucun {filter === 'horse' ? 'cheval' : 'poney'} trouvé avec ce filtre</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Type</th>
                <th>Propriétaire</th>
                <th>Cavaliers Actifs</th>
                <th>Début d'activité</th>
                <th>Fin d'activité</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredHorses.map((horse) => (
                <tr key={horse.id}>
                  <td>
                    <strong>{horse.name}</strong>
                  </td>
                  <td>
                    <span className={`badge badge-${horse.kind}`}>{getKindLabel(horse.kind)}</span>
                  </td>
                  <td>
                    <span className="badge badge-info">{getOwnershipLabel(horse.is_owned_by)}</span>
                  </td>
                  <td>
                    <span
                      className={`badge badge-info ${
                        horse.active_riders_count > 0 ? 'clickable' : ''
                      }`}
                      onClick={() => handleRidersClick(horse)}
                      style={{
                        cursor: horse.active_riders_count > 0 ? 'pointer' : 'default',
                        userSelect: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                      title={horse.active_riders_count > 0 ? 'Cliquez pour voir les cavaliers' : ''}
                    >
                      <Icons.Users style={{ fontSize: '0.875rem' }} />
                      {horse.active_riders_count || 0}
                    </span>
                  </td>
                  <td>{formatDate(horse.activity_start_date)}</td>
                  <td>{formatDate(horse.activity_end_date)}</td>
                  <td>{getStatusBadge(horse.activity_start_date, horse.activity_end_date)}</td>
                  <td className="actions">
                    <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(horse)}>
                      <Icons.Edit /> Modifier
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteClick(horse)}
                    >
                      <Icons.Delete /> Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
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
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <Icons.Close />
              </button>
            </div>
            <HorseForm
              horse={editingHorse}
              onSubmit={handleFormSubmit}
              onCancel={() => setShowModal(false)}
            />
          </div>
        </div>
      )}

      {/* Riders Modal */}
      {showRidersModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowRidersModal(false)}
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
              maxWidth: '600px',
              width: '90%',
            }}
          >
            <div className="modal-header">
              <h3>
                <Icons.Users style={{ marginRight: '8px' }} />
                Cavaliers de {selectedHorseRiders?.horseName}
              </h3>
              <button className="modal-close" onClick={() => setShowRidersModal(false)}>
                <Icons.Close />
              </button>
            </div>
            <div style={{ padding: '20px' }}>
              {loadingRiders ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <Icons.Loading
                    className="spin"
                    style={{ fontSize: '32px', marginBottom: '12px' }}
                  />
                  <div className="loading">Chargement des cavaliers...</div>
                </div>
              ) : selectedHorseRiders?.riders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: '#718096' }}>
                  <Icons.Users style={{ fontSize: '48px', marginBottom: '12px' }} />
                  <p>Aucun cavalier actif pour ce cheval</p>
                </div>
              ) : (
                <div>
                  <p
                    style={{
                      marginBottom: '16px',
                      color: '#4a5568',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <Icons.Info />
                    {selectedHorseRiders?.riders.length} cavalier(s) actif(s)
                  </p>
                  <ul
                    style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: 0,
                      maxHeight: '400px',
                      overflowY: 'auto',
                    }}
                  >
                    {selectedHorseRiders?.riders.map((rider, index) => (
                      <li
                        key={rider.id || index}
                        style={{
                          padding: '12px 16px',
                          borderBottom: '1px solid #e2e8f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <Icons.User style={{ marginRight: '12px', color: '#4299e1' }} />
                          <div style={{ fontWeight: '500', color: '#2d3748' }}>{rider.name}</div>
                        </div>
                        {rider.level && (
                          <span className="badge badge-secondary">{rider.level}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div style={{ marginTop: '20px' }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowRidersModal(false)}
                  style={{ width: '100%' }}
                >
                  <Icons.Close style={{ marginRight: '4px' }} /> Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && horseToDelete && (
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
                <Icons.Warning style={{ marginRight: '8px', color: '#ed8936' }} /> Que faire avec{' '}
                {horseToDelete.name} ?
              </h3>
              <button className="modal-close" onClick={() => setShowDeleteModal(false)}>
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
                  onClick={() => setShowDeleteModal(false)}
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
