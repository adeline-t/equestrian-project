import { useEffect, useState } from 'react';
import {
  RIDER_HORSE_LINK_TYPE,
  RIDER_TYPES,
  isLoanPairing,
  isValidLoanDaysPerWeek,
} from '../lib/domain/index.js';
import { getTodayISO } from '../lib/helpers/index.js';
import riderService from '../services/riderService.js';
import horseService from '../services/horseService.js';

/**
 * Custom hook for managing pairing form data and operations
 */
export function usePairingForm(pairing, riderId, horseId) {
  const [rider, setRider] = useState(null);
  const [horse, setHorse] = useState(null);
  const [formData, setFormData] = useState(null); // <-- null until initialized
  const [error, setError] = useState('');

  const [allRiders, setAllRiders] = useState([]);
  const [loadingRiders, setLoadingRiders] = useState(false);
  const [allHorses, setAllHorses] = useState([]);
  const [loadingHorses, setLoadingHorses] = useState(false);
  useEffect(() => {
    const pairingRiderId = pairing?.rider_id ?? riderId;
    if (!pairingRiderId) return;

    const fetchRiderAndHorses = async () => {
      try {
        setLoadingRiders(true);
        setLoadingHorses(true);

        // Charger tous les riders
        const ridersData = await riderService.getAll();
        setAllRiders(ridersData || []);

        // Trouver le rider correspondant
        const selectedRider = ridersData.find((r) => r.id === parseInt(pairingRiderId));
        setRider(selectedRider || null);

        // Charger tous les chevaux pour la sélection
        const horsesData = await horseService.getAll();
        setAllHorses(horsesData || []);
      } catch (err) {
        console.error('Error loading rider or horses:', err);
      } finally {
        setLoadingRiders(false);
        setLoadingHorses(false);
      }
    };

    fetchRiderAndHorses();
  }, [riderId]);

  useEffect(() => {
    const pairingHorseId = pairing?.horse_id ?? horseId;
    if (!pairingHorseId) return;

    const fetchHorseAndRiders = async () => {
      try {
        setLoadingHorses(true);
        setLoadingRiders(true);

        // Charger tous les chevaux
        const horsesData = await horseService.getAll();
        setAllHorses(horsesData || []);

        // Charger tous les riders
        const ridersData = await riderService.getAll();
        setAllRiders(ridersData || []);

        const selectedHorse = horsesData.find((h) => h.id === parseInt(pairingHorseId));
        setHorse(selectedHorse || null);
      } catch (err) {
        console.error('Error loading horse or riders:', err);
      } finally {
        setLoadingHorses(false);
        setLoadingRiders(false);
      }
    };

    fetchHorseAndRiders();
  }, [horseId]);

  useEffect(() => {
    if (pairing) {
      // mode édition
      setFormData({
        rider_id: pairing.rider_id ? parseInt(pairing.rider_id) : null,
        horse_id: pairing.horse_id ? parseInt(pairing.horse_id) : null,
        pairing_start_date: pairing.pairing_start_date || getTodayISO(),
        pairing_end_date: pairing.pairing_end_date || '',
        link_type: pairing.link_type || RIDER_HORSE_LINK_TYPE.OWN,
        loan_days_per_week: pairing.loan_days_per_week || 1,
        loan_days: Array.isArray(pairing.loan_days) ? pairing.loan_days : [],
      });
      return;
    }

    // mode création : ne créer le formData que si rider ou horse est prêt
    if ((riderId && rider) || (horseId && horse)) {
      const defaultLinkType =
        rider?.rider_type === RIDER_TYPES.OWNER
          ? RIDER_HORSE_LINK_TYPE.OWN
          : RIDER_HORSE_LINK_TYPE.LOAN;
      const defaultLoanDaysPerWeek = rider?.rider_type === RIDER_TYPES.OWNER ? 0 : 1;

      setFormData({
        rider_id: riderId ? parseInt(riderId) : null,
        horse_id: horseId ? parseInt(horseId) : null,
        pairing_start_date: getTodayISO(),
        pairing_end_date: '',
        link_type: defaultLinkType,
        loan_days_per_week: defaultLoanDaysPerWeek,
        loan_days: [],
      });
    }
  }, [pairing, rider, horse, riderId, horseId]);

  // --- Handlers ---
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
      if (name === 'loan_days_per_week' && updated.loan_days) {
        updated.loan_days = updated.loan_days.slice(0, finalValue);
      }
      return updated;
    });

    if (error) setError('');
  };

  const toggleLoanDay = (dayCode) => {
    if (!isLoanPairing(formData)) return;
    setFormData((prev) => {
      const daysSet = new Set(prev.loan_days || []);
      if (daysSet.has(dayCode)) daysSet.delete(dayCode);
      else if (daysSet.size < (prev.loan_days_per_week || 1)) daysSet.add(dayCode);
      return { ...prev, loan_days: Array.from(daysSet).sort() };
    });
  };

  const validateForm = () => {
    if (!formData.rider_id || !formData.horse_id || !formData.pairing_start_date) {
      const missingFields = [];
      if (!formData.rider_id) missingFields.push('Cavalier');
      if (!formData.horse_id) missingFields.push('Cheval');
      if (!formData.pairing_start_date) missingFields.push('Date de début');
      const errorMsg = `Les champs suivants sont requis: ${missingFields.join(', ')}`;
      setError(errorMsg);
      console.error('❌ Validation failed:', errorMsg);
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

    return true;
  };

  const resetForm = () => {
    if (!rider) return;
    const defaultLinkType =
      rider.rider_type === RIDER_TYPES.OWNER
        ? RIDER_HORSE_LINK_TYPE.OWN
        : RIDER_HORSE_LINK_TYPE.LOAN;
    const defaultLoanDaysPerWeek = rider.rider_type === RIDER_TYPES.OWNER ? 0 : 1;

    setFormData({
      rider_id: riderId ? parseInt(riderId) : null,
      horse_id: horseId ? parseInt(horseId) : null,
      pairing_start_date: getTodayISO(),
      pairing_end_date: '',
      link_type: defaultLinkType,
      loan_days_per_week: defaultLoanDaysPerWeek,
      loan_days: [],
    });
    setError('');
  };

  return {
    formData,
    error,
    setFormData,
    setError,
    handleChange,
    toggleLoanDay,
    validateForm,
    resetForm,
    allRiders,
    allHorses,
    loadingRiders,
    loadingHorses,
    rider,
    horse,
  };
}
