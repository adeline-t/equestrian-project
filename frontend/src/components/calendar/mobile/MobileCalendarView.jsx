import PropTypes from 'prop-types';
import { format, parseISO } from 'date-fns';
import { useState, useEffect } from 'react';
import { Icons } from '../../../lib/icons';
import MobileDaySelector from './MobileDaySelector';
import MobileEventsList from './MobileEventsList';
import MobileActionBar from './MobileActionBar';

/**
 * MobileCalendarView - Vue calendrier mobile complète
 */
export default function MobileCalendarView({
  weekData,
  onSlotClick,
  onCreateEvent,
  onCreateBlockedTime,
  onShowScheduled,
  currentDate,
}) {
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
        <div className="mobile-calendar-view__loading">
          <Icons.Loading />
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  // Générer les 7 jours de la semaine
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

  return (
    <div className="mobile-calendar-view">
      {/* Header avec navigation semaine */}
      <div className="mobile-calendar-view__header">
        <MobileDaySelector
          weekDays={weekDays}
          selectedDate={selectedDate}
          getEventCount={getEventCount}
          onDayClick={handleDayClick}
        />
      </div>

      {/* Liste des événements du jour sélectionné */}
      <div className="mobile-calendar-view__content">
        <MobileEventsList
          selectedDate={selectedDate}
          allDaySlots={allDaySlots}
          timedSlots={timedSlots}
          onSlotClick={onSlotClick}
        />
      </div>

      {/* Barre d'actions fixe */}
      <MobileActionBar
        onCreateEvent={onCreateEvent}
        onCreateBlockedTime={onCreateBlockedTime}
        onShowScheduled={onShowScheduled}
      />
    </div>
  );
}

MobileCalendarView.propTypes = {
  weekData: PropTypes.shape({
    days: PropTypes.arrayOf(
      PropTypes.shape({
        date: PropTypes.string.isRequired,
        slots: PropTypes.array,
      })
    ),
  }),
  onSlotClick: PropTypes.func.isRequired,
  onCreateEvent: PropTypes.func.isRequired,
  onCreateBlockedTime: PropTypes.func.isRequired,
  onShowScheduled: PropTypes.func.isRequired,
  currentDate: PropTypes.instanceOf(Date),
};
