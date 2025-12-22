import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ridersApi } from '../../services/api';
import RiderForm from './RiderForm';
import RiderCard from './RiderCard';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

function RidersList() {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingRider, setEditingRider] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedRiderId, setSelectedRiderId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [riderToDelete, setRiderToDelete] = useState(null);

  useEffect(() => {
    loadRiders();
  }, []);

  const loadRiders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ridersApi.getAll();
      setRiders(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingRider(null);
    setShowModal(true);
  };

  const handleEdit = (rider) => {
    setEditingRider(rider);
    setShowModal(true);
  };

  const handleViewDetails = (riderId) => {
    setSelectedRiderId(riderId);
  };

  const handleDeleteClick = (rider) => {
    setRiderToDelete(rider);
    setShowDeleteModal(true);
  };

  const handleRemoveFromInventory = async () => {
    if (!riderToDelete) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      await ridersApi.update(riderToDelete.id, {
        activity_end_date: today,
      });
      setSuccessMessage(`${riderToDelete.name} a été retiré de l'inventaire`);
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowDeleteModal(false);
      setRiderToDelete(null);
      loadRiders();
    } catch (err) {
      setError(err.message);
      setShowDeleteModal(false);
      setRiderToDelete(null);
    }
  };

  const handlePermanentDelete = async () => {
    if (!riderToDelete) return;

    try {
      await ridersApi.delete(riderToDelete.id);
      setSuccessMessage(`${riderToDelete.name} a été supprimé définitivement`);
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowDeleteModal(false);
      setRiderToDelete(null);
      loadRiders();
    } catch (err) {
      setError(err.message);
      setShowDeleteModal(false);
      setRiderToDelete(null);
    }
  };

  const handleFormSubmit = async (riderData) => {
    try {
      if (editingRider) {
        await ridersApi.update(editingRider.id, riderData);
        setSuccessMessage('Cavalier modifié avec succès');
      } else {
        await ridersApi.create(riderData);
        setSuccessMessage('Cavalier créé avec succès');
      }
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowModal(false);
      loadRiders();
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

  if (loading) {
    return <div className="loading">Chargement des cavaliers...</div>;
  }

  return (
    <div className="card">
      <div className="flex-between">
        <h2>Liste des Cavaliers</h2>
        <button className="btn btn-primary" onClick={handleCreate}>
          ➕ Nouveau Cavalier
        </button>
      </div>

      {error && <div className="error">{error}</div>}
      {successMessage && <div className="success">{successMessage}</div>}

      {riders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">👤</div>
          <h3>Aucun cavalier enregistré</h3>
          <p>Commencez par ajouter votre premier cavalier</p>
          <button className="btn btn-primary" onClick={handleCreate}>
            Créer le premier cavalier
          </button>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Téléphone</th>
                <th>Email</th>
                <th>🐴 Chevaux Actifs</th>
                <th>📦 Forfaits Actifs</th>
                <th>🎓 Cours Privés par semaine</th>
                <th>👥 Cours Collectifs par semaine</th>
                <th>Début</th>
                <th>Fin</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {riders.map((rider) => (
                <tr key={rider.id}>
                  <td>
                    <strong>{rider.name}</strong>
                  </td>
                  <td>{rider.phone || '-'}</td>
                  <td>{rider.email || '-'}</td>
                  <td>
                    <span className="badge badge-info">{rider.active_horses_count || 0}</span>
                  </td>
                  <td>
                    <span className="badge badge-info">{rider.active_packages_count || 0}</span>
                  </td>
                  <td>
                    <span className="badge badge-primary">{rider.private_lessons_count || 0}</span>
                  </td>
                  <td>
                    <span className="badge badge-primary">{rider.joint_lessons_count || 0}</span>
                  </td>
                  <td>{formatDate(rider.activity_start_date)}</td>
                  <td>{formatDate(rider.activity_end_date)}</td>
                  <td>{getStatusBadge(rider.activity_start_date, rider.activity_end_date)}</td>
                  <td className="actions">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleViewDetails(rider.id)}
                      title="Voir les détails"
                    >
                      👁️ Détails
                    </button>
                    <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(rider)}>
                      ✏️ Modifier
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteClick(rider)}
                    >
                      🗑️ Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowModal(false)}
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
              <h3>{editingRider ? '✏️ Modifier le cavalier' : '➕ Nouveau cavalier'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <RiderForm
              rider={editingRider}
              onSubmit={handleFormSubmit}
              onCancel={() => setShowModal(false)}
            />
          </div>
        </div>
      )}

      {showDeleteModal && riderToDelete && (
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
              <h3>⚠️ Que faire avec {riderToDelete.name} ?</h3>
              <button className="modal-close" onClick={() => setShowDeleteModal(false)}>
                ×
              </button>
            </div>
            <div style={{ padding: '20px' }}>
              <p style={{ marginBottom: '20px', color: '#4a5568' }}>
                Choisissez l'action à effectuer :
              </p>

              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#2d3748' }}>
                  📤 Retirer de l'inventaire
                </h4>
                <p style={{ margin: '0 0 12px 0', color: '#718096', fontSize: '0.9rem' }}>
                  Le cavalier restera dans la base de données mais sera marqué comme inactif. La
                  date de fin d'activité sera définie à aujourd'hui.
                </p>
                <button
                  className="btn btn-warning"
                  onClick={handleRemoveFromInventory}
                  style={{ width: '100%' }}
                >
                  📤 Retirer de l'inventaire
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
                  🗑️ Supprimer définitivement
                </h4>
                <p style={{ margin: '0 0 12px 0', color: '#718096', fontSize: '0.9rem' }}>
                  Le cavalier sera supprimé de la base de données de manière permanente. Cette
                  action ne peut pas être annulée.
                </p>
                <button
                  className="btn btn-danger"
                  onClick={handlePermanentDelete}
                  style={{ width: '100%' }}
                >
                  🗑️ Supprimer définitivement
                </button>
              </div>

              <div style={{ marginTop: '20px' }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                  style={{ width: '100%' }}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedRiderId && (
        <RiderCard
          riderId={selectedRiderId}
          onClose={() => {
            setSelectedRiderId(null);
            loadRiders();
          }}
        />
      )}
    </div>
  );
}

// RidersList has no props, but we include PropTypes for consistency
RidersList.propTypes = {};

export default RidersList;
