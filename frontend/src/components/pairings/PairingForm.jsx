import PropTypes from 'prop-types';
import { usePairingForm } from '../../hooks/usePairingForm';
import {
  RIDER_HORSE_LINK_TYPE,
  getRiderHorseLinkLabel,
  isLoanPairing,
  isValidLoanDaysPerWeek,
} from '../../lib/domain/index.js';
import { isActive } from '../../lib/helpers';
import { Icons } from '../../lib/icons';
import '../../styles/components/pairing.css';

/**
 * PairingForm - Formulaire modernisé pour attribuer un cheval à un cavalier
 */
function PairingForm({ pairing, horses = [], rider, riderId, onSubmit, onCancel }) {
  const {
    formData,
    error,
    submitting,
    handleChange,
    toggleLoanDay,
    validateForm,
    setError,
    setSubmitting,
  } = usePairingForm(pairing, rider, riderId);

  const isEdit = !!pairing;

  // Debug logs
  console.log('🎨 PairingForm render:', {
    isEdit,
    pairing,
    formData,
    horses: horses?.length,
  });

  // Labels des jours
  const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  // Chevaux actifs uniquement
  const availableHorses =
    horses?.filter((horse) => isActive(horse.activity_start_date, horse.activity_end_date)) || [];

  // selectedHorse : en mode édition, utiliser directement les données du pairing
  // sinon chercher dans les listes de chevaux
  const selectedHorse =
    isEdit && pairing?.horses
      ? pairing.horses
      : availableHorses.find((h) => String(h.id) === String(formData.horse_id)) ||
        horses.find((h) => String(h.id) === String(formData.horse_id)) ||
        null;

  console.log('🐴 Selected horse:', {
    isEdit,
    'pairing.horses': pairing?.horses,
    'formData.horse_id': formData.horse_id,
    selectedHorse,
  });

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
      setSubmitting(true);
      await onSubmit(riderId, formData);
    } catch (err) {
      console.error('❌ Error submitting pairing form:', err);
      setError(err?.message || 'Une erreur est survenue lors de la sauvegarde');
    } finally {
      setSubmitting(false);
    }
  };

  // Défauts sûrs pour loan_days
  const loanDays = Array.isArray(formData.loan_days) ? formData.loan_days : [];

  return (
    <form onSubmit={handleFormSubmit} className="pairing-form-modern" noValidate>
      {/* Message d'erreur global */}
      {error && (
        <div className="alert alert-error" style={{ marginBottom: '20px' }}>
          <Icons.Warning />
          <span>{error}</span>
        </div>
      )}

      {/* Section 1 : Sélection du cheval */}
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
                  <span className={`badge badge-${selectedHorse.kind ?? 'horse'}`}>
                    {selectedHorse.kind === 'horse' ? 'Cheval' : 'Poney'}
                  </span>
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
            {availableHorses.map((horse) => (
              <option key={horse.id} value={horse.id}>
                {horse.name} ({horse.kind === 'horse' ? 'Cheval' : 'Poney'})
              </option>
            ))}
          </select>
        )}
      </div>

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
              <span className="link-type-text">
                {getRiderHorseLinkLabel(RIDER_HORSE_LINK_TYPE.OWN)}
              </span>
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
              <span className="link-type-text">
                {getRiderHorseLinkLabel(RIDER_HORSE_LINK_TYPE.LOAN)}
              </span>
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
                {DAYS.map((dayLabel, index) => {
                  const selected = loanDays.includes(index);
                  const disabled =
                    !selected && loanDays.length >= Number(formData.loan_days_per_week || 0);
                  return (
                    <button
                      type="button"
                      key={index}
                      onClick={() => toggleLoanDay(index)}
                      disabled={disabled || submitting}
                      className={`day-button ${selected ? 'selected' : ''}`}
                    >
                      {dayLabel}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="pairing-form-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
          disabled={submitting}
        >
          <Icons.Cancel />
          Annuler
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? (
            <>
              <Icons.Loading className="spin" />
              Enregistrement...
            </>
          ) : (
            <>
              <Icons.Check />
              {isEdit ? 'Modifier' : 'Créer'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}

PairingForm.propTypes = {
  pairing: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    horse_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    pairing_start_date: PropTypes.string,
    pairing_end_date: PropTypes.string,
    link_type: PropTypes.string,
    loan_days_per_week: PropTypes.number,
    loan_days: PropTypes.arrayOf(PropTypes.number),
  }),
  horses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      kind: PropTypes.string,
      activity_start_date: PropTypes.string,
      activity_end_date: PropTypes.string,
    })
  ).isRequired,
  rider: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    rider_type: PropTypes.string,
  }).isRequired,
  riderId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default PairingForm;
