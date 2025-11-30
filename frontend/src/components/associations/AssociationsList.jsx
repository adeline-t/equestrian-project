import React, { useState, useEffect } from 'react';
import { associationsApi, ridersApi, horsesApi } from '../../services/api';
import AssociationForm from './AssociationForm';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

function AssociationsList() {
  const [associations, setAssociations] = useState([]);
  const [riders, setRiders] = useState([]);
  const [horses, setHorses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingAssociation, setEditingAssociation] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, inactive

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [associationsData, ridersData, horsesData] = await Promise.all([
        associationsApi.getAll(),
        ridersApi.getAll(),
        horsesApi.getAll(),
      ]);
      setAssociations(associationsData || []);
      setRiders(ridersData || []);
      setHorses(horsesData || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingAssociation(null);
    setShowModal(true);
  };

  const handleEdit = (association) => {
    setEditingAssociation(association);
    setShowModal(true);
  };

  const handleDelete = async (id, riderName, horseName) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer l'association entre ${riderName} et ${horseName} ?`)) {
      return;
    }

    try {
      await associationsApi.delete(id);
      setSuccessMessage('Association supprimée avec succès');
      setTimeout(() => setSuccessMessage(''), 3000);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFormSubmit = async (associationData) => {
    try {
      if (editingAssociation) {
        await associationsApi.update(editingAssociation.id, associationData);
        setSuccessMessage('Association modifiée avec succès');
      } else {
        await associationsApi.create(associationData);
        setSuccessMessage('Association créée avec succès');
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

  const getKindEmoji = (kind) => {
    return kind === 'horse' ? '🐴' : '🦄';
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

  const filteredAssociations = associations.filter(association => {
    if (filter === 'all') return true;
    const active = isActive(association.association_start_date, association.association_end_date);
    return filter === 'active' ? active : !active;
  });

  const stats = {
    total: associations.length,
    active: associations.filter(a => isActive(a.association_start_date, a.association_end_date)).length,
    inactive: associations.filter(a => !isActive(a.association_start_date, a.association_end_date)).length,
  };

  if (loading) {
    return <div className="loading">Chargement des associations...</div>;
  }

  return (
    <div className="card">
      <div className="flex-between mb-20">
        <h2>Associations Cavalier-Cheval</h2>
        <button className="btn btn-primary" onClick={handleCreate}>
          ➕ Nouvelle Association
        </button>
      </div>

      {/* Statistics */}
      {associations.length > 0 && (
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
      {associations.length > 0 && (
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

      {associations.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔗</div>
          <h3>Aucune association enregistrée</h3>
          <p>Commencez par créer la première association entre un cavalier et un cheval</p>
          <button className="btn btn-primary" onClick={handleCreate}>
            Créer la première association
          </button>
        </div>
      ) : filteredAssociations.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <h3>Aucun résultat</h3>
          <p>Aucune association {filter === 'active' ? 'active' : 'inactive'} trouvée</p>
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
              {filteredAssociations.map((association) => (
                <tr key={association.id}>
                  <td>
                    <strong>👤 {association.riders?.name || 'N/A'}</strong>
                  </td>
                  <td>
                    <strong>
                      {getKindEmoji(association.horses?.kind)} {association.horses?.name || 'N/A'}
                    </strong>
                  </td>
                  <td>
                    <span className={`badge badge-${association.horses?.kind}`}>
                      {getKindLabel(association.horses?.kind)}
                    </span>
                  </td>
                  <td>{formatDate(association.association_start_date)}</td>
                  <td>{formatDate(association.association_end_date)}</td>
                  <td>
                    {getStatusBadge(association.association_start_date, association.association_end_date)}
                  </td>
                  <td className="actions">
                    <button 
                      className="btn btn-secondary" 
                      onClick={() => handleEdit(association)}
                    >
                      ✏️ Modifier
                    </button>
                    <button 
                      className="btn btn-danger" 
                      onClick={() => handleDelete(
                        association.id, 
                        association.riders?.name || 'cavalier',
                        association.horses?.name || 'cheval'
                      )}
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
                {editingAssociation ? '✏️ Modifier l\'association' : '➕ Nouvelle association'}
              </h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <AssociationForm
              association={editingAssociation}
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

export default AssociationsList;