import PropTypes from 'prop-types';
import { usePairingForm } from '../../hooks/usePairingForm';
import {
  RIDER_HORSE_LINK_TYPE,
  getRiderHorseLinkConfig,
  isLoanPairing,
  isValidLoanDaysPerWeek,
  weekDayCodeToFr,
  WEEK_DAYS_EN,
  getHorseTypeConfig,
  getRiderTypeConfig,
} from '../../lib/domain/domain-constants.js';
import { isActive } from '../../lib/helpers';
import { Icons } from '../../lib/icons';
import DomainBadge from '../common/DomainBadge.jsx';
import '../../styles/features/pairings.css';

/**
 * PairingForm - Formulaire modernisé pour attribuer un cheval à un cavalier
 * Supporte deux modes :
 * 1. Depuis RiderCard : riderId pré-rempli, sélection du cheval
 * 2. Depuis HorseCard : horseId pré-rempli, sélection du cavalier
 */
function PairingForm({
  pairing,
  horses = [],
  riders = [],
  rider,
  riderId,
  horse,
  horseId,
  onSubmit,
  onCancel,
}) {
  const { formData, error, handleChange, toggleLoanDay, validateForm, setError } = usePairingForm(
    pairing,
    rider,
    riderId,
    horseId
  );

  const isEdit = !!pairing;
  const isFromRiderCard = !!riderId || !!rider;
  const isFromHorseCard = !!horseId || !!horse;

  // Chevaux actifs uniquement
  const availableHorses =
    horses?.filter((h) => isActive(h.activity_start_date, h.activity_end_date)) || [];

  // Cavaliers actifs uniquement
  const availableRiders =
    riders?.filter((r) => isActive(r.activity_start_date, r.activity_end_date)) || [];

  // Selected horse : en mode édition, utiliser directement les données du pairing
  const selectedHorse =
    isEdit && pairing?.horses
      ? pairing.horses
      : horse ||
        availableHorses.find((h) => String(h.id) === String(formData.horse_id)) ||
        horses.find((h) => String(h.id) === String(formData.horse_id)) ||
        null;

  // Selected rider : en mode édition, utiliser directement les données du pairing
  const selectedRider =
    isEdit && pairing?.riders
      ? pairing.riders
      : rider ||
        availableRiders.find((r) => String(r.id) === String(formData.rider_id)) ||
        riders.find((r) => String(r.id) === String(formData.rider_id)) ||
        null;

  const handleFormSubmit = async (e) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    setError(null);

    // Validation du nombre de jours par semaine
    const loanDaysPerWeek = Number(formData.loan_days_per_week || 0);
    if (isLoanPairing(formData) && !isValidLoanDaysPerWeek(loanDaysPerWeek)) {
      setError('Le nombre de jours par semaine doit être compris entre 1 et 7');
      return;
    }

    if (!validateForm()) return;

    try {
      // ✅ Passer formData directement - loan_days est déjà dedans
      await onSubmit(formData);
    } catch (err) {
      console.error('❌ Error submitting pairing form:', err);
      setError(err?.message || 'Une erreur est survenue lors de la sauvegarde');
    }
  };

  // Défauts sûrs pour loan_days
  const loanDays = Array.isArray(formData.loan_days) ? formData.loan_days : [];

  // Configs pour les badges
  const ownLinkConfig = getRiderHorseLinkConfig(RIDER_HORSE_LINK_TYPE.OWN);
  const loanLinkConfig = getRiderHorseLinkConfig(RIDER_HORSE_LINK_TYPE.LOAN);

  return (
    <form onSubmit={handleFormSubmit} className="pairing-form-modern" noValidate>
      {/* Message d'erreur global */}
      {error && (
        <div className="alert alert-error" style={{ marginBottom: '20px' }}>
          <Icons.Warning />
          <span>{error}</span>
        </div>
      )}

      {/* Section 1 : Sélection du cheval (si depuis RiderCard) */}
      {isFromRiderCard && (
        <div className="pairing-form-section">
          <div className="pairing-form-section-header">
            <div className="pairing-form-section-icon">
              <Icons.Horse />
            </div>
            <h3 className="pairing-form-section-title">Sélection du cheval</h3>
          </div>

          {isEdit ? (
            <div className="horse-selection-card">
              <div className="horse-info">
                {selectedHorse && (
                  <div className="horse-name">
                    {selectedHorse?.name ?? 'N/A'}
                    {selectedHorse.kind && (
                      <DomainBadge config={getHorseTypeConfig(selectedHorse.kind)} />
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : availableHorses.length === 0 ? (
            <div className="alert alert-warning">
              <Icons.Warning />
              <span>Aucun cheval actif disponible. Veuillez d'abord activer des chevaux.</span>
            </div>
          ) : (
            <select
              id="horse_id"
              name="horse_id"
              value={formData.horse_id ?? ''}
              onChange={handleChange}
              className="form-select"
              required
              autoFocus
            >
              <option value="">Sélectionner un cheval</option>
              {availableHorses.map((horse) => {
                const horseTypeConfig = getHorseTypeConfig(horse.kind);
                return (
                  <option key={horse.id} value={horse.id}>
                    {horse.name} ({horseTypeConfig?.label || horse.kind})
                  </option>
                );
              })}
            </select>
          )}
        </div>
      )}

      {/* Section 1 : Sélection du cavalier (si depuis HorseCard) */}
      {isFromHorseCard && (
        <div className="pairing-form-section">
          <div className="pairing-form-section-header">
            <div className="pairing-form-section-icon">
              <Icons.User />
            </div>
            <h3 className="pairing-form-section-title">Sélection du cavalier</h3>
          </div>

          {isEdit ? (
            <div className="horse-selection-card">
              <div className="horse-info">
                {selectedRider && (
                  <div className="horse-name">
                    {selectedRider?.name ?? 'N/A'}
                    {selectedRider.rider_type && (
                      <DomainBadge config={getRiderTypeConfig(selectedRider.rider_type)} />
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : availableRiders.length === 0 ? (
            <div className="alert alert-warning">
              <Icons.Warning />
              <span>Aucun cavalier actif disponible. Veuillez d'abord activer des cavaliers.</span>
            </div>
          ) : (
            <select
              id="rider_id"
              name="rider_id"
              value={formData.rider_id ?? ''}
              onChange={handleChange}
              className="form-select"
              required
              autoFocus
            >
              <option value="">Sélectionner un cavalier</option>
              {availableRiders.map((rider) => {
                const riderTypeConfig = getRiderTypeConfig(rider.rider_type);
                return (
                  <option key={rider.id} value={rider.id}>
                    {rider.name} ({riderTypeConfig?.label || rider.rider_type})
                  </option>
                );
              })}
            </select>
          )}
        </div>
      )}

      {/* Section 2 : Dates de la pension */}
      <div className="pairing-form-section">
        <div className="pairing-form-section-header">
          <div className="pairing-form-section-icon">
            <Icons.Calendar />
          </div>
          <h3 className="pairing-form-section-title">Période de la pension</h3>
        </div>

        <div className="dates-grid">
          <div className="date-input-wrapper">
            <label htmlFor="pairing_start_date">
              <Icons.Check />
              Date de début <span className="required">*</span>
            </label>
            <input
              type="date"
              id="pairing_start_date"
              name="pairing_start_date"
              value={formData.pairing_start_date ?? ''}
              onChange={handleChange}
              required
            />
          </div>

          <div className="date-input-wrapper">
            <label htmlFor="pairing_end_date">
              <Icons.Warning />
              Date de fin
            </label>
            <input
              type="date"
              id="pairing_end_date"
              name="pairing_end_date"
              value={formData.pairing_end_date ?? ''}
              onChange={handleChange}
            />
            <div className="date-input-helper">
              <Icons.Info />
              <span>Laisser vide si toujours active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3 : Type de lien */}
      <div className="pairing-form-section">
        <div className="pairing-form-section-header">
          <div className="pairing-form-section-icon">
            <Icons.Link />
          </div>
          <h3 className="pairing-form-section-title">Type de relation</h3>
        </div>

        <div className="link-type-selector">
          <div className="link-type-option">
            <input
              type="radio"
              id="link_type_own"
              name="link_type"
              value={RIDER_HORSE_LINK_TYPE.OWN}
              checked={formData.link_type === RIDER_HORSE_LINK_TYPE.OWN}
              onChange={handleChange}
            />
            <label htmlFor="link_type_own" className="link-type-label">
              <div className="link-type-icon">
                <Icons.User />
              </div>
              <span className="link-type-text">{ownLinkConfig?.label}</span>
            </label>
          </div>

          <div className="link-type-option">
            <input
              type="radio"
              id="link_type_loan"
              name="link_type"
              value={RIDER_HORSE_LINK_TYPE.LOAN}
              checked={formData.link_type === RIDER_HORSE_LINK_TYPE.LOAN}
              onChange={handleChange}
            />
            <label htmlFor="link_type_loan" className="link-type-label">
              <div className="link-type-icon">
                <Icons.Calendar />
              </div>
              <span className="link-type-text">{loanLinkConfig?.label}</span>
            </label>
          </div>
        </div>

        {/* Loan settings */}
        {isLoanPairing(formData) && (
          <div className="loan-settings">
            <div className="loan-days-input">
              <label htmlFor="loan_days_per_week">
                <Icons.Tag />
                Nombre de jours par semaine
              </label>
              <input
                type="number"
                id="loan_days_per_week"
                name="loan_days_per_week"
                value={formData.loan_days_per_week ?? 1}
                onChange={handleChange}
                min={1}
                max={7}
              />
            </div>

            <div>
              <div className="days-selector-label">
                <Icons.Calendar />
                Sélectionnez les jours
              </div>
              <div className="days-selector-grid">
                {WEEK_DAYS_EN.map((dayEn) => {
                  const selected = loanDays.includes(dayEn);
                  const disabled =
                    !selected && loanDays.length >= Number(formData.loan_days_per_week || 0);
                  return (
                    <button
                      type="button"
                      key={dayEn}
                      onClick={() => toggleLoanDay(dayEn)}
                      disabled={disabled}
                      className={`day-button ${selected ? 'selected' : ''}`}
                    >
                      {weekDayCodeToFr(dayEn)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div
        className="pairing-form-actions"
        style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}
      >
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Annuler
        </button>

        <button type="submit" className="btn btn-primary">
          {isEdit ? 'Modifier' : 'Créer'}
        </button>
      </div>
    </form>
  );
}

PairingForm.propTypes = {
  pairing: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    rider_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    horse_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    pairing_start_date: PropTypes.string,
    pairing_end_date: PropTypes.string,
    link_type: PropTypes.string,
    loan_days_per_week: PropTypes.number,
    loan_days: PropTypes.arrayOf(PropTypes.string),
    riders: PropTypes.object,
    horses: PropTypes.object,
  }),
  horses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      kind: PropTypes.string,
      activity_start_date: PropTypes.string,
      activity_end_date: PropTypes.string,
    })
  ),
  riders: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      rider_type: PropTypes.string,
      activity_start_date: PropTypes.string,
      activity_end_date: PropTypes.string,
    })
  ),
  rider: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    rider_type: PropTypes.string,
  }),
  riderId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  horse: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    kind: PropTypes.string,
  }),
  horseId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default PairingForm;
