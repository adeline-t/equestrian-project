import { Icons } from '../../lib/icons';
import { useState, useMemo } from 'react';
import FilterPills from '../common/FilterPills';
import { EVENT_TYPES, getEventTypeConfig } from '../../lib/domain';
import {
  formatDate,
  formatTime,
  formatDuration,
  calculateDurationMinutes,
} from '../../lib/helpers';
import DomainBadge from '../common/DomainBadge';
import '../../styles/features/stats/event-type-slots-cards.css';
import { exportToCSV, exportToPDF } from '../../lib/helpers/exports';
import { format } from 'date-fns';

function EventTypeSlotsStatsSection({ stats, weeks, currentMonth }) {
  const [selectedEventType, setSelectedEventType] = useState('all');
  const [showEmptyEvents, setShowEmptyEvents] = useState(false);

  // Calculer les stats par type d'événement
  const eventStats = useMemo(() => {
    if (!stats?.weeks) return [];

    return Object.values(EVENT_TYPES)
      .map((eventType) => {
        const eventTypeConfig = getEventTypeConfig(eventType);

        const weekStats = weeks.map((week) => {
          const weekData = stats.weeks.find((w) => w.startDate === week.startDate);
          if (!weekData) {
            return {
              weekStart: week.startDate,
              weekEnd: week.endDate,
              weekLabel: week.label,
              slots: [],
              totalSlots: 0,
              totalParticipants: 0,
            };
          }

          let slotsForType = weekData.slots.filter((slot) => slot.event?.type === eventType);

          if (!showEmptyEvents) {
            slotsForType = slotsForType.filter((slot) => {
              const participants = slot.participants || [];
              return participants.length > 0;
            });
          }

          const totalParticipants = slotsForType.reduce(
            (sum, slot) => sum + (slot.participants?.length || 0),
            0
          );

          return {
            weekStart: week.startDate,
            weekEnd: week.endDate,
            weekLabel: week.label,
            slots: slotsForType,
            totalSlots: slotsForType.length,
            totalParticipants,
          };
        });

        const totalSlots = weekStats.reduce((sum, w) => sum + w.totalSlots, 0);
        const totalParticipants = weekStats.reduce((sum, w) => sum + w.totalParticipants, 0);

        return {
          eventType,
          eventTypeConfig,
          weeks: weekStats,
          totalSlots,
          totalParticipants,
        };
      })
      .filter((stat) => stat.totalSlots > 0);
  }, [stats, weeks, showEmptyEvents]);

  // Configuration des filtres
  const filterConfig = useMemo(() => {
    const filters = [
      {
        value: 'all',
        label: 'Tous les événements',
        count: eventStats.reduce((sum, stat) => sum + stat.totalSlots, 0),
      },
    ];

    eventStats.forEach((stat) => {
      filters.push({
        value: stat.eventType,
        label: stat.eventTypeConfig?.label || stat.eventType,
        count: stat.totalSlots,
      });
    });

    return filters;
  }, [eventStats]);

  // Filtrer les stats
  const filteredStats = useMemo(() => {
    if (selectedEventType === 'all') {
      return eventStats;
    }
    return eventStats.filter((stat) => stat.eventType === selectedEventType);
  }, [eventStats, selectedEventType]);

  // Handlers d'export
  const handleExportCSV = () => {
    const monthStr = format(currentMonth, 'yyyy-MM');
    const filename = `statistiques-evenements-${monthStr}.csv`;
    exportToCSV(filteredStats, filename);
  };

  const handleExportPDF = () => {
    exportToPDF(filteredStats, currentMonth);
  };

  return (
    <div className="event-type-slots-section">
      <div className="section-filters">
        <FilterPills
          filters={filterConfig}
          selectedValue={selectedEventType}
          onSelect={setSelectedEventType}
        />

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={showEmptyEvents}
            onChange={(e) => setShowEmptyEvents(e.target.checked)}
          />
          Afficher les événements sans participants
        </label>

        <div className="export-buttons">
          <button className="btn btn-secondary btn-sm" onClick={handleExportCSV}>
            Export CSV
          </button>
          <button className="btn btn-secondary btn-sm" onClick={handleExportPDF}>
            Export PDF
          </button>
        </div>
      </div>

      {filteredStats.length === 0 ? (
        <div className="empty-state-small">
          <Icons.Calendar />
          <p>
            {selectedEventType !== 'all'
              ? 'Aucun événement ne correspond au filtre sélectionné'
              : 'Aucune activité pour ce mois'}
          </p>
        </div>
      ) : (
        <div className="event-type-cards-grid">
          {filteredStats.map((stat) => (
            <EventTypeCard key={stat.eventType} eventStat={stat} />
          ))}
        </div>
      )}
    </div>
  );
}

