import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ridersApi, packagesApi, horsesApi } from '../../services/api';
import PackageForm from '../packages/PackageForm';
import PairingForm from '../pairings/PairingForm';
import Portal from '../../utils/Portal';
import { Icons } from '../../utils/icons';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

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
      setSuccessMessage("Pension retirée de l'inventaire");
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
      setSuccessMessage('Pension supprimée définitivement');
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
        setSuccessMessage('Pension modifiée avec succès');
      } else {
        await pairingsApi.create({ ...pairingData, rider_id: riderId });
        setSuccessMessage('Pension créée avec succès');
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
            <div className="loading">
              <Icons.Loading className="spin" style={{ marginRight: '8px' }} />
              Chargement des informations du cavalier...
            </div>
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
            <div className="error">
              <Icons.Warning style={{ marginRight: '8px' }} />
              Cavalier non trouvé
            </div>
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
            <h2>
              <Icons.User style={{ marginRight: '8px' }} />
              {rider.name}
            </h2>
            <button className="modal-close" onClick={onClose}>
              <Icons.Close />
            </button>
          </div>

          <div className="modal-body rider-card-content">
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

            {/* Rider Information */}
            <div className="rider-info-section mb-30">
              <h3>
                <Icons.Info style={{ marginRight: '8px' }} />
                Informations
              </h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">
                    <Icons.Email style={{ marginRight: '4px' }} />
                    Email:
                  </span>
                  <span className="info-value">{rider.email || '-'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">
                    <Icons.Phone style={{ marginRight: '4px' }} />
                    Téléphone:
                  </span>
                  <span className="info-value">{rider.phone || '-'}</span>
                </div>
              </div>
              <div className="date-status-row" style={{ marginTop: '15px' }}>
                <div className="date-status-item">
                  <span className="info-label">
                    <Icons.Calendar style={{ marginRight: '4px' }} />
                    Début:
                  </span>
                  <span className="info-value">{formatDate(rider.activity_start_date)}</span>
                </div>
                <div className="date-status-item">
                  <span className="info-label">
                    <Icons.Calendar style={{ marginRight: '4px' }} />
                    Fin:
                  </span>
                  <span className="info-value">{formatDate(rider.activity_end_date)}</span>
                </div>
                <div className="date-status-item">
                  <span className="info-label">Statut:</span>
                  {getStatusBadge(rider.activity_start_date, rider.activity_end_date)}
                </div>
              </div>
            </div>

            {/* Owned Horses Section - Minimal Display */}
            {ownedHorses.length > 0 && (
              <div className="section section-minimal mb-30">
                <h3>
                  <Icons.Horse style={{ marginRight: '8px' }} />
                  Chevaux Possédés ({activeOwnedHorses.length})
                </h3>

                {activeOwnedHorses.length === 0 ? (
                  <p style={{ color: '#718096', margin: '10px 0 0 0', fontSize: '0.9rem' }}>
                    Aucun cheval actif possédé
                  </p>
                ) : (
                  <div className="owned-horses-list">
                    {activeOwnedHorses.map((horse) => (
                      <div key={horse.id} className="owned-horse-item">
                        <div className="horse-name-type">
                          <strong>{horse.name}</strong>
                          <span className={`badge badge-${horse.kind}`}>
                            {getKindLabel(horse.kind)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Active Packages Section - Minimal Display */}
            <div className="section section-minimal mb-30">
              <div className="flex-between mb-15">
                <h3>
                  <Icons.Packages style={{ marginRight: '8px' }} />
                  Forfaits ({activePackages.length})
                </h3>
                <button
                  className="btn btn-primary btn-icon"
                  onClick={handleCreatePackage}
                  title="Ajouter un forfait"
                >
                  <Icons.Add />
                </button>
              </div>

              {activePackages.length === 0 ? (
                <p style={{ color: '#718096', margin: '0', fontSize: '0.9rem' }}>
                  Aucun forfait actif
                </p>
              ) : (
                <div className="packages-list">
                  {activePackages.map((pkg) => (
                    <div key={pkg.id} className="package-item">
                      <div className="package-info">
                        <span className="package-id">#{pkg.id}</span>
                        <div className="package-lessons">
                          Cours particuliers :
                          <span className="lesson-badge">{pkg.private_lesson_count || 0}</span>
                          Prestations :
                          <span className="lesson-badge">{pkg.joint_lesson_count || 0}</span>
                        </div>
                      </div>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => handleEditPackage(pkg)}
                        title="Modifier"
                      >
                        <Icons.Edit />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Active Horse Associations Section - Minimal Display */}
            <div className="section section-minimal">
              <div className="flex-between mb-15">
                <h3>
                  <Icons.Horse style={{ marginRight: '8px' }} />
                  Pension ({activePairings.length})
                </h3>
                <button
                  className="btn btn-primary btn-icon"
                  onClick={handleCreatePairing}
                  title="Ajouter une pension"
                >
                  <Icons.Add />
                </button>
              </div>

              {activePairings.length === 0 ? (
                <p style={{ color: '#718096', margin: '0', fontSize: '0.9rem' }}>
                  Aucune pension active
                </p>
              ) : (
                <div className="pairings-list">
                  {activePairings.map((pairing) => (
                    <div key={pairing.id} className="pairing-item">
                      <div className="pairing-info">
                        <Icons.Horse style={{ marginRight: '8px', color: '#4299e1' }} />
                        <span className="pairing-horse-name">{pairing.horses?.name || 'N/A'}</span>
                      </div>
                      <div className="pairing-actions">
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => handleEditPairing(pairing)}
                          title="Modifier"
                        >
                          <Icons.Edit />
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeletePairingClick(pairing)}
                          title="Supprimer"
                        >
                          <Icons.Delete />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              <Icons.Close style={{ marginRight: '8px' }} />
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
                <button className="modal-close" onClick={() => setShowPackageModal(false)}>
                  <Icons.Close />
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
                <h3>
                  {editingPairing ? (
                    <>
                      <Icons.Edit style={{ marginRight: '8px' }} />
                      Modifier la pension
                    </>
                  ) : (
                    <>
                      <Icons.Add style={{ marginRight: '8px' }} />
                      Nouvelle pension
                    </>
                  )}
                </h3>
                <button className="modal-close" onClick={() => setShowPairingModal(false)}>
                  <Icons.Close />
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
                <h3>
                  <Icons.Warning style={{ marginRight: '8px', color: '#ed8936' }} />
                  Que faire avec ce forfait ?
                </h3>
                <button className="modal-close" onClick={() => setShowDeletePackageModal(false)}>
                  <Icons.Close />
                </button>
              </div>
              <div style={{ padding: '20px' }}>
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
                    onClick={handleRemovePackageFromInventory}
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
                    onClick={handlePermanentDeletePackage}
                    style={{ width: '100%' }}
                  >
                    <Icons.Delete style={{ marginRight: '8px' }} />
                    Supprimer définitivement
                  </button>
                </div>

                <div style={{ marginTop: '20px' }}>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowDeletePackageModal(false)}
                    style={{ width: '100%' }}
                  >
                    <Icons.Cancel style={{ marginRight: '8px' }} />
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
                <h3>
                  <Icons.Warning style={{ marginRight: '8px', color: '#ed8936' }} />
                  Que faire avec cette pension ?
                </h3>
                <button className="modal-close" onClick={() => setShowDeletePairingModal(false)}>
                  <Icons.Close />
                </button>
              </div>
              <div style={{ padding: '20px' }}>
                <p style={{ marginBottom: '20px', color: '#4a5568' }}>
                  Choisissez l'action à effectuer :
                </p>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#2d3748' }}>
                    <Icons.Remove style={{ marginRight: '8px' }} />
                    Retirer de l'inventaire
                  </h4>
                  <p style={{ margin: '0 0 12px 0', color: '#718096', fontSize: '0.9rem' }}>
                    La pension restera sauvegardée mais sera marquée comme inactive. La date de fin
                    sera définie à aujourd'hui.
                  </p>
                  <button
                    className="btn btn-warning"
                    onClick={handleRemovePairingFromInventory}
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
                    Les données de la pension seront supprimées de manière permanente. Cette action
                    ne peut pas être annulée.
                  </p>
                  <button
                    className="btn btn-danger"
                    onClick={handlePermanentDeletePairing}
                    style={{ width: '100%' }}
                  >
                    <Icons.Delete style={{ marginRight: '8px' }} />
                    Supprimer définitivement
                  </button>
                </div>

                <div style={{ marginTop: '20px' }}>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowDeletePairingModal(false)}
                    style={{ width: '100%' }}
                  >
                    <Icons.Cancel style={{ marginRight: '8px' }} />
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
