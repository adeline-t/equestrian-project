import React from 'react';
import PropTypes from 'prop-types';
import { Icons } from '../../lib/icons';
import { usePairingForm } from '../../hooks/usePairingForm';
import {
  RIDER_HORSE_LINK_TYPE,
  getRiderHorseLinkLabel,
  isLoanPairing,
  isValidLoanDaysPerWeek,
} from '../../lib/domain/pairings';
import { RIDER_TYPES } from '../../lib/domain/riders';
import { isActive } from '../../lib/helpers';

/**
 * PairingForm - Formulaire pour attribuer un cheval à un cavalier
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

  // Labels des jours
  const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  // Chevaux actifs uniquement — retourner la valeur du filtre
  const availableHorses =
    horses?.filter((horse) => isActive(horse.activity_start_date, horse.activity_end_date)) || [];

  // selectedHorse parmi les chevaux disponibles (ou parmi tous si nécessaire)
  const selectedHorse =
    availableHorses.find((h) => String(h.id) === String(formData.horse_id)) ||
    horses.find((h) => String(h.id) === String(formData.horse_id)) ||
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
      setSubmitting(true);
      // Appel du onSubmit fourni par le parent.
      // Signature attendue : onSubmit(riderId, pairingData)
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
    <form onSubmit={handleFormSubmit} className="pairing-form-minimal" noValidate>
      {error && (
        <div
          className="alert alert-error"
          style={{ marginBottom: '16px', display: 'flex', gap: 8, alignItems: 'center' }}
        >
          <Icons.Warning />
          <span>{error}</span>
        </div>
      )}

      {/* Sélection du cheval */}
      <div className="form-group" style={{ marginBottom: '20px' }}>
        <label
          htmlFor="horse_id"
          style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}
        >
          Cheval <span className="required">*</span>
        </label>
        {isEdit ? (
          <div
            style={{
              padding: '12px',
              background: 'var(--color-gray-50)',
              border: '1px solid var(--color-gray-200)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Icons.Horse />
            <span style={{ fontWeight: 500 }}>{selectedHorse?.name ?? 'N/A'}</span>
            {selectedHorse && (
              <span className={`badge badge-${selectedHorse.kind ?? 'horse'}`}>
                {selectedHorse.kind === 'horse' ? 'Cheval' : 'Poney'}
              </span>
            )}
          </div>
        ) : availableHorses.length === 0 ? (
          <div
            className="alert alert-warning"
            style={{ display: 'flex', gap: 8, alignItems: 'center' }}
          >
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

      {/* Dates */}
      <div
        className="form-row"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          marginBottom: '20px',
        }}
      >
        <div>
          <label
            htmlFor="pairing_start_date"
            style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}
          >
            Date de début <span className="required">*</span>
          </label>
          <input
            type="date"
            id="pairing_start_date"
            name="pairing_start_date"
            value={formData.pairing_start_date ?? ''}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px' }}
            required
          />
        </div>
        <div>
          <label
            htmlFor="pairing_end_date"
            style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}
          >
            Date de fin
          </label>
          <input
            type="date"
            id="pairing_end_date"
            name="pairing_end_date"
            value={formData.pairing_end_date ?? ''}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px' }}
          />
          <small
            style={{
              fontSize: '0.85em',
              color: 'var(--color-gray-600)',
              marginTop: '4px',
              display: 'block',
            }}
          >
            Laisser vide si toujours active
          </small>
        </div>
      </div>

      {/* Type de lien */}
      <div className="form-group" style={{ marginBottom: '20px' }}>
        <label
          htmlFor="link_type"
          style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}
        >
          Type de lien
        </label>
        <select
          id="link_type"
          name="link_type"
          value={formData.link_type ?? RIDER_HORSE_LINK_TYPE.LOAN}
          onChange={handleChange}
          className="form-select"
        >
          <option value={RIDER_HORSE_LINK_TYPE.OWN}>
            {getRiderHorseLinkLabel(RIDER_HORSE_LINK_TYPE.OWN)}
          </option>
          <option value={RIDER_HORSE_LINK_TYPE.LOAN}>
            {getRiderHorseLinkLabel(RIDER_HORSE_LINK_TYPE.LOAN)}
          </option>
        </select>
      </div>

      {/* Loan settings */}
      {isLoanPairing(formData) && (
        <>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label
              htmlFor="loan_days_per_week"
              style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}
            >
              Jours par semaine
            </label>
            <input
              type="number"
              id="loan_days_per_week"
              name="loan_days_per_week"
              value={formData.loan_days_per_week ?? 1}
              onChange={handleChange}
              min={1}
              max={7}
              style={{ width: '100%', padding: '8px' }}
            />
          </div>

          {/* Sélection des jours */}
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
              Sélectionnez les jours
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
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
                    className={`btn btn-sm ${selected ? 'btn-primary' : 'btn-outline'}`}
                  >
                    {dayLabel}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
          disabled={submitting}
        >
          Annuler
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? (
            <>
              <Icons.Loading className="spin" />
              <span style={{ marginLeft: 8 }}>Enregistrement...</span>
            </>
          ) : (
            <>{isEdit ? 'Modifier' : 'Créer'}</>
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
  onSubmit: PropTypes.func.isRequired, // signature: (riderId, pairingData) => Promise
  onCancel: PropTypes.func.isRequired,
};

export default PairingForm;
