import { useState, useEffect } from 'react';

/**
 * Custom hook for managing package form data and operations
 * @param {Object} packageData - The package object for editing
 * @param {string|number} riderId - The rider ID
 * @param {Function} onSubmit - Submit handler
 * @returns {Object} Form data, handlers, and state
 */
export function usePackageForm(packageData, riderId, onSubmit) {
  const [formData, setFormData] = useState({
    services_per_week: String(packageData?.services_per_week ?? 0),
    private_lessons_per_week: String(packageData?.private_lessons_per_week ?? 0),
    is_active: packageData?.is_active ?? true,
  });

  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Reset form when packageData changes (create vs edit)
  useEffect(() => {
    setFormData({
      services_per_week: String(packageData?.services_per_week ?? 0),
      private_lessons_per_week: String(packageData?.private_lessons_per_week ?? 0),
      is_active: packageData?.is_active ?? true,
    });
    setError(null);
    setSubmitting(false);
  }, [packageData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // handleSubmit accepts either an event (HTML submit) or no argument (programmatic call)
  const handleSubmit = async (e) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }

    setError(null);
    setSubmitting(true);

    try {
      const services = parseInt(formData.services_per_week, 10);
      const lessons = parseInt(formData.private_lessons_per_week, 10);

      if (Number.isNaN(services) || Number.isNaN(lessons)) {
        throw new Error('Les champs doivent contenir des nombres entiers valides');
      }

      if (services < 0 || lessons < 0) {
        throw new Error('Les valeurs doivent être positives');
      }

      if (services === 0 && lessons === 0) {
        throw new Error('Le forfait doit contenir au moins un service ou un cours');
      }

      await onSubmit(riderId, {
        services_per_week: services,
        private_lessons_per_week: lessons,
        is_active: formData.is_active,
      });

      setSubmitting(false);
      return true;
    } catch (err) {
      setError(err?.message || "Erreur lors de l'enregistrement");
      setSubmitting(false);
      return false;
    }
  };

  return {
    formData,
    error,
    submitting,
    handleChange,
    handleSubmit,
    setFormData,
  };
}
