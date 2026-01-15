import { useEffect, useState } from 'react';
import {
  RIDER_HORSE_LINK_TYPE,
  RIDER_TYPES,
  isLoanPairing,
  isValidLoanDaysPerWeek,
} from '../lib/domain/index.js';

/**
 * Custom hook for managing pairing form data and operations
 * @param {Object} pairing - The pairing object for editing
 * @param {Object} rider - Rider object (needed for default link_type)
 * @param {string|number} riderId - Pre-selected rider ID (optional)
 * @returns {Object} Form data, handlers, and state
 */
export function usePairingForm(pairing, rider, riderId) {
  const [formData, setFormData] = useState({
    rider_id: riderId ? parseInt(riderId) : null,
    horse_id: null,
    pairing_start_date: '',
    pairing_end_date: '',
    link_type: RIDER_HORSE_LINK_TYPE.OWN,
    loan_days_per_week: 1,
    loan_days: [], // indices des jours sélectionnés 0=Lun ... 6=Dim
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Initialize formData for edit or creation
  useEffect(() => {
    if (pairing) {
      // Editing mode
      console.log('📝 Initializing form for editing:', pairing);

      // Extract IDs from available data
      // Priority: direct field > joined data > prop
      const extractedRiderId = pairing.rider_id
        ? parseInt(pairing.rider_id)
        : pairing.riders?.id
        ? parseInt(pairing.riders.id)
        : riderId
        ? parseInt(riderId)
        : null;

      const extractedHorseId = pairing.horse_id
        ? parseInt(pairing.horse_id)
        : pairing.horses?.id
        ? parseInt(pairing.horses.id)
        : null;

      console.log('🔑 Extracted IDs:', {
        riderId: extractedRiderId,
        horseId: extractedHorseId,
        from: {
          'pairing.rider_id': pairing.rider_id,
          'pairing.riders?.id': pairing.riders?.id,
          'riderId prop': riderId,
          'pairing.horse_id': pairing.horse_id,
          'pairing.horses?.id': pairing.horses?.id,
        },
      });

      setFormData({
        rider_id: extractedRiderId,
        horse_id: extractedHorseId,
        pairing_start_date: pairing.pairing_start_date || '',
        pairing_end_date: pairing.pairing_end_date || '',
        link_type: pairing.link_type || RIDER_HORSE_LINK_TYPE.OWN,
        loan_days_per_week: pairing.loan_days_per_week || 1,
        loan_days: Array.isArray(pairing.loan_days) ? pairing.loan_days : [],
      });
      console.log(
        '✅ Form initialized with horse_id:',
        extractedHorseId,
        'rider_id:',
        extractedRiderId
      );
    } else if (riderId) {
      // Creating mode with pre-filled riderId
      console.log('🆕 Initializing form for creation with riderId:', riderId);
      setFormData((prev) => ({
        ...prev,
        rider_id: parseInt(riderId),
        link_type:
          rider?.rider_type === RIDER_TYPES.OWNER
            ? RIDER_HORSE_LINK_TYPE.OWN
            : RIDER_HORSE_LINK_TYPE.LOAN,
        loan_days_per_week: rider?.rider_type === RIDER_TYPES.OWNER ? 0 : 1,
        loan_days: [],
      }));
    }
  }, [pairing, rider, riderId]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    const finalValue =
      name === 'rider_id' || name === 'horse_id' || name === 'loan_days_per_week'
        ? value
          ? parseInt(value)
          : null
        : value;

    setFormData((prev) => {
      const updated = { ...prev, [name]: finalValue };

      // If loan_days_per_week changes, trim loan_days array
      if (name === 'loan_days_per_week' && updated.loan_days) {
        updated.loan_days = updated.loan_days.slice(0, finalValue);
      }

      return updated;
    });

    if (error) setError('');
  };

  // Toggle selection of a day in loan_days
  const toggleLoanDay = (dayIndex) => {
    if (!isLoanPairing(formData)) return;

    setFormData((prev) => {
      const daysSet = new Set(prev.loan_days || []);
      if (daysSet.has(dayIndex)) {
        daysSet.delete(dayIndex);
      } else if (daysSet.size < (prev.loan_days_per_week || 1)) {
        daysSet.add(dayIndex);
      }
      return { ...prev, loan_days: Array.from(daysSet).sort() };
    });
  };

  // Basic validation
  const validateForm = () => {
    console.log('🔍 Validating form data:', formData);

    if (!formData.rider_id || !formData.horse_id || !formData.pairing_start_date) {
      const missingFields = [];
      if (!formData.rider_id) missingFields.push('Rider');
      if (!formData.horse_id) missingFields.push('Cheval');
      if (!formData.pairing_start_date) missingFields.push('Date de début');

      const errorMsg = `Les champs suivants sont requis: ${missingFields.join(', ')}`;
      console.error('❌ Validation failed:', errorMsg);
      setError(errorMsg);
      return false;
    }

    if (isLoanPairing(formData)) {
      if (!isValidLoanDaysPerWeek(formData.loan_days_per_week)) {
        setError('Le nombre de jours par semaine doit être compris entre 1 et 7');
        return false;
      }
      if ((formData.loan_days || []).length > formData.loan_days_per_week) {
        setError('Vous ne pouvez pas sélectionner plus de jours que le nombre autorisé');
        return false;
      }
    }

    console.log('✅ Validation passed');
    return true;
  };

  const resetForm = () => {
    setFormData({
      rider_id: riderId ? parseInt(riderId) : null,
      horse_id: null,
      pairing_start_date: '',
      pairing_end_date: '',
      link_type:
        rider?.rider_type === RIDER_TYPES.OWNER
          ? RIDER_HORSE_LINK_TYPE.OWN
          : RIDER_HORSE_LINK_TYPE.LOAN,
      loan_days_per_week: rider?.rider_type === RIDER_TYPES.OWNER ? 0 : 1,
      loan_days: [],
    });
    setError('');
  };

  return {
    formData,
    error,
    submitting,
    setFormData,
    setError,
    setSubmitting,
    handleChange,
    toggleLoanDay,
    validateForm,
    resetForm,
  };
}
