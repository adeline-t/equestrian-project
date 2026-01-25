import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useMonthlyStats } from '../../hooks/useMonthlyStats';
import { Icons } from '../../lib/icons';
import { getEventTypeConfig } from '../../lib/domain/events';
import '../../styles/features/stats.css';

function MonthlyStatsView() {
  const {
    currentMonth,
    loading,
    error,
    horseStats,
    riderStats,
    weeks,
    goToPreviousMonth,
    goToNextMonth,
    goToCurrentMonth,
  } = useMonthlyStats();

  const monthLabel = format(currentMonth, 'MMMM yyyy', { locale: fr });
  const isCurrentMonth = format(currentMonth, 'yyyy-MM') === format(new Date(), 'yyyy-MM');

  return (
    <div className="card-enhanced stats-view">
      {/* HEADER */}
      <div className="flex-between mb-20 stats-header">
        <div className="stats-header-left">
          <h2>Statistiques mensuelles</h2>
          <p className="stats-subtitle">Suivi des activités par semaine</p>
        </div>

        <div className="calendar-nav-buttons">
          <button className="btn btn-secondary btn-sm" onClick={goToPreviousMonth}>
            <Icons.ChevronLeft />
            précédent
          </button>

          {!isCurrentMonth && (
            <button className="btn btn-primary" onClick={goToCurrentMonth}>
              <Icons.Calendar />
              en cours
            </button>
          )}

          <button className="btn btn-secondary btn-sm" onClick={goToNextMonth}>
            suivant
            <Icons.ChevronRight />
          </button>
        </div>
      </div>

      {/* MONTH TITLE */}
      <div className="stats-month-header">
        <h3>{monthLabel}</h3>
        <div className="stats-month-badge">
          {weeks.length} semaine{weeks.length > 1 ? 's' : ''}
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="alert alert-error">
          <Icons.Warning />
          {error}
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="stats-loading">
          <Icons.Loading className="spin" />
          <p>Chargement des statistiques...</p>
        </div>
      )}

      {/* CONTENT */}
      {!loading && !error && (
        <div className="stats-content">
          {/* HORSES STATS */}
          <div className="stats-section">
            <div className="stats-section-header">
              <div className="stats-section-title">
                <Icons.Horse />
                <h3>Chevaux Club & Laury</h3>
              </div>
              <div className="stats-section-count">
                {horseStats.length} cheva{horseStats.length > 1 ? 'ux' : 'l'}
              </div>
            </div>

            {horseStats.length === 0 ? (
              <div className="empty-state">
                <Icons.Horse />
                <p>Aucun cheval trouvé pour ce mois</p>
              </div>
            ) : (
              <div className="stats-table-wrapper">
                <table className="stats-table">
                  <thead>
                    <tr>
                      <th className="stats-table-header-name">Cheval</th>
                      {weeks.map((week) => (
                        <th key={week.weekNumber} className="stats-table-header-week">
                          {week.label}
                        </th>
                      ))}
                      <th className="stats-table-header-total">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {horseStats.map((horse) => {
                      const totalEvents =
                        horse.weeks?.reduce((sum, week) => sum + (week.eventCount || 0), 0) || 0;

                      return (
                        <tr key={horse.horseId}>
                          <td className="stats-table-cell-name">
                            <div className="stats-horse-name">
                              <Icons.Horse />
                              <span>{horse.horseName}</span>
                            </div>
                          </td>
                          {weeks.map((week) => {
                            const weekData = horse.weeks?.find(
                              (w) => w.weekNumber === week.weekNumber
                            );
                            const count = weekData?.eventCount || 0;

                            return (
                              <td key={week.weekNumber} className="stats-table-cell-count">
                                <span className={`stats-count ${count > 0 ? 'has-events' : ''}`}>
                                  {count}
                                </span>
                              </td>
                            );
                          })}
                          <td className="stats-table-cell-total">
                            <span className="stats-total">{totalEvents}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* RIDERS STATS */}
          <div className="stats-section">
            <div className="stats-section-header">
              <div className="stats-section-title">
                <Icons.Users />
                <h3>Cavaliers</h3>
              </div>
              <div className="stats-section-count">
                {riderStats.length} cavalier{riderStats.length > 1 ? 's' : ''}
              </div>
            </div>

            {riderStats.length === 0 ? (
              <div className="empty-state">
                <Icons.Users />
                <p>Aucun cavalier trouvé pour ce mois</p>
              </div>
            ) : (
              <div className="stats-riders-grid">
                {riderStats.map((rider) => (
                  <RiderStatsCard key={rider.riderId} rider={rider} weeks={weeks} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Card component for rider statistics
 */
function RiderStatsCard({ rider, weeks }) {
  const totalEvents =
    rider.weeks?.reduce((sum, week) => {
      return sum + Object.values(week.eventsByType || {}).reduce((s, c) => s + c, 0);
    }, 0) || 0;

  // Get all unique event types across all weeks
  const allEventTypes = new Set();
  rider.weeks?.forEach((week) => {
    Object.keys(week.eventsByType || {}).forEach((type) => allEventTypes.add(type));
  });

  return (
    <div className="rider-stats-card">
      <div className="rider-stats-card-header">
        <div className="rider-stats-card-title">
          <Icons.User />
          <h4>{rider.riderName}</h4>
        </div>
        <div className="rider-stats-card-total">
          <span className="rider-stats-total-label">Total</span>
          <span className="rider-stats-total-count">{totalEvents}</span>
        </div>
      </div>

      <div className="rider-stats-card-body">
        <table className="rider-stats-table">
          <thead>
            <tr>
              <th>Type</th>
              {weeks.map((week) => (
                <th key={week.weekNumber}>S{week.weekNumber}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from(allEventTypes).map((eventType) => {
              const config = getEventTypeConfig(eventType);
              const typeTotal =
                rider.weeks?.reduce((sum, week) => {
                  return sum + (week.eventsByType?.[eventType] || 0);
                }, 0) || 0;

              return (
                <tr key={eventType}>
                  <td className="rider-stats-type">
                    <span
                      className="event-type-badge"
                      style={{
                        background: config?.color || 'var(--color-gray-200)',
                        color: config?.textColor || 'var(--color-gray-900)',
                      }}
                    >
                      {config?.label || eventType}
                    </span>
                  </td>
                  {weeks.map((week) => {
                    const weekData = rider.weeks?.find((w) => w.weekNumber === week.weekNumber);
                    const count = weekData?.eventsByType?.[eventType] || 0;

                    return (
                      <td key={week.weekNumber} className="rider-stats-count">
                        <span className={count > 0 ? 'has-count' : ''}>{count || '-'}</span>
                      </td>
                    );
                  })}
                </tr>
              );
            })}

            {allEventTypes.size > 1 && (
              <tr className="rider-stats-total-row">
                <td>
                  <strong>Total</strong>
                </td>
                {weeks.map((week) => {
                  const weekData = rider.weeks?.find((w) => w.weekNumber === week.weekNumber);
                  const weekTotal = Object.values(weekData?.eventsByType || {}).reduce(
                    (sum, count) => sum + count,
                    0
                  );

                  return (
                    <td key={week.weekNumber} className="rider-stats-count">
                      <strong>{weekTotal || '-'}</strong>
                    </td>
                  );
                })}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MonthlyStatsView;
