import { useState } from 'react';
import { lessonsApi } from '../services/calendarApi';
import { calculateDurationInMinutes, addMinutesToTime } from '../utils/formatters';

/**
 * Custom hook for managing lesson edit mode
 * @param {Object} lessonData - Current lesson data
 * @param {Function} onSaveSuccess - Callback on successful save
 * @returns {Object} Edit state and handlers
 */
export const useLessonEdit = (lessonData, onSaveSuccess) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState(null);

  const handleStartEdit = () => {
    setIsEditing(true);
    setEditError(null);
    setEditFormData({
      name: lessonData.name,
      lesson_date: lessonData.lesson_date,
      start_time: lessonData.start_time,
      end_time: lessonData.end_time,
      lesson_type: lessonData.lesson_type,
      description: lessonData.description || '',
      max_participants: lessonData.max_participants || 1,
      min_participants: lessonData.min_participants || '',
      status: lessonData.status || 'scheduled',
      cancellation_reason: lessonData.cancellation_reason || '',
      not_given_by_laury: lessonData.not_given_by_laury || false,
      not_given_reason: lessonData.not_given_reason || '',
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditFormData({});
    setEditError(null);
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    // If start_time is changed, calculate new end_time based on duration
    if (name === 'start_time') {
      const durationMinutes = calculateDurationInMinutes(
        editFormData.start_time,
        editFormData.end_time
      );
      const newEndTime = addMinutesToTime(value, durationMinutes);

      setEditFormData((prev) => ({
        ...prev,
        [name]: value,
        end_time: newEndTime,
      }));
    } else {
      setEditFormData((prev) => ({
        ...prev,
        [name]: fieldValue,
      }));
    }
  };

  const handleTypeChange = (e, lessonTypes) => {
    const type = e.target.value;
    const typeConfig = lessonTypes.find((t) => t.value === type);

    setEditFormData((prev) => ({
      ...prev,
      lesson_type: type,
      max_participants: typeConfig?.defaultMax || 1,
    }));
  };

  const handleSaveEdit = async (lessonId) => {
    setSaving(true);
    setEditError(null);

    try {
      // Validation
      if (editFormData.start_time >= editFormData.end_time) {
        throw new Error("L'heure de fin doit être après l'heure de début");
      }

      await lessonsApi.update(lessonId, editFormData);
      setIsEditing(false);
      
      if (onSaveSuccess) {
        await onSaveSuccess();
      }
    } catch (err) {
      setEditError(err.response?.data?.error || err.message || 'Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  return {
    isEditing,
    editFormData,
    saving,
    editError,
    handleStartEdit,
    handleCancelEdit,
    handleEditChange,
    handleTypeChange,
    handleSaveEdit,
    setEditFormData,
  };
};