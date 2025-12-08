import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ridersApi, packagesApi, horsesApi } from '../../services/api';
import PackageForm from '../packages/PackageForm';
import PairingForm from '../pairings/PairingForm';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import './RiderCard.css';

function RiderCard({ riderId, onClose }) {
  const [rider, setRider] = useState(null);
  const [packages, setPackages] = useState([]);
  const [pairings, setPairings] = useState([]);
  const [riders, setRiders] = useState([]);
  const [horses, setHorses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [showPairingModal, setShowPairingModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [editingPairing, setEditingPairing] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadRiderData();
  }, [riderId]);

  const loadRiderData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load rider details, packages, pairings, and reference data
      const [riderData, packagesData, pairingsData, ridersData, horsesData] = await Promise.all([
        ridersApi.getById(riderId),
        ridersApi.getPackages(riderId),
        ridersApi.getHorses(riderId),
        ridersApi.getAll(),
        horsesApi.getAll(),
      ]);

      setRider(riderData);
      setPackages(packagesData || []);
      setPairings(pairingsData || []);
      setRiders(ridersData || []);
      setHorses(horsesData || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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

  // Package handlers
  const handleCreatePackage = () => {
    setEditingPackage(null);
    setShowPackageModal(true);
  };

  const handleEditPackage = (pkg) => {
    setEditingPackage(pkg);
    setShowPackageModal(true);
  };

  const handleDeletePackage = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce forfait ?')) {
      return;
    }

    try {
      await packagesApi.delete(id);
      setSuccessMessage('Forfait supprimé avec succès');
      setTimeout(() => setSuccessMessage(''), 3000);
      loadRiderData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePackageSubmit = async (packageData) => {
    try {
      if (editingPackage) {
        await packagesApi.update(editingPackage.id, packageData);
        setSuccessMessage('Forfait modifié avec succès');
      } else {
        await packagesApi.createForRider(riderId, packageData);
        setSuccessMessage('Forfait créé avec succès');
      }
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowPackageModal(false);
      loadRiderData();
    } catch (err) {
      throw err;
    }
  };

  // Pairing handlers
  const handleCreatePairing = () => {
    setEditingPairing(null);
    setShowPairingModal(true);
  };

  const handleEditPairing = (pairing) => {
    setEditingPairing(pairing);
    setShowPairingModal(true);
  };

  const handleDeletePairing = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette DP ?')) {
      return;
    }

    try {
      const pairingsApi = await import('../../services/api').then((m) => m.pairingsApi);
      await pairingsApi.delete(id);
      setSuccessMessage('DP supprimée avec succès');
      setTimeout(() => setSuccessMessage(''), 3000);
      loadRiderData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePairingSubmit = async (pairingData) => {
    try {
      const pairingsApi = await import('../../services/api').then((m) => m.pairingsApi);

      if (editingPairing) {
        await pairingsApi.update(editingPairing.id, pairingData);
        setSuccessMessage('DP modifiée avec succès');
      } else {
        // Add rider_id to pairing data
        await pairingsApi.create({ ...pairingData, rider_id: riderId });
        setSuccessMessage('DP créée avec succès');
      }
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowPairingModal(false);
      loadRiderData();
    } catch (err) {
      throw err;
    }
  };

  // Filter active items
  const activePackages = packages.filter((pkg) =>
    isActive(pkg.activity_start_date, pkg.activity_end_date)
  );

  const activePairings = pairings.filter((pairing) => {
    const pairingActive = isActive(pairing.pairing_start_date, pairing.pairing_end_date);
    const horseActive =
      pairing.horses &&
      isActive(pairing.horses.activity_start_date, pairing.horses.activity_end_date);
    return pairingActive && horseActive;
  });

  // Calculate lesson counts
  const totalPrivateLessons = activePackages.reduce(
    (sum, pkg) => sum + (pkg.private_lesson_count || 0),
    0
  );
  const totalJointLessons = activePackages.reduce(
    (sum, pkg) => sum + (pkg.joint_lesson_count || 0),
    0
  );

  if (loading) {
    return (
      <div className="modal-overlay">
        <div className="modal rider-card-modal">
          <div className="loading">Chargement des informations du cavalier...</div>
        </div>
      </div>
    );
  }

  if (!rider) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal rider-card-modal">
          <div className="error">Cavalier non trouvé</div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal rider-card-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>👤 {rider.name}</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body rider-card-content">
          {successMessage && <div className="alert alert-success mb-20">{successMessage}</div>}
          {error && <div className="alert alert-error mb-20">{error}</div>}

          {/* Rider Information */}
          <div className="rider-info-section mb-30">
            <h3>Informations</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">📧 Email:</span>
                <span className="info-value">{rider.email || '-'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">📞 Téléphone:</span>
                <span className="info-value">{rider.phone || '-'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">📅 Début:</span>
                <span className="info-value">{formatDate(rider.activity_start_date)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">📅 Fin:</span>
                <span className="info-value">{formatDate(rider.activity_end_date)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Statut:</span>
                <span className="info-value">
                  {getStatusBadge(rider.activity_start_date, rider.activity_end_date)}
                </span>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="stats-grid mb-30">
            <div className="stat-card">
              <span className="stat-number">{activePairings.length}</span>
              <span className="stat-label">🐴 Chevaux Actifs</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{activePackages.length}</span>
              <span className="stat-label">📦 Forfaits Actifs</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{totalPrivateLessons}</span>
              <span className="stat-label">🎓 Cours Privés par semaine</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{totalJointLessons}</span>
              <span className="stat-label">👥 Cours Collectifs par semaine</span>
            </div>
          </div>

          {/* Active Packages Section */}
          <div className="section mb-30">
            <div className="flex-between mb-20">
              <h3>📦 Forfaits Actifs ({activePackages.length})</h3>
              <button className="btn btn-primary btn-sm" onClick={handleCreatePackage}>
                ➕ Nouveau Forfait
              </button>
            </div>

            {activePackages.length === 0 ? (
              <div className="empty-state-small">
                <p>Aucun forfait actif</p>
                <button className="btn btn-primary btn-sm" onClick={handleCreatePackage}>
                  Créer le premier forfait
                </button>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>🎓 Privés</th>
                      <th>👥 Collectifs</th>
                      <th>📅 Début</th>
                      <th>📅 Fin</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activePackages.map((pkg) => (
                      <tr key={pkg.id}>
                        <td>#{pkg.id}</td>
                        <td>
                          <span className="badge badge-info">{pkg.private_lesson_count || 0}</span>
                        </td>
                        <td>
                          <span className="badge badge-info">{pkg.joint_lesson_count || 0}</span>
                        </td>
                        <td>{formatDate(pkg.activity_start_date)}</td>
                        <td>{formatDate(pkg.activity_end_date)}</td>
                        <td className="actions">
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => handleEditPackage(pkg)}
                          >
                            ✏️
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDeletePackage(pkg.id)}
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Active Horse Associations Section */}
          <div className="section">
            <div className="flex-between mb-20">
              <h3>🐴 DP Chevaux Actives ({activePairings.length})</h3>
              <button className="btn btn-primary btn-sm" onClick={handleCreatePairing}>
                ➕ Nouvelle DP
              </button>
            </div>

            {activePairings.length === 0 ? (
              <div className="empty-state-small">
                <p>Aucune association active</p>
                <button className="btn btn-primary btn-sm" onClick={handleCreatePairing}>
                  Créer la première DP
                </button>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Cheval</th>
                      <th>Type</th>
                      <th>📅 Début</th>
                      <th>📅 Fin</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activePairings.map((pairing) => (
                      <tr key={pairing.id}>
                        <td>
                          <strong>{pairing.horses?.name || 'N/A'}</strong>
                        </td>
                        <td>
                          <span className={`badge badge-${pairing.horses?.kind}`}>
                            {pairing.horses?.kind === 'horse' ? 'Cheval' : 'Poney'}
                          </span>
                        </td>
                        <td>{formatDate(pairing.pairing_start_date)}</td>
                        <td>{formatDate(pairing.pairing_end_date)}</td>
                        <td className="actions">
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => handleEditPairing(pairing)}
                          >
                            ✏️
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDeletePairing(pairing.id)}
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Fermer
          </button>
        </div>
      </div>

      {/* Package Form Modal */}
      {showPackageModal && (
        <PackageForm
          package={editingPackage}
          riders={riders}
          riderId={riderId}
          onSubmit={handlePackageSubmit}
          onCancel={() => setShowPackageModal(false)}
        />
      )}

      {/* Pairing Form Modal */}
      {showPairingModal && (
        <PairingForm
          pairing={editingPairing}
          riders={riders}
          horses={horses}
          riderId={riderId}
          onSubmit={handlePairingSubmit}
          onCancel={() => setShowPairingModal(false)}
        />
      )}
    </div>
  );
}

RiderCard.propTypes = {
  riderId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default RiderCard;
