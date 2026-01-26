import { format, isToday, parseISO, startOfWeek, addDays, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useState, useEffect } from 'react';
import { getEventTypeConfig, getStatusConfig } from '../../lib/domain/events';
import { Icons } from '../../lib/icons';
import '../../styles/features/calendar/calendar-mobile.css';

export default function MobileCalendarView({ weekData, onSlotClick, onCreateEvent, currentDate }) {
  const [selectedDate, setSelectedDate] = useState(currentDate || new Date());

  // Mettre à jour selectedDate si currentDate change
  useEffect(() => {
    if (currentDate) {
      setSelectedDate(currentDate);
    }
  }, [currentDate]);

  if (!weekData?.days) {
    return (
      <div className="mobile-calendar-view">
        <div className="mobile-loading">
          <Icons.Loading />
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  // Générer les 7 jours de la semaine à partir du premier jour dans weekData
  const weekDays = weekData.days.map((day) => parseISO(day.date));

  // Trouver le jour sélectionné dans les données
  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
  const selectedDayData = weekData.days.find((day) => day.date === selectedDateStr);
  const slots = selectedDayData?.slots || [];

  // Séparer les slots all-day et horaires
  const allDaySlots = slots.filter((s) => s.is_all_day);
  const timedSlots = slots
    .filter((s) => !s.is_all_day)
    .sort((a, b) => {
      const timeA = a.start_time || '00:00';
      const timeB = b.start_time || '00:00';
      return timeA.localeCompare(timeB);
    });

  // Compter les événements par jour
  const getEventCount = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayData = weekData.days.find((day) => day.date === dateStr);
    return dayData?.slots?.length || 0;
  };

  const handleDayClick = (date) => {
    setSelectedDate(date);
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    return timeStr.substring(0, 5); // "HH:mm"
  };

  const formatEndTime = (slot) => {
    if (!slot.end_time) return '';
    const start = formatTime(slot.start_time);
    const end = formatTime(slot.end_time);
    return `${start} - ${end}`;
  };

  return (
    <div className="mobile-calendar-view">
      {/* Header avec navigation semaine */}
      <div className="mobile-calendar-header">
        <div className="mobile-week-selector">
          {weekDays.map((date) => {
            const eventCount = getEventCount(date);
            const isSelected = isSameDay(date, selectedDate);
            const isTodayDate = isToday(date);

            return (
              <button
                key={format(date, 'yyyy-MM-dd')}
                className={`mobile-day-button ${isSelected ? 'selected' : ''} ${
                  isTodayDate ? 'today' : ''
                }`}
                onClick={() => handleDayClick(date)}
              >
                <span className="mobile-day-name">{format(date, 'EEE', { locale: fr })}</span>
                <span className="mobile-day-number">{format(date, 'd')}</span>
                <span className="mobile-event-count">{eventCount > 0 ? `${eventCount}` : ''}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Liste des événements du jour sélectionné */}
      <div className="mobile-events-container">
        <div className="mobile-selected-date">
          <h2>
            {isToday(selectedDate) ? "Aujourd'hui" : format(selectedDate, 'EEEE', { locale: fr })}{' '}
            <span className="mobile-date-number">{format(selectedDate, 'd')}</span>
          </h2>
        </div>

        {/* All-day events */}
        {allDaySlots.length > 0 && (
          <div className="mobile-allday-section">
            {allDaySlots.map((slot) => {
              const eventConfig = getEventTypeConfig(slot.events?.event_type);
              const statusConfig = getStatusConfig(slot.slot_status);
              const EventIcon = eventConfig?.icon || Icons.Calendar;

              return (
                <div
                  key={slot.id}
                  className="mobile-allday-card"
                  data-type={slot.events?.event_type}
                  onClick={() => onSlotClick(slot)}
                >
                  <div className="mobile-allday-content">
                    <EventIcon className="mobile-allday-icon" />
                    <div className="mobile-allday-info">
                      <div className="mobile-allday-title">
                        {slot.events?.name || eventConfig?.label}
                      </div>
                      <div className="mobile-allday-subtitle">Journée entière</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Timed events */}
        {timedSlots.length > 0 ? (
          <div className="mobile-events-list">
            {timedSlots.map((slot) => {
              const eventConfig = getEventTypeConfig(slot.events?.event_type);
              const statusConfig = getStatusConfig(slot.slot_status);
              const EventIcon = eventConfig?.icon || Icons.Calendar;

              // Extraire les participants
              const participants = slot.event_participants || [];
              const ridersNames = participants
                .map((p) => p.riders?.name)
                .filter(Boolean)
                .join(', ');
              const horsesNames = participants
                .map((p) => p.horses?.name)
                .filter(Boolean)
                .join(', ');

              return (
                <div
                  key={slot.id}
                  className="mobile-event-card"
                  data-type={slot.events?.event_type}
                  onClick={() => onSlotClick(slot, false)}
                >
                  <div className="mobile-event-time">
                    <span className="mobile-time-value">{formatTime(slot.start_time)}</span>
                  </div>

                  <div className="mobile-event-divider"></div>

                  <div className="mobile-event-content">
                    <div className="mobile-event-header">
                      <EventIcon className="mobile-event-icon" />
                      <span className="mobile-event-title">
                        {slot.events?.name || eventConfig?.label}
                      </span>
                    </div>

                    {/* Détails de l'événement */}
                    <div className="mobile-event-details">
                      {ridersNames && <div className="mobile-detail-line">{ridersNames}</div>}
                      {horsesNames && <div className="mobile-detail-line">{horsesNames}</div>}
                      {slot.events?.location && (
                        <div className="mobile-detail-line">{slot.events.location}</div>
                      )}
                      {slot.events?.instructor && (
                        <div className="mobile-detail-line">{slot.events.instructor.name}</div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : allDaySlots.length === 0 ? (
          <div className="mobile-empty-state">
            <Icons.Calendar style={{ fontSize: 48, opacity: 0.3 }} />
            <p>Aucun événement ce jour</p>
          </div>
        ) : null}
      </div>

      {/* Floating action button */}
      <button className="mobile-fab" onClick={onCreateEvent} aria-label="Nouvel événement">
        <Icons.Add />
      </button>
    </div>
  );
}
