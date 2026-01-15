import { useState, useEffect } from 'react';

export function usePackageForm(packageData, riderId, onSubmit) {
  const [formData, setFormData] = useState({
    services_per_week: String(packageData?.services_per_week ?? 0),
    group_lessons_per_week: String(packageData?.group_lessons_per_week ?? 0),
    is_active: packageData?.is_active ?? true,
  });

  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Réinitialiser le formulaire quand packageData change (create vs edit)
  useEffect(() => {
    setFormData({
      services_per_week: String(packageData?.services_per_week ?? 0),
      group_lessons_per_week: String(packageData?.group_lessons_per_week ?? 0),
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

  // handleSubmit accepte soit un event (submit HTML) soit aucun argument (appel programmatique)
  const handleSubmit = async (e) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }

    setError(null);
    setSubmitting(true);

    try {
      const services = parseInt(formData.services_per_week, 10);
      const lessons = parseInt(formData.group_lessons_per_week, 10);

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
        group_lessons_per_week: lessons,
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
    setFormData, // exposer si besoin pour tests ou reset manuel
  };
}
