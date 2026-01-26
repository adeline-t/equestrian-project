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
import '../../styles/features/pairings/pairings.css';

function PairingForm({
  pairing,
  riderId,
  horseId,
  excludedHorses = [],
  excludedRiders = [],
  onSubmit,
  onCancel,
}) {
  const {
    formData,
    error,
    handleChange,
    toggleLoanDay,
    validateForm,
    setError,
    allRiders,
    allHorses,
    loadingRiders,
    loadingHorses,
    rider,
    horse,
  } = usePairingForm(pairing, riderId, horseId);

  // Wait for formData to be initialized
  if (!formData) {
    return (
      <div className="loading">
        <Icons.Loading className="spin" />
        <p>Chargement du formulaire...</p>
      </div>
    );
  }

  const isEdit = !!pairing;
  const isFromRiderCard = !!riderId;
  const isFromHorseCard = !!horseId;

  // Chevaux actifs et non exclus
  const availableHorses = (allHorses || [])
    .filter((h) => isActive(h.activity_start_date, h.activity_end_date))
    .filter((h) => !excludedHorses.some((used) => used.id === h.id));

  // Cavaliers actifs et non exclus
  const availableRiders = (allRiders || [])
    .filter((r) => isActive(r.activity_start_date, r.activity_end_date))
    .filter((r) => !excludedRiders.some((ex) => String(ex.id) === String(r.id)));

  const handleFormSubmit = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    setError(null);

    // Validate loan days
    const loanDaysPerWeek = Number(formData.loan_days_per_week || 0);
    if (isLoanPairing(formData) && !isValidLoanDaysPerWeek(loanDaysPerWeek)) {
      setError('Le nombre de jours par semaine doit être compris entre 1 et 7');
      return;
    }

    if (!validateForm()) return;

    try {
      await onSubmit(formData);
    } catch (err) {
      console.error('❌ Error submitting pairing form:', err);
      setError(err?.message || 'Une erreur est survenue lors de la sauvegarde');
    }
  };

  const loanDays = Array.isArray(formData.loan_days) ? formData.loan_days : [];

  const ownLinkConfig = getRiderHorseLinkConfig(RIDER_HORSE_LINK_TYPE.OWN);
  const loanLinkConfig = getRiderHorseLinkConfig(RIDER_HORSE_LINK_TYPE.LOAN);

  return (
    <form onSubmit={handleFormSubmit} className="entity-form" noValidate>
      {/* Global error */}
      {error && (
        <div className="alert alert-error">
          <Icons.Warning />
          <span>{error}</span>
        </div>
      )}

      {/* Select horse if from RiderCard */}
      {isFromRiderCard && (
        <div className="form-section">
          <h3>Sélection du cheval</h3>

          {isEdit || horse ? (
            <div className="horse-selection-card">
              <div className="horse-icon">
                <Icons.Horse />
              </div>
              <div className="horse-info">
                <div className="horse-name">
                  {horse?.name ?? 'N/A'}
                  {horse?.kind && <DomainBadge config={getHorseTypeConfig(horse.kind)} />}
                </div>
              </div>
            </div>
          ) : loadingHorses ? (
            <div className="loading">
              <Icons.Loading className="spin" />
              <p>Chargement des chevaux...</p>
            </div>
          ) : availableHorses.length === 0 ? (
            <div className="alert alert-warning">
              <Icons.Warning />
              <span>Aucun cheval actif disponible.</span>
            </div>
          ) : (
            <div className="form-group">
              <label htmlFor="horse_id">
                Cheval <span className="required">*</span>
              </label>
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
                {availableHorses.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name} ({getHorseTypeConfig(h.kind)?.label || h.kind})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Select rider if from HorseCard */}
      {isFromHorseCard && (
        <div className="form-section">
          <h3>Sélection du cavalier</h3>

          {isEdit || rider ? (
            <div className="horse-selection-card">
              <div className="horse-icon">
                <Icons.User />
              </div>
              <div className="horse-info">
                <div className="horse-name">
                  {rider?.name ?? 'N/A'}
                  {rider?.rider_type && (
                    <DomainBadge config={getRiderTypeConfig(rider.rider_type)} />
                  )}
                </div>
              </div>
            </div>
          ) : loadingRiders ? (
            <div className="loading">
              <Icons.Loading className="spin" />
              <p>Chargement des cavaliers...</p>
            </div>
          ) : availableRiders.length === 0 ? (
            <div className="alert alert-warning">
              <Icons.Warning />
              <span>Aucun cavalier actif disponible.</span>
            </div>
          ) : (
            <div className="form-group">
              <label htmlFor="rider_id">
                Cavalier <span className="required">*</span>
              </label>
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
                {availableRiders.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({getRiderTypeConfig(r.rider_type)?.label || r.rider_type})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Dates */}
      <div className="form-section">
        <h3>Période de la pension</h3>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="pairing_start_date">
              Date de début <span className="required">*</span>
            </label>
            <input
              type="date"
              id="pairing_start_date"
              name="pairing_start_date"
              value={formData.pairing_start_date ?? ''}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="pairing_end_date">Date de fin</label>
            <input
              type="date"
              id="pairing_end_date"
              name="pairing_end_date"
              value={formData.pairing_end_date ?? ''}
              onChange={handleChange}
              className="form-input"
            />
            <small className="form-help">Laisser vide si toujours active</small>
          </div>
        </div>
      </div>

      {/* Link type */}
      <div className="form-section">
        <h3>Type de relation</h3>

        <div className="segmented-control">
          <button
            type="button"
            className={`segment-btn ${
              formData.link_type === RIDER_HORSE_LINK_TYPE.OWN ? 'active' : ''
            }`}
            onClick={() =>
              handleChange({
                target: { name: 'link_type', value: RIDER_HORSE_LINK_TYPE.OWN },
              })
            }
          >
            <Icons.User />
            <span>{ownLinkConfig?.label}</span>
          </button>

          <button
            type="button"
            className={`segment-btn ${
              formData.link_type === RIDER_HORSE_LINK_TYPE.LOAN ? 'active' : ''
            }`}
            onClick={() =>
              handleChange({
                target: { name: 'link_type', value: RIDER_HORSE_LINK_TYPE.LOAN },
              })
            }
          >
            <Icons.Calendar />
            <span>{loanLinkConfig?.label}</span>
          </button>
        </div>

        {isLoanPairing(formData) && (
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="loan_days_per_week">Nombre de jours par semaine</label>
              <input
                type="number"
                id="loan_days_per_week"
                name="loan_days_per_week"
                className="form-input"
                value={formData.loan_days_per_week ?? 1}
                onChange={handleChange}
                min={1}
                max={7}
              />
            </div>

            <div className="form-group">
              <label>Sélectionnez les jours</label>
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
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          <Icons.Cancel /> Annuler
        </button>
        <button type="submit" className="btn btn-primary">
          <Icons.Save /> {isEdit ? 'Modifier' : 'Créer'}
        </button>
      </div>
    </form>
  );
}

PairingForm.propTypes = {
  pairing: PropTypes.object,
  riderId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  horseId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  excludedHorses: PropTypes.array,
  excludedRiders: PropTypes.array,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default PairingForm;
