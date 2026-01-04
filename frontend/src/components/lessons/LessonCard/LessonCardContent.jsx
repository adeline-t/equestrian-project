import React from 'react';
import { Icons } from '../../../lib/libraries/icons';

// Constants
const LESSON_TYPE_ICONS = {
  private: Icons.PrivateLesson,
  group: Icons.GroupLesson,
  training: Icons.Training,
  competition: Icons.Competition,
  event: Icons.Event,
  blocked: Icons.Blocked,
};

const LESSON_TYPE_LABELS = {
  private: 'Particulier',
  group: 'Collectif',
  training: 'Stage',
  competition: 'Concours',
  event: 'Événement',
  blocked: 'Bloqué',
};

const STATUS_BADGES = {
  scheduled: { label: 'Planifié', class: 'status-scheduled', icon: Icons.Calendar },
  confirmed: { label: 'Confirmé', class: 'status-confirmed', icon: Icons.Check },
  in_progress: { label: 'En cours', class: 'status-in-progress', icon: Icons.Clock },
  completed: { label: 'Terminé', class: 'status-completed', icon: Icons.Check },
  cancelled: { label: 'Annulé', class: 'status-cancelled', icon: Icons.Close },
  blocked: { label: 'Bloqué', class: 'status-blocked', icon: Icons.Blocked },
};

// Helper functions
const getLessonTypeIcon = (type) => {
  const IconComponent = LESSON_TYPE_ICONS[type] || Icons.Calendar;
  return <IconComponent style={{ fontSize: '14px' }} />;
};

const getLessonTypeLabel = (type) => {
  return LESSON_TYPE_LABELS[type] || type;
};

const getStatusBadge = (status) => {
  const badgeConfig = STATUS_BADGES[status] || STATUS_BADGES.scheduled;
  const IconComponent = badgeConfig.icon;
  
  return (
    <span className={`status-badge ${badgeConfig.class}`} style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: '2px 6px',
      borderRadius: '10px',
      fontSize: '10px',
      fontWeight: '500',
      marginTop: '4px'
    }}>
      <IconComponent style={{ fontSize: '10px' }} />
      {badgeConfig.label}
    </span>
  );
};

const getLessonColor = (lessonType, status) => {
  if (lessonType === 'blocked') return '#6c757d';
  if (status === 'cancelled') return '#dc3545';
  if (status === 'completed') return '#28a745';
  if (status === 'confirmed') return '#007bff';
  
  const colors = {
    private: '#007bff',
    group: '#28a745',
    training: '#ffc107',
    competition: '#dc3545',
    event: '#6f42c1',
  };
  
  return colors[lessonType] || '#6c757d';
};

const LessonCardContent = ({ lesson, isCompact = false }) => {
  const backgroundColor = getLessonColor(lesson.lesson_type, lesson.status);
  
  if (isCompact) {
    return (
      <div style={{
        padding: '6px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
            {getLessonTypeIcon(lesson.lesson_type)}
            <span style={{ fontSize: '11px', fontWeight: '500', color: 'white' }}>
              {lesson.name || 'Cours'}
            </span>
          </div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.8)' }}>
            {lesson.start_time}
          </div>
          {lesson.participant_count > 0 && (
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.8)' }}>
              <Icons.Users style={{ fontSize: '10px', marginRight: '2px' }} />
              {lesson.participant_count}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      padding: '8px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
          {getLessonTypeIcon(lesson.lesson_type)}
          <span style={{ fontSize: '12px', fontWeight: '600', color: 'white' }}>
            {lesson.name || 'Cours'}
          </span>
        </div>
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.9)' }}>
          {getLessonTypeLabel(lesson.lesson_type)}
        </div>
      </div>

      {/* Time and Duration */}
      <div style={{ marginBottom: '6px' }}>
        <div style={{ fontSize: '13px', fontWeight: '500', color: 'white' }}>
          {lesson.start_time} - {lesson.end_time}
        </div>
        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.8)' }}>
          {lesson.duration_minutes} minutes
        </div>
      </div>

      {/* Participants */}
      {lesson.lesson_type !== 'blocked' && (
        <div style={{ marginBottom: '4px' }}>
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.9)' }}>
            <Icons.Users style={{ fontSize: '11px', marginRight: '4px' }} />
            {lesson.participant_count || 0}
            {lesson.max_participants && ` / ${lesson.max_participants}`}
          </span>
        </div>
      )}

      {/* Location */}
      {lesson.location && (
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', marginBottom: '4px' }}>
          <Icons.Location style={{ fontSize: '10px', marginRight: '4px' }} />
          {lesson.location}
        </div>
      )}

      {/* Status Badge */}
      {getStatusBadge(lesson.status)}
    </div>
  );
};

export default LessonCardContent;