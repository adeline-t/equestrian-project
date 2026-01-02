import React, { useState, useEffect } from 'react';
import { format, startOfWeek, addWeeks, subWeeks } from 'date-fns';
import { fr } from 'date-fns/locale';
import { scheduleApi } from '../../services/calendarApi';
import WeekView from './WeekView';
import LessonModal from '../lessons/LessonModal';
import TemplateModal from '../templates/TemplateModal';
import SingleLessonModal from '../lessons/SingleLessonModal';
import BlockedTimeModal from '../lessons/BlockedTimeModal';
import { Icons } from '../../utils/icons';
import './calendar.css';

function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weekData, setWeekData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showSingleLessonModal, setShowSingleLessonModal] = useState(false);
  const [showBlockedTimeModal, setShowBlockedTimeModal] = useState(false);
  const [filters, setFilters] = useState({
    lessonType: 'all',
    status: 'all',
    showBlocked: true,
  });

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
      setError(
        err.response?.data?.error || err.message || 'Erreur lors du chargement du calendrier'
      );
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

  const handleCreateSingleLesson = () => {
    setShowSingleLessonModal(true);
  };

  const handleSingleLessonCreated = async () => {
    setShowSingleLessonModal(false);
    await loadWeekData();
  };

  const handleCreateBlockedTime = () => {
    setShowBlockedTimeModal(true);
  };

  const handleBlockedTimeCreated = async () => {
    setShowBlockedTimeModal(false);
    await loadWeekData();
  };

  if (loading) {
    return (
      <div className="calendar-loading">
        <Icons.Loading className="spin" style={{ fontSize: '50px', color: '#007bff' }} />
        <p>Chargement du calendrier...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="calendar-error">
        <div className="error-icon">
          <Icons.Warning style={{ fontSize: '48px', color: '#dc3545' }} />
        </div>
        <h3>Erreur de chargement</h3>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={loadWeekData}>
          <Icons.Repeat style={{ marginRight: '8px' }} />
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
          <h2>
            <Icons.Calendar style={{ marginRight: '8px' }} />
            Calendrier des Cours
          </h2>
          <div className="calendar-actions">
            <button className="btn btn-outline-danger" onClick={() => setShowBlockedTimeModal(true)}>
              <Icons.Blocked style={{ marginRight: '8px' }} />
              Bloquer un créneau
            </button>
            <button className="btn btn-primary" onClick={handleCreateSingleLesson}>
              <Icons.Add style={{ marginRight: '8px' }} />
              Ajouter un cours
            </button>
          </div>
        </div>

        <div className="calendar-navigation">
          <button className="btn btn-secondary" onClick={handlePreviousWeek}>
            <Icons.ChevronLeft style={{ marginRight: '8px' }} />
            Semaine précédente
          </button>
          <button className="btn btn-primary" onClick={handleToday}>
            <Icons.Calendar style={{ marginRight: '8px' }} />
            Aujourd'hui
          </button>
          <button className="btn btn-secondary" onClick={handleNextWeek}>
            Semaine suivante
            <Icons.ChevronRight style={{ marginLeft: '8px' }} />
          </button>
        </div>

        <div className="calendar-title">
          <h3>
            Semaine du {format(new Date(weekData.period.start), 'dd MMMM yyyy', { locale: fr })}
          </h3>
          <div className="calendar-stats">
            <span className="stat">
              <Icons.List style={{ marginRight: '4px' }} />
              {weekData.statistics.total_lessons} cours
            </span>
            <span className="stat">
              <Icons.Users style={{ marginRight: '4px' }} />
              {weekData.statistics.total_participants} participants
            </span>
            {weekData.statistics.blocked_periods > 0 && (
              <span className="stat blocked">
                <Icons.Blocked style={{ marginRight: '4px' }} />
                {weekData.statistics.blocked_periods} plages bloquées
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
              <option value="private">
                <Icons.PrivateLesson /> Cours particuliers
              </option>
              <option value="group">
                <Icons.GroupLesson /> Cours collectifs
              </option>
              <option value="training">
                <Icons.Training /> Stages
              </option>
              <option value="competition">
                <Icons.Competition /> Concours
              </option>
              <option value="event">
                <Icons.Event /> Événements
              </option>
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
            <label>
              <input
                type="checkbox"
                checked={filters.showBlocked}
                onChange={(e) => handleFilterChange('showBlocked', e.target.checked)}
                style={{ marginRight: '8px' }}
              />
              Afficher les plages bloquées
            </label>
          </div>
        </div>
      </div>

      {/* Vue hebdomadaire */}
      <WeekView weekData={weekData} onLessonClick={handleLessonClick} onQuickCreate={loadWeekData} filters={filters} />

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

      {/* Modal de création de cours standalone */}
      {showSingleLessonModal && (
        <SingleLessonModal
          onClose={() => setShowSingleLessonModal(false)}
          onSuccess={handleSingleLessonCreated}
          initialDate={format(currentDate, 'yyyy-MM-dd')}
        />
      )}

      {/* Modal de création de plage bloquée */}
      {showBlockedTimeModal && (
        <BlockedTimeModal
          onClose={() => setShowBlockedTimeModal(false)}
          onSuccess={handleBlockedTimeCreated}
          initialDate={format(currentDate, 'yyyy-MM-dd')}
        />
      )}
    </div>
  );
}

export default CalendarView;
