import { useState, useEffect } from 'react';
import { ridersApi, horsesApi } from '../services';
import { lessonsApi } from '../services/calendarApi';

/**
 * Custom hook for managing lesson participants
 * @param {number} lessonId - Lesson ID
 * @param {Function} onUpdate - Callback when participants change
 * @returns {Object} Participant management state and handlers
 */
export const useParticipants = (lessonId, onUpdate) => {
  const [riders, setRiders] = useState([]);
  const [horses, setHorses] = useState([]);
  const [selectedRiderId, setSelectedRiderId] = useState('');
  const [selectedHorseId, setSelectedHorseId] = useState('');
  const [showAddParticipant, setShowAddParticipant] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRidersAndHorses();
  }, []);

  const loadRidersAndHorses = async () => {
    try {
      setLoading(true);
      const [ridersData, horsesData] = await Promise.all([
        ridersApi.getAll(),
        horsesApi.getAll(),
      ]);
      setRiders(ridersData);
      setHorses(horsesData);
    } catch (err) {
      console.error('Error loading riders/horses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddParticipant = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const riderId = parseInt(formData.get('rider_id'));
    const horseId = formData.get('horse_id') ? parseInt(formData.get('horse_id')) : null;

    try {
      await lessonsApi.addParticipant(lessonId, {
        rider_id: riderId,
        horse_id: horseId,
        horse_assignment_type: horseId ? 'manual' : 'none',
      });
      
      // Reset form
      setShowAddParticipant(false);
      setSelectedRiderId('');
      setSelectedHorseId('');
      
      if (onUpdate) {
        await onUpdate();
      }
    } catch (err) {
      alert(err.response?.data?.error || "Erreur lors de l'ajout du participant");
    }
  };

  const handleRemoveParticipant = async (participantId) => {
    if (!confirm('Êtes-vous sûr de vouloir retirer ce participant ?')) return;

    try {
      await lessonsApi.removeParticipant(lessonId, participantId);
      
      if (onUpdate) {
        await onUpdate();
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Erreur lors du retrait du participant');
    }
  };

  const resetParticipantForm = () => {
    setShowAddParticipant(false);
    setSelectedRiderId('');
    setSelectedHorseId('');
  };

  return {
    riders,
    horses,
    selectedRiderId,
    setSelectedRiderId,
    selectedHorseId,
    setSelectedHorseId,
    showAddParticipant,
    setShowAddParticipant,
    loading,
    handleAddParticipant,
    handleRemoveParticipant,
    resetParticipantForm,
  };
};