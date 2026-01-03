import { useState, useEffect } from 'react';
import { templatesApi } from '../services/calendarApi';
import { ridersApi, horsesApi } from '../services/api';

/**
 * Custom hook for managing template form state and operations
 * @param {Object} template - Existing template to edit (null for new template)
 * @param {Function} onSuccess - Callback function on successful save
 * @returns {Object} Form state and handlers
 */
export function useTemplateForm(template, onSuccess) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    lesson_type: 'group',
    start_time: '19:00',
    duration_minutes: 60,
    valid_from: new Date().toISOString().split('T')[0],
    valid_until: '',
    max_participants: 8,
    min_participants: 2,
    recurrence_rule: {
      frequency: 'weekly',
      interval: 1,
      byDay: ['monday'],
      startTime: '19:00',
      duration: 60,
    },
  });

  const [riders, setRiders] = useState([]);
  const [horses, setHorses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
    if (template) {
      initializeFormData(template);
    }
  }, [template]);

  const loadData = async () => {
    try {
      const [ridersData, horsesData] = await Promise.all([ridersApi.getAll(), horsesApi.getAll()]);
      setRiders(ridersData);
      setHorses(horsesData);
    } catch (err) {
      console.error('Error loading data:', err);
    }
  };

  const initializeFormData = (template) => {
    let recurrenceRule = template.recurrence_rule;
    if (typeof recurrenceRule === 'string') {
      try {
        recurrenceRule = JSON.parse(recurrenceRule);
      } catch (e) {
        console.error('Error parsing recurrence_rule:', e);
        recurrenceRule = {
          frequency: 'weekly',
          interval: 1,
          byDay: ['monday'],
          startTime: template.start_time || '19:00',
          duration: template.duration_minutes || 60,
        };
      }
    }

    const templateData = {
      ...template,
      valid_from: template.valid_from || new Date().toISOString().split('T')[0],
      valid_until: template.valid_until || '',
      recurrence_rule: recurrenceRule,
    };

    if (template.lesson_type === 'blocked') {
      templateData.max_participants = 0;
      templateData.min_participants = 0;
    }

    setFormData(templateData);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const updated = {
        ...prev,
        [field]: value,
      };

      // Handle lesson type changes
      if (field === 'lesson_type') {
        if (value === 'blocked') {
          updated.max_participants = 0;
          updated.min_participants = 0;
        } else if (prev.lesson_type === 'blocked') {
          // Restore default values when changing from blocked
          if (value === 'private') {
            updated.max_participants = 1;
            updated.min_participants = 1;
          } else if (value === 'group') {
            updated.max_participants = 8;
            updated.min_participants = 2;
          } else {
            updated.max_participants = 8;
            updated.min_participants = 1;
          }
        }
      }

      // Sync with recurrence_rule
      if (field === 'start_time') {
        updated.recurrence_rule = {
          ...prev.recurrence_rule,
          startTime: value,
        };
      }
      if (field === 'duration_minutes') {
        updated.recurrence_rule = {
          ...prev.recurrence_rule,
          duration: parseInt(value) || 60,
        };
      }

      return updated;
    });
  };

  const handleRecurrenceChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      recurrence_rule: {
        ...prev.recurrence_rule,
        [field]: value,
      },
    }));
  };

  const handleDayToggle = (day) => {
    const currentDays = formData.recurrence_rule.byDay || [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter((d) => d !== day)
      : [...currentDays, day];

    handleRecurrenceChange('byDay', newDays);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const submitData = prepareSubmitData();

      // Validate
      if (
        submitData.recurrence_rule.frequency === 'weekly' &&
        (!submitData.recurrence_rule.byDay || submitData.recurrence_rule.byDay.length === 0)
      ) {
        setError('Veuillez sélectionner au moins un jour de la semaine');
        setLoading(false);
        return;
      }

      if (template) {
        await templatesApi.update(template.id, submitData);
      } else {
        await templatesApi.create(submitData);
      }
      onSuccess();
    } catch (err) {
      console.error('Submit error:', err);
      const errorMessage =
        err.response?.data?.error || err.message || 'Erreur lors de la sauvegarde';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const prepareSubmitData = () => {
    const submitData = { ...formData };

    // Ensure recurrence_rule is properly formatted
    if (typeof submitData.recurrence_rule === 'object') {
      submitData.recurrence_rule = {
        frequency: submitData.recurrence_rule.frequency || 'weekly',
        interval: parseInt(submitData.recurrence_rule.interval) || 1,
        byDay: submitData.recurrence_rule.byDay || [],
        startTime: submitData.start_time,
        duration: parseInt(submitData.duration_minutes) || 60,
      };
    }

    // Handle participants based on lesson type
    if (submitData.lesson_type === 'blocked') {
      submitData.max_participants = 0;
      submitData.min_participants = 0;
    } else {
      if (submitData.max_participants !== undefined && submitData.max_participants !== null) {
        submitData.max_participants = parseInt(submitData.max_participants);
        if (isNaN(submitData.max_participants)) {
          submitData.max_participants = null;
        }
      }

      if (submitData.min_participants !== undefined && submitData.min_participants !== null) {
        submitData.min_participants = parseInt(submitData.min_participants);
        if (isNaN(submitData.min_participants) || submitData.min_participants < 1) {
          submitData.min_participants = 1;
        }
      }
    }

    return submitData;
  };

  return {
    formData,
    riders,
    horses,
    loading,
    error,
    handleChange,
    handleRecurrenceChange,
    handleDayToggle,
    handleSubmit,
  };
}