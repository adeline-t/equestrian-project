import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Icons } from '../../lib/icons';
import { format, startOfMonth, endOfMonth, eachWeekOfInterval, endOfWeek } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useMonthlyStats } from '../../hooks/useMonthlyStats';
import { exportToCSV, exportToPDF } from '../../lib/helpers/exports';
import { EVENT_TYPES, getEventTypeConfig } from '../../lib/domain';
import '../../styles/features/import-export/export-planning.css';

export default function ExportPlanningModal({ isOpen, onClose }) {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [exportFormat, setExportFormat] = useState('csv'); // 'csv' or 'pdf'
  const [exporting, setExporting] = useState(false);

  const { slotStats, loading } = useMonthlyStats(selectedMonth);

  // Calculer les semaines du mois
  const weeks = useMemo(() => {
    const monthStart = startOfMonth(selectedMonth);
    const monthEnd = endOfMonth(selectedMonth);

    const weeksInMonth = eachWeekOfInterval(
      { start: monthStart, end: monthEnd },
      { locale: fr, weekStartsOn: 1 }
    );

    return weeksInMonth.map((weekStart, index) => {
      const weekEnd = endOfWeek(weekStart, { locale: fr, weekStartsOn: 1 });
      return {
        index: index + 1,
        startDate: format(weekStart, 'yyyy-MM-dd'),
        endDate: format(weekEnd, 'yyyy-MM-dd'),
        label: `Semaine ${index + 1}`,
        displayLabel: `${format(weekStart, 'd MMM', { locale: fr })} - ${format(weekEnd, 'd MMM', {
          locale: fr,
        })}`,
      };
    });
  }, [selectedMonth]);

  // Calculer le nombre total d'événements
  const totalEvents = useMemo(() => {
    if (!slotStats?.weeks) return 0;
    return slotStats.weeks.reduce((sum, week) => sum + week.slots.length, 0);
  }, [slotStats]);

  /**
   * Prépare les données dans le format attendu par exportToCSV et exportToPDF
   * Transforme slotStats en format compatible avec EventTypeSlotsStatsSection
   */
  const prepareExportData = useMemo(() => {
    if (!slotStats?.weeks) return [];

    // Grouper par type d'événement
    const eventTypeGroups = {};

    slotStats.weeks.forEach((weekData) => {
      weekData.slots.forEach((slot) => {
        const eventType = slot.event?.type || 'unknown';

        if (!eventTypeGroups[eventType]) {
          eventTypeGroups[eventType] = {
            eventType,
            eventTypeConfig: getEventTypeConfig(eventType),
            weeks: [],
            totalSlots: 0,
            totalParticipants: 0,
          };
        }

        // Trouver ou créer la semaine correspondante
        let weekGroup = eventTypeGroups[eventType].weeks.find(
          (w) => w.weekStart === weekData.startDate
        );

        if (!weekGroup) {
          const weekMeta = weeks.find((w) => w.startDate === weekData.startDate);
          weekGroup = {
            weekStart: weekData.startDate,
            weekEnd: weekData.endDate,
            weekLabel: weekMeta?.label || 'Semaine',
            slots: [],
            totalSlots: 0,
            totalParticipants: 0,
          };
          eventTypeGroups[eventType].weeks.push(weekGroup);
        }

        // Ajouter le slot
        weekGroup.slots.push(slot);
        weekGroup.totalSlots++;
        weekGroup.totalParticipants += slot.participants?.length || 0;
      });
    });

    // Calculer les totaux par type d'événement
    Object.values(eventTypeGroups).forEach((group) => {
      group.totalSlots = group.weeks.reduce((sum, w) => sum + w.totalSlots, 0);
      group.totalParticipants = group.weeks.reduce((sum, w) => sum + w.totalParticipants, 0);
    });

    // Trier par type d'événement selon l'ordre dans EVENT_TYPES
    const eventTypeOrder = Object.values(EVENT_TYPES);
    return Object.values(eventTypeGroups)
      .filter((group) => group.totalSlots > 0)
      .sort((a, b) => {
        const indexA = eventTypeOrder.indexOf(a.eventType);
        const indexB = eventTypeOrder.indexOf(b.eventType);
        return indexA - indexB;
      });
  }, [slotStats, weeks]);

  const handlePrevMonth = () => {
    setSelectedMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setSelectedMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const handleExport = async () => {
    if (!slotStats || prepareExportData.length === 0) return;

    setExporting(true);
    try {
      const monthStr = format(selectedMonth, 'yyyy-MM');

      if (exportFormat === 'csv') {
        const filename = `planning-${monthStr}.csv`;
        exportToCSV(prepareExportData, filename);
      } else {
        exportToPDF(prepareExportData, selectedMonth);
      }

      // Optionnel : fermer la modale après export réussi
      // onClose();
    } catch (error) {
      console.error("Erreur lors de l'export:", error);
      alert("Erreur lors de l'export : " + error.message);
    } finally {
      setExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <Icons.Export /> Exporter le planning
          </h2>
          <button className="close-button" onClick={onClose} aria-label="Fermer">
            ×
          </button>
        </div>

        <div className="modal-body">
          {/* Sélection du mois */}
          <div className="export-month-selector">
            <button className="btn btn-icon" onClick={handlePrevMonth} aria-label="Mois précédent">
              <Icons.ChevronLeft />
            </button>

            <h3 className="export-month-title">
              {format(selectedMonth, 'MMMM yyyy', { locale: fr })}
            </h3>

            <button className="btn btn-icon" onClick={handleNextMonth} aria-label="Mois suivant">
              <Icons.ChevronRight />
            </button>
          </div>

          {/* Format d'export */}
          <div className="export-format-selector">
            <label className="export-format-label">Format d'export :</label>
            <div className="export-format-buttons">
              <button
                className={`btn ${exportFormat === 'csv' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setExportFormat('csv')}
              >
                <Icons.Edit /> CSV
              </button>
              <button
                className={`btn ${exportFormat === 'pdf' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setExportFormat('pdf')}
              >
                <Icons.Edit /> PDF
              </button>
            </div>
          </div>

          {/* Aperçu des semaines */}
          {loading ? (
            <div className="export-loading">
              <Icons.Loading className="spin" />
              <p>Chargement des données...</p>
            </div>
          ) : (
            <div className="export-preview">
              <h4 className="export-preview-title">Aperçu du mois ({totalEvents} événements)</h4>

              <div className="export-weeks-list">
                {weeks.map((week) => {
                  const weekStats = slotStats?.weeks?.find((w) => w.startDate === week.startDate);
                  const slotsCount = weekStats?.slots?.length || 0;
                  const participantsCount =
                    weekStats?.slots?.reduce(
                      (sum, slot) => sum + (slot.participants?.length || 0),
                      0
                    ) || 0;

                  return (
                    <div key={week.startDate} className="export-week-item">
                      <div className="export-week-info">
                        <span className="export-week-label">{week.label}</span>
                        <span className="export-week-dates">{week.displayLabel}</span>
                      </div>
                      <div className="export-week-stats">
                        {slotsCount > 0 ? (
                          <>
                            <span className="export-week-count">
                              <Icons.Calendar className="icon-sm" />
                              {slotsCount} événement{slotsCount > 1 ? 's' : ''}
                            </span>
                            <span className="export-week-separator">•</span>
                            <span className="export-week-count">
                              <Icons.Users className="icon-sm" />
                              {participantsCount} participant{participantsCount > 1 ? 's' : ''}
                            </span>
                          </>
                        ) : (
                          <span className="export-week-empty">Aucun événement</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {totalEvents === 0 && (
                <div className="export-empty-state">
                  <Icons.Calendar style={{ fontSize: 48, opacity: 0.3 }} />
                  <p>Aucun événement pour ce mois</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Annuler
          </button>
          <button
            className="btn btn-primary"
            onClick={handleExport}
            disabled={exporting || loading || totalEvents === 0}
          >
            {exporting ? (
              <>
                <Icons.Loading className="spin" /> Export en cours...
              </>
            ) : (
              <>
                <Icons.ArrowDown /> Exporter ({exportFormat.toUpperCase()})
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

ExportPlanningModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
