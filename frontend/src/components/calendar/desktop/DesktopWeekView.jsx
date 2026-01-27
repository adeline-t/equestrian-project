import PropTypes from 'prop-types';
import DesktopTimeColumn from './DesktopTimeColumn';
import DesktopDayColumn from './DesktopDayColumn';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * DesktopWeekView - Vue semaine complète pour desktop
 */
export default function DesktopWeekView({ weekData, onSlotClick, onQuickCreate }) {
  if (!weekData?.days) {
    return <div className="desktop-week-view desktop-week-view--loading">Chargement...</div>;
  }

  return (
    <div className="desktop-week-view">
      <div className="desktop-week-view__grid">
        {/* Colonne des heures */}
        <DesktopTimeColumn />

        {/* 7 colonnes jours */}
        {weekData.days.map((day) => {
          const dayName = day.day_name || format(parseISO(day.date), 'EEEE', { locale: fr });
          return (
            <DesktopDayColumn
              key={day.date}
              date={day.date}
              dayName={dayName}
              slots={day.slots || []}
              onSlotClick={onSlotClick}
              onQuickCreate={onQuickCreate}
            />
          );
        })}
      </div>
    </div>
  );
}

DesktopWeekView.propTypes = {
  weekData: PropTypes.shape({
    days: PropTypes.arrayOf(
      PropTypes.shape({
        date: PropTypes.string.isRequired,
        day_name: PropTypes.string,
        slots: PropTypes.array,
      })
    ),
  }),
  onSlotClick: PropTypes.func,
  onQuickCreate: PropTypes.func,
};
