import React, { useState, useEffect } from 'react';
import { format, startOfWeek, addWeeks, subWeeks, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { scheduleApi } from '../../services/calendarApi';
import WeekView from './WeekView';
import LessonModal from './LessonModal';
import TemplateModal from './TemplateModal';
import './calendar.css';

function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weekData, setWeekData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [filters, setFilters] = useState({
    lessonType: 'all',
    status: 'all',
    showBlocked: true,
  });

  // Charger les données de la semaine
  useEffect(() => {
    loadWeekData();
  }, [currentDate, filters]);

  const loadWeekData = async () => {
    try {
      setLoading(true);
      setError(null);

      const weekStart = startOfWeek(currentDate, { locale: fr, weekStartsOn: 1 });
      const dateStr = format(weekStart, 'yyyy-MM-dd');

      const response = await scheduleApi.getWeek(dateStr, !filters.showBlocked);
      setWeekData(response);
    } catch (err) {
      console.error('Error loading week data:', err);
      setError(err.response?.data?.error || err.message || 'Erreur lors du chargement du calendrier');
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousWeek = () => {
    setCurrentDate((prev) => subWeeks(prev, 1));
  };

  const handleNextWeek = () => {
    setCurrentDate((prev) => addWeeks(prev, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleLessonClick = (lesson) => {
    setSelectedLesson(lesson);
    setShowLessonModal(true);
  };

  const handleLessonUpdate = async () => {
    await loadWeekData();
    setShowLessonModal(false);
    setSelectedLesson(null);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handleCreateTemplate = () => {
    setShowTemplateModal(true);
  };

  const handleTemplateCreated = async () => {
    setShowTemplateModal(false);
    await loadWeekData();
  };

  if (loading) {
    return (
      <div className="calendar-loading">
        <div className="spinner"></div>
        <p>Chargement du calendrier...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="calendar-error">
        <div className="error-icon">⚠️</div>
        <h3>Erreur de chargement</h3>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={loadWeekData}>
          Réessayer
        </button>
      </div>
    );
  }

  if (!weekData) {
    return null;
  }

  return (
    <div className="calendar-view">
      {/* En-tête avec navigation */}
      <div className="calendar-header">
        <div className="calendar-header-top">
          <h2>📅 Calendrier des Cours</h2>
          <div className="calendar-actions">
            <button className="btn btn-secondary" onClick={handleCreateTemplate}>
              ➕ Nouveau Template
            </button>
          </div>
        </div>

        <div className="calendar-navigation">
          <button className="btn btn-secondary" onClick={handlePreviousWeek}>
            ← Semaine précédente
          </button>
          <button className="btn btn-primary" onClick={handleToday}>
            Aujourd'hui
          </button>
          <button className="btn btn-secondary" onClick={handleNextWeek}>
            Semaine suivante →
          </button>
        </div>

        <div className="calendar-title">
          <h3>
            Semaine du {format(new Date(weekData.period.start), 'dd MMMM yyyy', { locale: fr })}
          </h3>
          <div className="calendar-stats">
            <span className="stat">
              📚 {weekData.statistics.total_lessons} cours
            </span>
            <span className="stat">
              👥 {weekData.statistics.total_participants} participants
            </span>
            {weekData.statistics.blocked_periods > 0 && (
              <span className="stat blocked">
                🚫 {weekData.statistics.blocked_periods} plages bloquées
              </span>
            )}
          </div>
        </div>

        {/* Filtres */}
        <div className="calendar-filters">
          <div className="filter-group">
            <label>Type de cours :</label>
            <select
              value={filters.lessonType}
              onChange={(e) => handleFilterChange('lessonType', e.target.value)}
              className="form-select"
            >
              <option value="all">Tous les types</option>
              <option value="private">👤 Cours particuliers</option>
              <option value="group">👥 Cours collectifs</option>
              <option value="training">🎓 Stages</option>
              <option value="competition">🏆 Concours</option>
              <option value="event">🎉 Événements</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Statut :</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="form-select"
            >
              <option value="all">Tous les statuts</option>
              <option value="scheduled">Planifiés</option>
              <option value="confirmed">Confirmés</option>
              <option value="completed">Terminés</option>
              <option value="cancelled">Annulés</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={filters.showBlocked}
                onChange={(e) => handleFilterChange('showBlocked', e.target.checked)}
              />
              Afficher les plages bloquées
            </label>
          </div>
        </div>
      </div>

      {/* Vue hebdomadaire */}
      <WeekView weekData={weekData} onLessonClick={handleLessonClick} filters={filters} />

      {/* Modal de détails/édition de cours */}
      {showLessonModal && selectedLesson && (
        <LessonModal
          lesson={selectedLesson}
          onClose={() => {
            setShowLessonModal(false);
            setSelectedLesson(null);
          }}
          onUpdate={handleLessonUpdate}
          onRefresh={loadWeekData}
        />
      )}

      {/* Modal de création de template */}
      {showTemplateModal && (
        <TemplateModal
          onClose={() => setShowTemplateModal(false)}
          onSuccess={handleTemplateCreated}
        />
      )}
    </div>
  );
}

export default CalendarView;