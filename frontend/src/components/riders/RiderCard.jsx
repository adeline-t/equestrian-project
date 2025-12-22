import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ridersApi, packagesApi, horsesApi } from '../../services/api';
import PackageForm from '../packages/PackageForm';
import PairingForm from '../pairings/PairingForm';
import Portal from '../Portal';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import './RiderCard.css';

function RiderCard({ riderId, onClose }) {
  const [rider, setRider] = useState(null);
  const [packages, setPackages] = useState([]);
  const [pairings, setPairings] = useState([]);
  const [ownedHorses, setOwnedHorses] = useState([]);
  const [riders, setRiders] = useState([]);
  const [horses, setHorses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [showPairingModal, setShowPairingModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [editingPairing, setEditingPairing] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showDeletePackageModal, setShowDeletePackageModal] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState(null);
  const [showDeletePairingModal, setShowDeletePairingModal] = useState(false);
  const [pairingToDelete, setPairingToDelete] = useState(null);

  useEffect(() => {
    loadRiderData();
  }, [riderId]);

  const loadRiderData = async () => {
    try {
      setLoading(true);
      setError(null);

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

      // Filter horses owned by this rider
      const owned = (horsesData || []).filter((horse) => horse.owner_id === riderId);
      setOwnedHorses(owned);
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

  const getKindLabel = (kind) => {
    return kind === 'horse' ? 'Cheval' : 'Poney';
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

  const handleDeletePackageClick = (pkg) => {
    setPackageToDelete(pkg);
    setShowDeletePackageModal(true);
  };

  const handleRemovePackageFromInventory = async () => {
    if (!packageToDelete) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      await packagesApi.update(packageToDelete.id, {
        activity_end_date: today,
      });
      setSuccessMessage("Forfait retiré de l'inventaire");
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowDeletePackageModal(false);
      setPackageToDelete(null);
      loadRiderData();
    } catch (err) {
      setError(err.message);
      setShowDeletePackageModal(false);
      setPackageToDelete(null);
    }
  };

  const handlePermanentDeletePackage = async () => {
    if (!packageToDelete) return;

    try {
      await packagesApi.delete(packageToDelete.id);
      setSuccessMessage('Forfait supprimé définitivement');
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowDeletePackageModal(false);
      setPackageToDelete(null);
      loadRiderData();
    } catch (err) {
      setError(err.message);
      setShowDeletePackageModal(false);
      setPackageToDelete(null);
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

  const handleDeletePairingClick = (pairing) => {
    setPairingToDelete(pairing);
    setShowDeletePairingModal(true);
  };

  const handleRemovePairingFromInventory = async () => {
    if (!pairingToDelete) return;

    try {
      const pairingsApi = await import('../../services/api').then((m) => m.pairingsApi);
      const today = new Date().toISOString().split('T')[0];
      await pairingsApi.update(pairingToDelete.id, {
        pairing_end_date: today,
      });
      setSuccessMessage("DP retirée de l'inventaire");
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowDeletePairingModal(false);
      setPairingToDelete(null);
      loadRiderData();
    } catch (err) {
      setError(err.message);
      setShowDeletePairingModal(false);
      setPairingToDelete(null);
    }
  };

  const handlePermanentDeletePairing = async () => {
    if (!pairingToDelete) return;

    try {
      const pairingsApi = await import('../../services/api').then((m) => m.pairingsApi);
      await pairingsApi.delete(pairingToDelete.id);
      setSuccessMessage('DP supprimée définitivement');
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowDeletePairingModal(false);
      setPairingToDelete(null);
      loadRiderData();
    } catch (err) {
      setError(err.message);
      setShowDeletePairingModal(false);
      setPairingToDelete(null);
    }
  };

  const handlePairingSubmit = async (pairingData) => {
    try {
      const pairingsApi = await import('../../services/api').then((m) => m.pairingsApi);

      if (editingPairing) {
        await pairingsApi.update(editingPairing.id, pairingData);
        setSuccessMessage('DP modifiée avec succès');
      } else {
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

  const activeOwnedHorses = ownedHorses.filter((horse) =>
    isActive(horse.activity_start_date, horse.activity_end_date)
  );

  if (loading) {
    return (
      <Portal>
        <div className="modal-overlay">
          <div className="modal rider-card-modal">
            <div className="loading">Chargement des informations du cavalier...</div>
          </div>
        </div>
      </Portal>
    );
  }

  if (!rider) {
    return (
      <Portal>
        <div className="modal-overlay" onClick={onClose}>
          <div className="modal rider-card-modal">
            <div className="error">Cavalier non trouvé</div>
          </div>
        </div>
      </Portal>
    );
  }

  return (
    <Portal>
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

            {/* Owned Horses Section */}
            {ownedHorses.length > 0 && (
              <div className="section mb-30">
                <h3>🐴 Chevaux Possédés ({activeOwnedHorses.length})</h3>

                {activeOwnedHorses.length === 0 ? (
                  <div className="empty-state-small">
                    <p>Aucun cheval actif possédé</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Nom</th>
                          <th>Type</th>
                          <th>Début</th>
                          <th>Fin</th>
                          <th>Statut</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeOwnedHorses.map((horse) => (
                          <tr key={horse.id}>
                            <td>
                              <strong>{horse.name}</strong>
                            </td>
                            <td>
                              <span className={`badge badge-${horse.kind}`}>
                                {getKindLabel(horse.kind)}
                              </span>
                            </td>
                            <td>{formatDate(horse.activity_start_date)}</td>
                            <td>{formatDate(horse.activity_end_date)}</td>
                            <td>
                              {getStatusBadge(horse.activity_start_date, horse.activity_end_date)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

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
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activePackages.map((pkg) => (
                        <tr key={pkg.id}>
                          <td>#{pkg.id}</td>
                          <td>
                            <span className="badge badge-info">
                              {pkg.private_lesson_count || 0}
                            </span>
                          </td>
                          <td>
                            <span className="badge badge-info">{pkg.joint_lesson_count || 0}</span>
                          </td>
                          <td className="actions">
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={() => handleEditPackage(pkg)}
                            >
                              ✏️
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDeletePackageClick(pkg)}
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
                <h3>🐴 DP Actives ({activePairings.length})</h3>
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
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activePairings.map((pairing) => (
                        <tr key={pairing.id}>
                          <td>
                            <strong>{pairing.horses?.name || 'N/A'}</strong>
                          </td>
                          <td className="actions">
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={() => handleEditPairing(pairing)}
                            >
                              ✏️
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDeletePairingClick(pairing)}
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
          <div
            className="modal-overlay"
            onClick={() => setShowPackageModal(false)}
            style={{
              zIndex: 1001,
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
                <h3>{editingPackage ? '✏️ Modifier le forfait' : '➕ Nouveau forfait'}</h3>
                <button className="modal-close" onClick={() => setShowPackageModal(false)}>
                  ×
                </button>
              </div>
              <PackageForm
                package={editingPackage}
                riders={riders}
                riderId={riderId}
                onSubmit={handlePackageSubmit}
                onCancel={() => setShowPackageModal(false)}
              />
            </div>
          </div>
        )}

        {/* Pairing Form Modal */}
        {showPairingModal && (
          <div
            className="modal-overlay"
            onClick={() => setShowPairingModal(false)}
            style={{
              zIndex: 1001,
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
                <h3>{editingPairing ? '✏️ Modifier la DP' : '➕ Nouvelle DP'}</h3>
                <button className="modal-close" onClick={() => setShowPairingModal(false)}>
                  ×
                </button>
              </div>
              <PairingForm
                pairing={editingPairing}
                riders={riders}
                horses={horses}
                riderId={riderId}
                onSubmit={handlePairingSubmit}
                onCancel={() => setShowPairingModal(false)}
              />
            </div>
          </div>
        )}

        {/* Delete Package Modal */}
        {showDeletePackageModal && packageToDelete && (
          <div
            className="modal-overlay"
            onClick={() => setShowDeletePackageModal(false)}
            style={{
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
                <h3>⚠️ Que faire avec ce forfait ?</h3>
                <button className="modal-close" onClick={() => setShowDeletePackageModal(false)}>
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
                    Le forfait restera dans la base de données mais sera marqué comme inactif. La
                    date de fin d'activité sera définie à aujourd'hui.
                  </p>
                  <button
                    className="btn btn-warning"
                    onClick={handleRemovePackageFromInventory}
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
                    Le forfait sera supprimé de la base de données de manière permanente. Cette
                    action ne peut pas être annulée.
                  </p>
                  <button
                    className="btn btn-danger"
                    onClick={handlePermanentDeletePackage}
                    style={{ width: '100%' }}
                  >
                    🗑️ Supprimer définitivement
                  </button>
                </div>

                <div style={{ marginTop: '20px' }}>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowDeletePackageModal(false)}
                    style={{ width: '100%' }}
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Pairing Modal */}
        {showDeletePairingModal && pairingToDelete && (
          <div
            className="modal-overlay"
            onClick={() => setShowDeletePairingModal(false)}
            style={{
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
                <h3>⚠️ Que faire avec cette DP ?</h3>
                <button className="modal-close" onClick={() => setShowDeletePairingModal(false)}>
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
                    La DP restera dans la base de données mais sera marquée comme inactive. La date
                    de fin sera définie à aujourd'hui.
                  </p>
                  <button
                    className="btn btn-warning"
                    onClick={handleRemovePairingFromInventory}
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
                    La DP sera supprimée de la base de données de manière permanente. Cette action
                    ne peut pas être annulée.
                  </p>
                  <button
                    className="btn btn-danger"
                    onClick={handlePermanentDeletePairing}
                    style={{ width: '100%' }}
                  >
                    🗑️ Supprimer définitivement
                  </button>
                </div>

                <div style={{ marginTop: '20px' }}>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowDeletePairingModal(false)}
                    style={{ width: '100%' }}
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Portal>
  );
}

RiderCard.propTypes = {
  riderId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default RiderCard;
