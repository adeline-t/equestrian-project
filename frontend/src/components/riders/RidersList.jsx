import { useRidersList } from '../../hooks/useRidersList.js';
import {
  getRiderHorseLinkConfig,
  getRiderTypeConfig,
  getRiderTypeLabel,
  RIDER_TYPES,
  WEEK_DAYS,
  WEEK_DAYS_EN,
} from '../../lib/domain/domain-constants.js';
import { COMMON_FILTERS } from '../../lib/helpers/filters/activityFilters.js';
import { Icons } from '../../lib/icons.jsx';
import DeleteConfirmationModal from '../common/DeleteConfirmationModal.jsx';
import DomainBadge from '../common/DomainBadge.jsx';
import Modal from '../common/Modal.jsx';
import RiderCard from './RiderCard.jsx';
import RiderForm from './RiderForm.jsx';
import '../../styles/features/riders/riders-list.css';

function RidersList() {
  const {
    filteredRiders,
    stats,
    loading,
    error,
    successMessage,
    showModal,
    editingRider,
    selectedRiderId,
    showDeleteModal,
    riderToDelete,
    riderTypeFilter,
    includeInactive,
    toggleIncludeInactive,
    setRiderTypeFilter,
    handleCreate,
    handleEdit,
    handleViewDetails,
    handleDeleteClick,
    handleRemoveFromInventory,
    handlePermanentDelete,
    handleFormSubmit,
    handleSuccess,
    closeRiderModal,
    closeDeleteModal,
    closeRiderCard,
    getRiderPairingDays,
    clearSuccessMessage,
    clearError,
  } = useRidersList();

  const handleRowClick = (e, riderId) => {
    if (e.target.closest('.table-actions') || e.target.closest('button')) return;
    handleViewDetails(riderId);
  };

  const renderRiderDays = (rider) => {
    const days = getRiderPairingDays(rider);
    if (!days.length) return <span className="text-muted">-</span>;

    return (
      <div className="days-cell">
        {WEEK_DAYS_EN.map((dayEn, index) => (
          <span key={dayEn} className={`day-badge ${days.includes(dayEn) ? 'active' : 'inactive'}`}>
            {WEEK_DAYS[index]}
          </span>
        ))}
      </div>
    );
  };

  const renderRiderHorses = (pairings) => {
    if (!pairings?.length) return <span className="text-muted">-</span>;
    return (
      <div className="badges-cell">
        {pairings.map((pairing) => {
          const linkConfig = getRiderHorseLinkConfig(pairing.link_type);
          if (!linkConfig) return null;
          const horseName = pairing.horses?.name || pairing.horse?.name;
          return <DomainBadge key={pairing.id} config={{ ...linkConfig, label: horseName }} />;
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="loading">
        <Icons.Loading className="spin" /> Chargement ...
      </div>
    );
  }

  return (
    <div className="card-enhanced">
      {/* Header */}
      <div className="list-header">
        <h2>Liste des cavaliers</h2>
        <div className="list-header-actions">
          <button
            className={`btn ${includeInactive ? 'btn-secondary' : 'btn-outline-secondary'}`}
            onClick={toggleIncludeInactive}
          >
            <Icons.Filter />
            {includeInactive
              ? `Inactifs inclus (${stats.inactive})`
              : `Afficher inactifs (${stats.inactive})`}
          </button>
          <button className="btn btn-primary" onClick={handleCreate}>
            <Icons.Add /> Ajouter
          </button>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="list-filters">
        <div className="filter-pills">
          {[COMMON_FILTERS.ALL, RIDER_TYPES.OWNER, RIDER_TYPES.CLUB, RIDER_TYPES.LOANER].map(
            (type) => (
              <button
                key={type}
                className={`pill ${riderTypeFilter === type ? 'pill-active' : ''}`}
                onClick={() => setRiderTypeFilter(type)}
                data-rider-type={type}
              >
                {type === COMMON_FILTERS.ALL ? 'Tous' : getRiderTypeLabel(type)}
              </button>
            )
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="list-messages">
        {error && (
          <div className="alert alert-error">
            <Icons.Warning /> {error}
            <button className="btn btn-sm btn-secondary" onClick={clearError}>
              Effacer
            </button>
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success">
            <Icons.Check /> {successMessage}
            <button className="btn btn-sm btn-secondary" onClick={clearSuccessMessage}>
              OK
            </button>
          </div>
        )}
      </div>

      {/* Riders Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Type</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Chevaux</th>
              <th>Jours d'activité</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filteredRiders.map((rider) => {
              const riderTypeConfig = getRiderTypeConfig(rider.rider_type);
              return (
                <tr
                  key={rider.id}
                  className="row-clickable"
                  onClick={(e) => handleRowClick(e, rider.id)}
                >
                  <td>
                    <strong>{rider.name}</strong>
                  </td>
                  <td>{riderTypeConfig && <DomainBadge config={riderTypeConfig} />}</td>
                  <td>{rider.email || '-'}</td>
                  <td>{rider.phone || '-'}</td>
                  <td>{renderRiderHorses(rider.pairings)}</td>
                  <td>{renderRiderDays(rider)}</td>
                  <td className="table-actions">
                    <button
                      className="btn-icon-modern"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(rider.id);
                      }}
                    >
                      <Icons.View />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <Modal isOpen={showModal} onClose={closeRiderModal} size="md">
        <RiderForm rider={editingRider} onSubmit={handleFormSubmit} onCancel={closeRiderModal} />
      </Modal>

      {selectedRiderId && (
        <RiderCard
          riderId={selectedRiderId}
          onClose={closeRiderCard}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          onSuccess={handleSuccess}
        />
      )}

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        onRemoveFromInventory={handleRemoveFromInventory}
        onPermanentDelete={handlePermanentDelete}
        itemType="rider"
        itemName={riderToDelete?.name}
      />
    </div>
  );
}

export default RidersList;
