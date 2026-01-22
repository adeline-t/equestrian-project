import { useRidersList } from '../../hooks/useRidersList.js';
import {
  getRiderHorseLinkConfig,
  getRiderTypeConfig,
  RIDER_TYPES,
  WEEK_DAYS,
  WEEK_DAYS_EN,
  getRiderTypeLabel,
} from '../../lib/domain/domain-constants.js';
import { COMMON_FILTERS } from '../../lib/helpers/filters/activityFilters.js';
import { Icons } from '../../lib/icons.jsx';
import DomainBadge from '../common/DomainBadge.jsx';
import '../../styles/features/riders.css';
import DeleteConfirmationModal from '../common/DeleteConfirmationModal.jsx';
import Modal from '../common/Modal.jsx';
import RiderCard from './RiderCard.jsx';
import RiderForm from './RiderForm.jsx';

function RidersList() {
  const {
    riders,
    filteredRiders,
    stats,
    loading,
    error,
    showModal,
    editingRider,
    selectedRiderId,
    showDeleteModal,
    riderToDelete,
    successMessage,
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

  const getRiderHorses = (rider) => (rider.pairings?.length ? rider.pairings : null);

  const renderRiderDays = (rider) => {
    const days = getRiderPairingDays(rider);
    if (!days.length) return <span className="text-muted">-</span>;

    return (
      <div className="loan-days-cell">
        {WEEK_DAYS_EN.map((dayEn, index) => (
          <span key={dayEn} className={`day-badge ${days.includes(dayEn) ? 'active' : 'inactive'}`}>
            {WEEK_DAYS[index]}
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="loading">
        <Icons.Loading className="spin" /> Chargement des cavaliers...
      </div>
    );
  }

  return (
    <div className="card-enhanced riders-list">
      <div className="flex-between mb-20">
        <h2>Liste des Cavaliers</h2>

        <div className="flex gap-12">
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
            <Icons.Add /> Nouveau Cavalier
          </button>
        </div>
      </div>

      {/* Filters */}
      {riders.length > 0 && (
        <div className="filter-section mb-20">
          <div className="filter-pills">
            <button
              className={`pill ${riderTypeFilter === COMMON_FILTERS.ALL ? 'pill-active' : ''}`}
              onClick={() => setRiderTypeFilter(COMMON_FILTERS.ALL)}
              data-rider-type="all"
            >
              Tous
            </button>
            <button
              className={`pill ${riderTypeFilter === RIDER_TYPES.OWNER ? 'pill-active' : ''}`}
              onClick={() => setRiderTypeFilter(RIDER_TYPES.OWNER)}
              data-rider-type={RIDER_TYPES.OWNER}
            >
              {getRiderTypeLabel(RIDER_TYPES.OWNER)}
            </button>
            <button
              className={`pill ${riderTypeFilter === RIDER_TYPES.CLUB ? 'pill-active' : ''}`}
              onClick={() => setRiderTypeFilter(RIDER_TYPES.CLUB)}
              data-rider-type={RIDER_TYPES.CLUB}
            >
              {getRiderTypeLabel(RIDER_TYPES.CLUB)}
            </button>
            <button
              className={`pill ${riderTypeFilter === RIDER_TYPES.LOANER ? 'pill-active' : ''}`}
              onClick={() => setRiderTypeFilter(RIDER_TYPES.LOANER)}
              data-rider-type={RIDER_TYPES.LOANER}
            >
              {getRiderTypeLabel(RIDER_TYPES.LOANER)}
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      {error && (
        <div className="alert alert-error mb-20">
          <Icons.Warning /> {error}
          <button className="btn btn-sm btn-secondary ml-10" onClick={clearError}>
            Effacer
          </button>
        </div>
      )}

      {successMessage && (
        <div className="alert alert-success mb-20">
          <Icons.Check /> {successMessage}
          <button className="btn btn-sm btn-secondary ml-10" onClick={clearSuccessMessage}>
            OK
          </button>
        </div>
      )}

      {/* Table */}
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Type</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Chevaux</th>
              <th>Jours</th>
              <th />
            </tr>
          </thead>

          <tbody>
            {filteredRiders.map((rider) => {
              const horses = getRiderHorses(rider);
              const riderTypeConfig = getRiderTypeConfig(rider.rider_type);

              return (
                <tr
                  key={rider.id}
                  className="rider-row rider-row-clickable"
                  onClick={(e) => handleRowClick(e, rider.id)}
                >
                  <td>
                    <strong>{rider.name}</strong>
                  </td>

                  <td>{riderTypeConfig && <DomainBadge config={riderTypeConfig} />}</td>

                  <td>{rider.email || '-'}</td>
                  <td>{rider.phone || '-'}</td>

                  <td>
                    {horses ? (
                      <div className="horses-badges">
                        {horses.map((pairing) => {
                          const linkConfig = getRiderHorseLinkConfig(pairing.link_type);
                          if (!linkConfig) return null;

                          const horseName = pairing.horses?.name || pairing.horse?.name;

                          return (
                            <DomainBadge
                              key={pairing.id}
                              config={{ ...linkConfig, label: horseName }}
                            />
                          );
                        })}
                      </div>
                    ) : (
                      <span className="text-muted">-</span>
                    )}
                  </td>

                  <td>{renderRiderDays(rider)}</td>

                  <td className="table-actions">
                    <button
                      className="btn-icon btn-icon-view"
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
      <Modal isOpen={showModal} onClose={closeRiderModal} size="medium">
        <RiderForm rider={editingRider} onSubmit={handleFormSubmit} onCancel={closeRiderModal} />
      </Modal>

      {selectedRiderId && (
        <RiderCard
          riderId={selectedRiderId}
          onClose={closeRiderCard}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      )}

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        onRemoveFromInventory={handleRemoveFromInventory}
        onPermanentDelete={handlePermanentDelete}
        itemType="cavalier"
        itemName={riderToDelete?.name}
      />
    </div>
  );
}

export default RidersList;
