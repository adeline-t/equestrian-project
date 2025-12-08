import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { pairingsApi, ridersApi, horsesApi } from '../../services/api';
import PairingForm from './PairingForm';
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

  const handleDelete = async (id, riderName, horseName) => {
    if (
      !window.confirm(
        `Êtes-vous sûr de vouloir supprimer la DP entre ${riderName} et ${horseName} ?`
      )
    ) {
      return;
    }

    try {
      await pairingsApi.delete(id);
      setSuccessMessage('DP supprimée avec succès');
      setTimeout(() => setSuccessMessage(''), 3000);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFormSubmit = async (pairingData) => {
    try {
      if (editingPairing) {
        await pairingsApi.update(editingPairing.id, pairingData);
        setSuccessMessage('DP modifiée avec succès');
      } else {
        await pairingsApi.create(pairingData);
        setSuccessMessage('DP créée avec succès');
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
    return <div className="loading">Chargement des DP...</div>;
  }

  return (
    <div className="card">
      <div className="flex-between mb-20">
        <h2>DP</h2>
        <button className="btn btn-primary" onClick={handleCreate}>
          ➕ Nouvelle DP
        </button>
      </div>

      {/* Statistics */}
      {pairings.length > 0 && (
        <div className="stats-grid mb-20">
          <div className="stat-card">
            <span className="stat-number">{stats.total}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{stats.active}</span>
            <span className="stat-label">Actives</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{stats.inactive}</span>
            <span className="stat-label">Inactives</span>
          </div>
        </div>
      )}

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
            ✅ Actives ({stats.active})
          </button>
          <button
            className={`btn ${filter === 'inactive' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('inactive')}
          >
            ⏸️ Inactives ({stats.inactive})
          </button>
        </div>
      )}

      {error && <div className="error">{error}</div>}
      {successMessage && <div className="success">{successMessage}</div>}

      {pairings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔗</div>
          <h3>Aucune DP enregistrée</h3>
          <p>Commencez par créer la première DP entre un cavalier et un cheval</p>
          <button className="btn btn-primary" onClick={handleCreate}>
            Créer la première DP
          </button>
        </div>
      ) : filteredPairings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <h3>Aucun résultat</h3>
          <p>Aucune DP {filter === 'active' ? 'active' : 'inactive'} trouvée</p>
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
                    <strong>👤 {pairing.riders?.name || 'N/A'}</strong>
                  </td>
                  <td>
                    <strong>{pairing.horses?.name || 'N/A'}</strong>
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
                    <button className="btn btn-secondary" onClick={() => handleEdit(pairing)}>
                      ✏️ Modifier
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() =>
                        handleDelete(
                          pairing.id,
                          pairing.riders?.name || 'cavalier',
                          pairing.horses?.name || 'cheval'
                        )
                      }
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
              <h3>{editingPairing ? '✏️ Modifier la DP' : '➕ Nouvelle DP'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ×
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
      )}
    </div>
  );
}

// PairingsList has no props, but we include PropTypes for consistency
PairingsList.propTypes = {};

export default PairingsList;
