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

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer ${name} ?`)) {
      return;
    }

    try {
      await ridersApi.delete(id);
      setSuccessMessage('Cavalier supprimé avec succès');
      setTimeout(() => setSuccessMessage(''), 3000);
      loadRiders();
    } catch (err) {
      setError(err.message);
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
                <th>🎓 Cours Privés</th>
                <th>👥 Cours Collectifs</th>
                <th>Début d'activité</th>
                <th>Fin d'activité</th>
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
                    <span className="badge badge-info">
                      {rider.active_horses_count || 0}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-info">
                      {rider.active_packages_count || 0}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-primary">
                      {rider.private_lessons_count || 0}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-primary">
                      {rider.joint_lessons_count || 0}
                    </span>
                  </td>
                  <td>{formatDate(rider.activity_start_date)}</td>
                  <td>{formatDate(rider.activity_end_date)}</td>
                  <td>
                    {getStatusBadge(rider.activity_start_date, rider.activity_end_date)}
                  </td>
                  <td className="actions">
                    <button 
                      className="btn btn-primary btn-sm" 
                      onClick={() => handleViewDetails(rider.id)}
                      title="Voir les détails"
                    >
                      👁️ Détails
                    </button>
                    <button 
                      className="btn btn-secondary btn-sm" 
                      onClick={() => handleEdit(rider)}
                    >
                      ✏️ Modifier
                    </button>
                    <button 
                      className="btn btn-danger btn-sm" 
                      onClick={() => handleDelete(rider.id, rider.name)}
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
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {editingRider ? '✏️ Modifier le cavalier' : '➕ Nouveau cavalier'}
              </h3>
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
