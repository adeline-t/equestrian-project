import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ridersApi, packagesApi } from '../../services/api';
import PackageForm from '../packages/PackageForm';
import Portal from '../../utils/Portal';
import { Icons } from '../../utils/icons';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

function RiderPackages({ riderId, riderName }) {
  const [packages, setPackages] = useState([]);
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState(null);

  useEffect(() => {
    loadPackages();
    loadRiders();
  }, [riderId]);

  const loadPackages = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ridersApi.getPackages(riderId);
      setPackages(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadRiders = async () => {
    try {
      const data = await ridersApi.getAll();
      setRiders(data || []);
    } catch (err) {
      console.error('Error loading riders:', err);
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

  const handleDeleteClick = (pkg) => {
    setPackageToDelete(pkg);
    setShowDeleteModal(true);
  };

  const handleRemoveFromInventory = async () => {
    if (!packageToDelete) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      await packagesApi.update(packageToDelete.id, {
        activity_end_date: today,
      });
      setSuccessMessage("Forfait retiré de l'inventaire");
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowDeleteModal(false);
      setPackageToDelete(null);
      loadPackages();
    } catch (err) {
      setError(err.message);
      setShowDeleteModal(false);
      setPackageToDelete(null);
    }
  };

  const handlePermanentDelete = async () => {
    if (!packageToDelete) return;

    try {
      await packagesApi.delete(packageToDelete.id);
      setSuccessMessage('Forfait supprimé définitivement');
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowDeleteModal(false);
      setPackageToDelete(null);
      loadPackages();
    } catch (err) {
      setError(err.message);
      setShowDeleteModal(false);
      setPackageToDelete(null);
    }
  };

  const handleFormSubmit = async (packageData) => {
    try {
      if (editingPackage) {
        await packagesApi.update(editingPackage.id, packageData);
        setSuccessMessage('Forfait modifié avec succès');
      } else {
        await packagesApi.createForRider(riderId, packageData);
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

  const stats = {
    total: packages.length,
    active: packages.filter((pkg) => isActive(pkg.activity_start_date, pkg.activity_end_date))
      .length,
    totalPrivateLessons: packages.reduce((sum, pkg) => sum + (pkg.private_lesson_count || 0), 0),
    totalJointLessons: packages.reduce((sum, pkg) => sum + (pkg.joint_lesson_count || 0), 0),
  };

  if (loading) {
    return (
      <div className="loading">
        <Icons.Loading className="spin" style={{ marginRight: '8px' }} />
        Chargement des forfaits...
      </div>
    );
  }

  return (
    <div className="rider-packages-section">
      <div className="flex-between mb-20">
        <h3>
          <Icons.Service style={{ marginRight: '8px' }} />
          Forfaits de {riderName}
        </h3>
        <button className="btn btn-primary btn-sm" onClick={handleCreate}>
          <Icons.Add style={{ marginRight: '4px' }} />
          Nouveau Forfait
        </button>
      </div>

      {successMessage && (
        <div className="alert alert-success mb-20">
          <Icons.Check style={{ marginRight: '8px' }} />
          {successMessage}
        </div>
      )}
      {error && (
        <div className="alert alert-error mb-20">
          <Icons.Warning style={{ marginRight: '8px' }} />
          {error}
        </div>
      )}

      {/* Statistics */}
      {packages.length > 0 && (
        <div className="stats-grid mb-20" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          <div className="stat-card">
            <span className="stat-number">{stats.total}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{stats.active}</span>
            <span className="stat-label">Actifs</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{stats.totalPrivateLessons}</span>
            <span className="stat-label">
              <Icons.PrivateLesson style={{ marginRight: '4px', fontSize: '0.875rem' }} />
              Cours Privés
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{stats.totalJointLessons}</span>
            <span className="stat-label">
              <Icons.GroupLesson style={{ marginRight: '4px', fontSize: '0.875rem' }} />
              Cours Collectifs
            </span>
          </div>
        </div>
      )}

      {packages.length === 0 ? (
        <div className="empty-state" style={{ padding: '40px 20px' }}>
          <div className="empty-state-icon">
            <Icons.Service style={{ fontSize: '64px' }} />
          </div>
          <h4>Aucun forfait</h4>
          <p>Ce cavalier n'a pas encore de forfait</p>
          <button className="btn btn-primary btn-sm" onClick={handleCreate}>
            <Icons.Add style={{ marginRight: '4px' }} />
            Créer le premier forfait
          </button>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>
                  <Icons.PrivateLesson style={{ marginRight: '4px' }} />
                  Cours Privés
                </th>
                <th>
                  <Icons.GroupLesson style={{ marginRight: '4px' }} />
                  Cours Collectifs
                </th>
                <th>
                  <Icons.Calendar style={{ marginRight: '4px' }} />
                  Début
                </th>
                <th>
                  <Icons.Calendar style={{ marginRight: '4px' }} />
                  Fin
                </th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((pkg) => (
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
                      <Icons.Edit />
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteClick(pkg)}
                    >
                      <Icons.Delete />
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
                  {editingPackage ? (
                    <>
                      <Icons.Edit style={{ marginRight: '8px' }} />
                      Modifier le forfait
                    </>
                  ) : (
                    <>
                      <Icons.Add style={{ marginRight: '8px' }} />
                      Nouveau forfait
                    </>
                  )}
                </h3>
                <button className="modal-close" onClick={() => setShowModal(false)}>
                  <Icons.Close />
                </button>
              </div>
              <PackageForm
                package={editingPackage}
                riders={riders}
                riderId={riderId}
                onSubmit={handleFormSubmit}
                onCancel={() => setShowModal(false)}
              />
            </div>
          </div>
        </Portal>
      )}

      {/* Delete Modal */}
      {showDeleteModal && packageToDelete && (
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
                  Que faire avec ce forfait ?
                </h3>
                <button className="modal-close" onClick={() => setShowDeleteModal(false)}>
                  <Icons.Close />
                </button>
              </div>
              <div style={{ padding: '20px' }}>
                <p style={{ marginBottom: '20px', color: '#4a5568' }}>
                  Forfait <strong>#{packageToDelete.id}</strong> de <strong>{riderName}</strong>
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
                    Le forfait restera dans la base de données mais sera marqué comme inactif. La
                    date de fin d'activité sera définie à aujourd'hui.
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
                    Le forfait sera supprimé de la base de données de manière permanente. Cette
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

RiderPackages.propTypes = {
  riderId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  riderName: PropTypes.string.isRequired,
};

export default RiderPackages;
