import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { packagesApi } from '../../services/api';
import PackageForm from './PackageForm';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import './package.css';

function PackagesList() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, inactive

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await packagesApi.getAll();
      setPackages(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingPackage(null);
    setShowModal(true);
  };

  const handleEdit = (pkg) => {
    setEditingPackage(pkg);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce forfait ?')) {
      return;
    }

    try {
      await packagesApi.delete(id);
      setSuccessMessage('Forfait supprimé avec succès');
      setTimeout(() => setSuccessMessage(''), 3000);
      loadPackages();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFormSubmit = async (packageData) => {
    try {
      if (editingPackage) {
        await packagesApi.update(editingPackage.id, packageData);
        setSuccessMessage('Forfait modifié avec succès');
      } else {
        await packagesApi.create(packageData);
        setSuccessMessage('Forfait créé avec succès');
      }
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowModal(false);
      loadPackages();
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

  const filteredPackages = packages.filter((pkg) => {
    if (filter === 'all') return true;
    const active = isActive(pkg.activity_start_date, pkg.activity_end_date);
    return filter === 'active' ? active : !active;
  });

  const stats = {
    total: packages.length,
    active: packages.filter((pkg) => isActive(pkg.activity_start_date, pkg.activity_end_date))
      .length,
    inactive: packages.filter((pkg) => !isActive(pkg.activity_start_date, pkg.activity_end_date))
      .length,
    totalPrivateLessons: packages.reduce((sum, pkg) => sum + (pkg.private_lesson_count || 0), 0),
    totalJointLessons: packages.reduce((sum, pkg) => sum + (pkg.joint_lesson_count || 0), 0),
  };

  if (loading) {
    return <div className="loading">Chargement des forfaits...</div>;
  }

  return (
    <div className="card">
      <div className="flex-between mb-20">
        <h2>📦 Liste des Forfaits</h2>
        <button className="btn btn-primary" onClick={handleCreate}>
          ➕ Nouveau Forfait
        </button>
      </div>

      {/* Statistics */}
      {packages.length > 0 && (
        <div className="stats-grid mb-20">
          <div className="stat-card">
            <span className="stat-number">{stats.total}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{stats.active}</span>
            <span className="stat-label">Actifs</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{stats.inactive}</span>
            <span className="stat-label">Inactifs</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{stats.totalPrivateLessons}</span>
            <span className="stat-label">🎓 Cours Privés</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{stats.totalJointLessons}</span>
            <span className="stat-label">👥 Cours Collectifs</span>
          </div>
        </div>
      )}

      {/* Filter */}
      {packages.length > 0 && (
        <div className="filter-buttons mb-20">
          <button
            className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('all')}
          >
            Tous ({stats.total})
          </button>
          <button
            className={`btn ${filter === 'active' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('active')}
          >
            ✅ Actifs ({stats.active})
          </button>
          <button
            className={`btn ${filter === 'inactive' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('inactive')}
          >
            ⏸️ Inactifs ({stats.inactive})
          </button>
        </div>
      )}

      {successMessage && <div className="alert alert-success mb-20">{successMessage}</div>}

      {error && <div className="alert alert-error mb-20">{error}</div>}

      {packages.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📦</div>
          <h3>Aucun forfait enregistré</h3>
          <p>Commencez par créer le premier forfait</p>
          <button className="btn btn-primary" onClick={handleCreate}>
            ➕ Créer le premier forfait
          </button>
        </div>
      ) : filteredPackages.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <h3>Aucun résultat</h3>
          <p>Aucun forfait {filter === 'active' ? 'actif' : 'inactif'} trouvé</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>🎓 Cours Privés</th>
                <th>👥 Cours Collectifs</th>
                <th>📅 Début d'activité</th>
                <th>📅 Fin d'activité</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPackages.map((pkg) => (
                <tr key={pkg.id}>
                  <td>
                    <strong>#{pkg.id}</strong>
                  </td>
                  <td>
                    <span className="badge badge-info">{pkg.private_lesson_count || 0}</span>
                  </td>
                  <td>
                    <span className="badge badge-info">{pkg.joint_lesson_count || 0}</span>
                  </td>
                  <td>{formatDate(pkg.activity_start_date)}</td>
                  <td>{formatDate(pkg.activity_end_date)}</td>
                  <td>{getStatusBadge(pkg.activity_start_date, pkg.activity_end_date)}</td>
                  <td className="actions">
                    <button className="btn btn-sm btn-secondary" onClick={() => handleEdit(pkg)}>
                      ✏️ Modifier
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(pkg.id)}>
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
        <PackageForm
          package={editingPackage}
          onSubmit={handleFormSubmit}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

PackagesList.propTypes = {};

export default PackagesList;
