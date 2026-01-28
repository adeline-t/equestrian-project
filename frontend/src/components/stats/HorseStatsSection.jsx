import { Icons } from '../../lib/icons';

function HorseStatsSection({ stats, weeks }) {
  return (
    <div className="data-card-body">
      {stats.length === 0 ? (
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
                  <th key={week.weekNumber} className="table-header-center table-cell-center">
                    {week.label}
                  </th>
                ))}
                <th className="table-header-center">Total</th>
              </tr>
            </thead>
            <tbody>
              {stats.map((horse) => {
                const totalEvents =
                  horse.weeks?.reduce((sum, week) => sum + (week.eventCount || 0), 0) || 0;

                return (
                  <tr key={horse.horseId}>
                    <td className="table-cell-name">
                      <div className="table-cell-content">
                        <span>{horse.horseName}</span>
                      </div>
                    </td>

                    {weeks.map((week) => {
                      const weekData = horse.weeks?.find((w) => w.weekNumber === week.weekNumber);
                      const count = weekData?.eventCount || 0;

                      return (
                        <td key={week.weekNumber} className="table-cell-center">
                          <span className={`count-pill ${count > 0 ? 'active' : 'empty'}`}>
                            {count}
                          </span>
                        </td>
                      );
                    })}

                    <td className="table-cell-center table-cell-accent">
                      <strong className="stats-count-total">{totalEvents}</strong>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default HorseStatsSection;
