import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
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
  const [filter, setFilter] = useState('all'); // all, horse, pony

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

  const handleCreate = () => {
    setEditingHorse(null);
    setShowModal(true);
  };

  const handleEdit = (horse) => {
    setEditingHorse(horse);
    setShowModal(true);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer ${name} ?`)) {
      return;
    }

    try {
      await horsesApi.delete(id);
      setSuccessMessage('Cheval supprimé avec succès');
      setTimeout(() => setSuccessMessage(''), 3000);
      loadHorses();
    } catch (err) {
      setError(err.message);
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
    return <div className="loading">Chargement des chevaux...</div>;
  }

  return (
    <div className="card">
      <div className="flex-between mb-20">
        <h2>Liste des Chevaux</h2>
        <button className="btn btn-primary" onClick={handleCreate}>
          ➕ Nouveau Cheval
        </button>
      </div>

      {/* Statistics */}
      {horses.length > 0 && (
        <div className="stats-grid mb-20">
          <div className="stat-card">
            <span className="stat-number">{stats.total}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{stats.horses}</span>
            <span className="stat-label">Chevaux</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{stats.ponies}</span>
            <span className="stat-label">Poneys</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{stats.active}</span>
            <span className="stat-label">Actifs</span>
          </div>
        </div>
      )}

      {/* Filter */}
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
            🐴 Chevaux ({stats.horses})
          </button>
          <button
            className={`btn ${filter === 'pony' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('pony')}
          >
            🦄 Poneys ({stats.ponies})
          </button>
        </div>
      )}

      {error && <div className="error">{error}</div>}
      {successMessage && <div className="success">{successMessage}</div>}

      {horses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🐴</div>
          <h3>Aucun cheval enregistré</h3>
          <p>Commencez par ajouter votre premier cheval</p>
          <button className="btn btn-primary" onClick={handleCreate}>
            Créer le premier cheval
          </button>
        </div>
      ) : filteredHorses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
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
                <th>👥 Cavaliers Actifs</th>
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
                    <span className="badge badge-info">{horse.active_riders_count || 0}</span>
                  </td>
                  <td>{formatDate(horse.activity_start_date)}</td>
                  <td>{formatDate(horse.activity_end_date)}</td>
                  <td>{getStatusBadge(horse.activity_start_date, horse.activity_end_date)}</td>
                  <td className="actions">
                    <button className="btn btn-secondary" onClick={() => handleEdit(horse)}>
                      ✏️ Modifier
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(horse.id, horse.name)}
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
              <h3>{editingHorse ? '✏️ Modifier le cheval' : '➕ Nouveau cheval'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ×
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
    </div>
  );
}

// HorsesList has no props, but we include PropTypes for consistency
HorsesList.propTypes = {};

export default HorsesList;
