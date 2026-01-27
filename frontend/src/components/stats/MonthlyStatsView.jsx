import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useMonthlyStats } from '../../hooks/useMonthlyStats';
import { Icons } from '../../lib/icons';
import { getEventTypeConfig } from '../../lib/domain/events';
import DomainBadge from '../common/DomainBadge';

import '../../styles/features/stats/stats.css';

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
    <div className="stats-view monthly-stats">
      <div className="card">
        {/* HEADER */}
        <div className="modal-header">
          <div className="modal-header-text">
            <h2>Statistiques mensuelles</h2>
            <div className="detail-card-meta">Suivi des activités par semaine</div>
          </div>

          <div className="header-actions-group">
            <button className="btn btn-secondary" onClick={goToPreviousMonth}>
              <Icons.ChevronLeft />
              Précédent
            </button>

            {!isCurrentMonth && (
              <button className="btn btn-primary" onClick={goToCurrentMonth}>
                <Icons.Calendar />
                Mois en cours
              </button>
            )}

            <button className="btn btn-secondary" onClick={goToNextMonth}>
              Suivant
              <Icons.ChevronRight />
            </button>
          </div>
        </div>

        {/* MONTH BADGE */}
        <div className="stats-header">
          <Icons.Calendar />

          <h3>{monthLabel}</h3>
          <span className="text">
            {' '}
            • {weeks.length} semaine{weeks.length > 1 ? 's' : ''}
          </span>
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
          <div className="loading-state">
            <Icons.Loading className="spin" />
            <p>Chargement des statistiques...</p>
          </div>
        )}

        {/* CONTENT */}
        {!loading && !error && (
          <div className="stats-card">
            {/* HORSES STATS */}
            <div className="data-card">
              <div className="data-card-header">
                <div className="data-card-title">
                  <Icons.Horse />
                  <h3>Chevaux Club & Laury</h3>
                  <span className="count-badge">{horseStats.length}</span>
                </div>
              </div>

              <div className="data-card-body">
                {horseStats.length === 0 ? (
                  <div className="empty-state-small">
                    <Icons.Horse />
                    <p>Aucun cheval pour ce mois</p>
                  </div>
                ) : (
                  <div className="table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th className="table-header-sticky">Cheval</th>
                          {weeks.map((week) => (
                            <th
                              key={week.weekNumber}
                              className="table-header-center table-cell-center"
                            >
                              {week.label}
                            </th>
                          ))}
                          <th className="table-header-center">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {horseStats.map((horse) => {
                          const totalEvents =
                            horse.weeks?.reduce((sum, week) => sum + (week.eventCount || 0), 0) ||
                            0;

                          return (
                            <tr key={horse.horseId}>
                              <td className="table-cell-name">
                                <div className="table-cell-content">
                                  <span>{horse.horseName}</span>
                                </div>
                              </td>

                              {weeks.map((week) => {
                                const weekData = horse.weeks?.find(
                                  (w) => w.weekNumber === week.weekNumber
                                );
                                const count = weekData?.eventCount || 0;

                                return (
                                  <td key={week.weekNumber} className="table-cell-center">
                                    <span
                                      className={`count-pill ${count > 0 ? 'active' : 'empty'}`}
                                    >
                                      {count}
                                    </span>
                                  </td>
                                );
                              })}

                              <td className="table-cell-center table-cell-accent">
                                <strong className="count-total">{totalEvents}</strong>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* RIDERS STATS */}
            <div className="data-card">
              <div className="data-card-header">
                <div className="data-card-title">
                  <Icons.Users />
                  <h3>Cavaliers</h3>
                  <span className="count-badge">{riderStats.length}</span>
                </div>
              </div>

              <div className="data-card-body">
                {riderStats.length === 0 ? (
                  <div className="empty-state-small">
                    <Icons.Users />
                    <p>Aucun cavalier pour ce mois</p>
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
          </div>
        )}
      </div>
    </div>
  );
}

/* ======================================================
   Rider Stats Card (scopée stats.css)
   ====================================================== */

function RiderStatsCard({ rider, weeks }) {
  const totalEvents =
    rider.weeks?.reduce((sum, week) => {
      return sum + Object.values(week.eventsByType || {}).reduce((s, c) => s + c, 0);
    }, 0) || 0;

  const allEventTypes = new Set();
  rider.weeks?.forEach((week) => {
    Object.keys(week.eventsByType || {}).forEach((type) => allEventTypes.add(type));
  });

  return (
    <div className="info-card">
      <div className="info-card-header">
        <Icons.User />
        <h3>{rider.riderName}</h3>
        <span className="count-badge">{totalEvents}</span>
      </div>

      <div className="info-card-body">
        <table className="data-table compact">
          <thead>
            <tr>
              <th className="table-header-left">Type</th>
              {weeks.map((week) => (
                <th key={week.weekNumber} className="table-header-center">
                  S{week.weekNumber}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from(allEventTypes).map((eventType) => {
              const config = getEventTypeConfig(eventType);

              return (
                <tr key={eventType}>
                  <td className="table-cell-badge">
                    <DomainBadge config={config} size="sm" />
                  </td>

                  {weeks.map((week) => {
                    const weekData = rider.weeks?.find((w) => w.weekNumber === week.weekNumber);
                    const count = weekData?.eventsByType?.[eventType] || 0;

                    return (
                      <td key={week.weekNumber} className="table-cell-center">
                        <span className={`count-pill ${count > 0 ? 'active' : 'empty'}`}>
                          {count || '-'}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              );
            })}

            {allEventTypes.size > 1 && (
              <tr className="table-row-total">
                <td className="table-cell-left">
                  <strong>Total</strong>
                </td>

                {weeks.map((week) => {
                  const weekData = rider.weeks?.find((w) => w.weekNumber === week.weekNumber);
                  const weekTotal = Object.values(weekData?.eventsByType || {}).reduce(
                    (sum, count) => sum + count,
                    0
                  );

                  return (
                    <td key={week.weekNumber} className="table-cell-center">
                      <strong className="count-total">{weekTotal || '-'}</strong>
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