function EventTypeCard({ eventStat }) {
  const eventTypeConfig = getEventTypeConfig(eventStat.eventType);
  const { totalSlots, totalParticipants } = eventStat;
  const isLesson =
    eventStat.eventType === EVENT_TYPES.GROUPED_LESSON ||
    eventStat.eventType === EVENT_TYPES.PRIVATE_LESSON;
  const needsParticipantsDetail =
    eventStat.eventType === EVENT_TYPES.COMPETITION ||
    eventStat.eventType === EVENT_TYPES.PRIVATE_LESSON ||
    eventStat.eventType === EVENT_TYPES.SERVICE ||
    eventStat.eventType === EVENT_TYPES.SPECIAL;

  return (
    <div className="event-type-card">
      {/* En-tête de la card */}
      <div className="event-type-card-header">
        <div className="event-type-info">
          <DomainBadge config={eventTypeConfig} />
        </div>
        <div className="event-type-stats">
          <div className="stat-item">
            <span className="stat-value">{totalSlots}</span>
            <span className="stat-label">{isLesson ? 'cours' : 'événements'}</span>
          </div>
          <div className="stat-divider">•</div>
          <div className="stat-item">
            <span className="stat-value">{totalParticipants}</span>
            <span className="stat-label">participants</span>
          </div>
        </div>
      </div>

      {/* Liste des semaines */}
      <div className="event-type-card-body">
        {eventStat.weeks.map((week, index) => (
          <WeekRow
            key={`${week.weekStart}-${index}`}
            weekData={week}
            isLesson={isLesson}
            needsParticipantsDetail={needsParticipantsDetail}
          />
        ))}
      </div>
    </div>
  );
}

function WeekRow({ weekData, isLesson, needsParticipantsDetail }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasSlots = weekData.totalSlots > 0;

  return (
    <div className={`week-row ${isExpanded ? 'expanded' : ''}`}>
      {/* Ligne principale */}
      <div
        className={`week-row-header ${hasSlots ? 'clickable' : ''}`}
        onClick={() => hasSlots && setIsExpanded(!isExpanded)}
      >
        <div className="week-info">
          <span className="week-label">{weekData.weekLabel}</span>
        </div>

        <div className="week-stats">
          {hasSlots ? (
            <>
              <span className="week-count">
                {weekData.totalSlots} {isLesson ? 'cours' : 'événement'} •{' '}
                {weekData.totalParticipants} participants
              </span>
              <Icons.ChevronDown className={`expand-icon ${isExpanded ? 'rotated' : ''}`} />
            </>
          ) : (
            <span className="week-count-empty">Aucun {isLesson ? 'cours' : 'événement'}</span>
          )}
        </div>
      </div>

      {/* Détails dépliés */}
      {isExpanded && hasSlots && (
        <div className="week-row-details">
          {weekData.slots.map((slot) => (
            <div key={slot.slotId} className="slot-group">
              {/* Ligne principale du slot */}
              <div className="slot-item">
                <div className="slot-info">
                  <Icons.Calendar className="slot-icon" />
                  <span className="slot-name">
                    {slot.event?.name || 'Sans nom'} - {formatDate(slot.date)}{' '}
                    {slot.isAllDay
                      ? 'journée entière'
                      : `à ${formatTime(slot.startTime)} (${formatDuration(
                          calculateDurationMinutes(slot.startTime, slot.endTime)
                        )})`}
                  </span>
                </div>
                <div className="slot-participants">
                  <Icons.Users className="participants-icon" />
                  <span className="participants-count">{slot.participants?.length || 0}</span>
                </div>
              </div>

              {/* Détails des participants si nécessaire */}
              {needsParticipantsDetail && slot.participants?.length > 0 && (
                <div className="slot-participants-details">
                  {slot.participants.map((participant, index) => (
                    <div key={`${slot.slotId}-participant-${index}`} className="participant-item">
                      <span className="participant-rider">{participant.riderName ?? 'N/A'}</span>
                      <span className="participant-separator">-</span>
                      <span className="participant-horse">{participant.horseName ?? 'N/A'}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EventTypeSlotsStatsSection;
