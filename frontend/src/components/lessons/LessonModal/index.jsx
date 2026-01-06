import React, { useState } from 'react';
import { lessonsApi } from '../../../services/calendarApi';
import Portal from '../../common/Portal';
import { Icons } from '../../../lib/libraries/icons.jsx';
import { formatTime } from '../../../lib/helpers/shared/formatters/time.js';
import { getLessonTypeIcon, isBlockedLesson, LESSON_TYPES } from '../../../constants/domains/lessons/types.js';
import { useLessonData, useLessonEdit, useParticipants } from '../../../hooks/index.js';
import LessonDetailsTab from './LessonDetailsTab';
import LessonEditForm from './LessonEditForm/index.jsx';
import LessonParticipantsTab from './LessonParticipantsTab';
import LessonAdvancedTab from './LessonAdvancedTab';
import '../../../styles/components/lessons.css';

/**
 * Refactored LessonModal Component
 * Separated into smaller, focused sub-components with custom hooks
 */
function LessonModal({ lesson, onClose, onUpdate }) {
  const [activeTab, setActiveTab] = useState('details');

  // Custom hooks for data management
  const { lessonData, loading, error, refresh } = useLessonData(lesson.id);

  const handleSaveSuccess = async () => {
    await refresh();
    if (onUpdate) onUpdate();
  };

  const {
    isEditing,
    editFormData,
    saving,
    editError,
    handleStartEdit: baseHandleStartEdit,
    handleCancelEdit,
    handleEditChange,
    handleTypeChange: baseHandleTypeChange,
    handleSaveEdit,
  } = useLessonEdit(lessonData, handleSaveSuccess);

  // Wrap handleStartEdit to switch to details tab
  const handleStartEdit = () => {
    setActiveTab('details');
    baseHandleStartEdit();
  };

  const {
    riders,
    horses,
    selectedRiderId,
    setSelectedRiderId,
    selectedHorseId,
    setSelectedHorseId,
    showAddParticipant,
    setShowAddParticipant,
    handleAddParticipant,
    handleRemoveParticipant,
    resetParticipantForm,
  } = useParticipants(lesson.id, refresh);

  // Lesson actions
  const handleCancel = async () => {
    const reason = prompt("Raison de l'annulation :");
    if (reason === null) return;

    try {
      await lessonsApi.cancel(lesson.id, reason);
      if (onUpdate) onUpdate();
    } catch (err) {
      alert(err.response?.data?.error || "Erreur lors de l'annulation");
    }
  };

  const handleMarkNotGiven = async () => {
    const reason = prompt("Raison pour laquelle le cours n'a pas été donné :");
    if (reason === null) return;

    try {
      await lessonsApi.markNotGiven(lesson.id, reason);
      if (onUpdate) onUpdate();
    } catch (err) {
      alert(err.response?.data?.error || 'Erreur lors du marquage');
    }
  };

  const handleTypeChange = (e) => {
    baseHandleTypeChange(e, LESSON_TYPES);
  };

  // Loading state
  if (loading) {
    return (
      <Portal>
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="loading">
              <Icons.Loading className="spin" style={{ fontSize: '32px', marginBottom: '12px' }} />
              <p>Chargement...</p>
            </div>
          </div>
        </div>
      </Portal>
    );
  }

  // Error state
  if (error) {
    return (
      <Portal>
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="error">
              <Icons.Warning style={{ fontSize: '32px', marginBottom: '12px' }} />
              <p>{error}</p>
            </div>
            <button className="btn btn-secondary" onClick={onClose}>
              <Icons.Close style={{ marginRight: '8px' }} />
              Fermer
            </button>
          </div>
        </div>
      </Portal>
    );
  }

  if (!lessonData) return null;

  const isBlocked = isBlockedLesson(lessonData.lesson_type);
  const LessonIcon = getLessonTypeIcon(lessonData.lesson_type);

  return (
    <Portal>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content lesson-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>
              <LessonIcon style={{ marginRight: '8px' }} />
              {isEditing
                ? `Modifier: ${editFormData.name || lessonData.name} - ${formatTime(
                    editFormData.start_time || lessonData.start_time
                  )}`
                : `${lessonData.name} - ${formatTime(lessonData.start_time)}`}
            </h2>
            <button className="btn-close" onClick={onClose}>
              <Icons.Close />
            </button>
          </div>

          {/* Tabs */}
          <div className="modal-tabs">
            <button
              className={`tab ${activeTab === 'details' ? 'active' : ''}`}
              onClick={() => setActiveTab('details')}
            >
              <Icons.Info style={{ marginRight: '4px' }} />
              {isEditing ? 'Modifier' : 'Détails'}
            </button>
            {!isBlocked && !isEditing && (
              <button
                className={`tab ${activeTab === 'participants' ? 'active' : ''}`}
                onClick={() => setActiveTab('participants')}
              >
                <Icons.Users style={{ marginRight: '4px' }} />
                Participants ({lessonData.participants?.length || 0})
              </button>
            )}
            {!isBlocked && !isEditing && (
              <button
                className={`tab ${activeTab === 'advanced' ? 'active' : ''}`}
                onClick={() => setActiveTab('advanced')}
              >
                <Icons.Settings style={{ marginRight: '4px' }} />
                Avancé
              </button>
            )}
          </div>

          <div className="modal-body">
            {/* Tab Détails */}
            {activeTab === 'details' && (
              <>
                {isEditing ? (
                  <LessonEditForm
                    editFormData={editFormData}
                    editError={editError}
                    lessonData={lessonData}
                    handleEditChange={handleEditChange}
                    handleTypeChange={handleTypeChange}
                  />
                ) : (
                  <LessonDetailsTab lessonData={lessonData} LessonIcon={LessonIcon} />
                )}
              </>
            )}

            {/* Tab Participants */}
            {activeTab === 'participants' && !isBlocked && (
              <LessonParticipantsTab
                lessonData={lessonData}
                showAddParticipant={showAddParticipant}
                setShowAddParticipant={setShowAddParticipant}
                riders={riders}
                horses={horses}
                selectedRiderId={selectedRiderId}
                setSelectedRiderId={setSelectedRiderId}
                selectedHorseId={selectedHorseId}
                setSelectedHorseId={setSelectedHorseId}
                handleAddParticipant={handleAddParticipant}
                handleRemoveParticipant={handleRemoveParticipant}
                resetParticipantForm={resetParticipantForm}
              />
            )}

            {/* Tab Advanced */}
            {activeTab === 'advanced' && <LessonAdvancedTab lessonData={lessonData} />}
          </div>

          {/* Actions */}
          <div className="modal-footer">
            {isEditing ? (
              /* Edit mode actions */
              <div className="modal-actions-compact">
                <button
                  type="button"
                  className="btn btn-sm btn-secondary"
                  onClick={handleCancelEdit}
                  disabled={saving}
                >
                  <Icons.Cancel style={{ marginRight: '6px', fontSize: '14px' }} />
                  Annuler
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-primary"
                  onClick={() => handleSaveEdit(lesson.id)}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Icons.Loading
                        className="spin"
                        style={{ marginRight: '6px', fontSize: '14px' }}
                      />
                      Sauvegarde...
                    </>
                  ) : (
                    <>
                      <Icons.Check style={{ marginRight: '6px', fontSize: '14px' }} />
                      Sauvegarder
                    </>
                  )}
                </button>
              </div>
            ) : (
              /* Normal mode actions */
              <div className="modal-actions-compact">
                {lessonData.status !== 'cancelled' && (
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={handleStartEdit}
                    title="Modifier le cours"
                  >
                    <Icons.Edit style={{ marginRight: '6px', fontSize: '14px' }} />
                    Modifier
                  </button>
                )}
                {lessonData.status !== 'cancelled' && (
                  <>
                    {!isBlocked && !lessonData.not_given_by_laury && (
                      <button className="btn btn-sm btn-warning" onClick={handleMarkNotGiven}>
                        <Icons.Warning style={{ marginRight: '6px', fontSize: '14px' }} />
                        Non donné
                      </button>
                    )}
                    <button className="btn btn-sm btn-danger" onClick={handleCancel}>
                      <Icons.Close style={{ marginRight: '6px', fontSize: '14px' }} />
                      Annuler
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Portal>
  );
}

export default LessonModal;
