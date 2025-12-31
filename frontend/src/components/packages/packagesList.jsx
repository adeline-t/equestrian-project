import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { packagesApi, ridersApi } from '../../services/api';
import PackageForm from './PackageForm';
import Portal from '../../utils/Portal';
import { Icons } from '../../utils/icons';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import './package.css';

function PackagesList() {
  const [packages, setPackages] = useState([]);
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, inactive
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      // Load both packages and riders for the form
      const [packagesData, ridersData] = await Promise.all([
        packagesApi.getAll(),
        ridersApi.getAll(),
      ]);
      setPackages(packagesData || []);
      setRiders(ridersData || []);
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
      setSuccessMessage(
        `Forfait ${
          packageToDelete.riders?.name ? `de ${packageToDelete.riders.name}` : ''
        } retiré de l'inventaire`
      );
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowDeleteModal(false);
      setPackageToDelete(null);
      loadData();
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
      setSuccessMessage(
        `Forfait ${
          packageToDelete.riders?.name ? `de ${packageToDelete.riders.name}` : ''
        } supprimé définitivement`
      );
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowDeleteModal(false);
      setPackageToDelete(null);
      loadData();
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
        await packagesApi.create(packageData);
        setSuccessMessage('Forfait créé avec succès');
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
    <div className="card">
      <div className="flex-between mb-20">
        <h2>
          <Icons.Service style={{ marginRight: '8px' }} />
          Liste des Forfaits
        </h2>
        <button className="btn btn-primary" onClick={handleCreate}>
          <Icons.Add style={{ marginRight: '8px' }} />
          Nouveau Forfait
        </button>
      </div>

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
            <Icons.Check style={{ marginRight: '4px' }} />
            Actifs ({stats.active})
          </button>
          <button
            className={`btn ${filter === 'inactive' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('inactive')}
          >
            <Icons.Close style={{ marginRight: '4px' }} />
            Inactifs ({stats.inactive})
          </button>
        </div>
      )}

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

      {packages.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Icons.Service style={{ fontSize: '64px' }} />
          </div>
          <h3>Aucun forfait enregistré</h3>
          <p>Commencez par créer le premier forfait</p>
          <button className="btn btn-primary" onClick={handleCreate}>
            <Icons.Add style={{ marginRight: '8px' }} />
            Créer le premier forfait
          </button>
        </div>
      ) : filteredPackages.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Icons.List style={{ fontSize: '64px' }} />
          </div>
          <h3>Aucun résultat</h3>
          <p>Aucun forfait {filter === 'active' ? 'actif' : 'inactif'} trouvé</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Cavalier</th>
                <th>Cours Privés</th>
                <th>Prestation</th>
                <th>Début</th>
                <th>Fin</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPackages.map((pkg) => (
                <tr key={pkg.id}>
                  <td>
                    {pkg.riders ? (
                      <div className="rider-info">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <strong>{pkg.riders.name}</strong>
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted">Non assigné</span>
                    )}
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
                      <Icons.Edit style={{ marginRight: '4px' }} />
                      Modifier
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteClick(pkg)}
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

      {/* Form Modal - PackageForm already has Portal, so we don't wrap it again */}
      {showModal && (
        <PackageForm
          package={editingPackage}
          riders={riders}
          onSubmit={handleFormSubmit}
          onCancel={() => setShowModal(false)}
        />
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
                  Forfait <strong>#{packageToDelete.id}</strong>
                  {packageToDelete.riders?.name && (
                    <>
                      {' '}
                      de <strong>{packageToDelete.riders.name}</strong>
                    </>
                  )}
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

PackagesList.propTypes = {};

export default PackagesList;
