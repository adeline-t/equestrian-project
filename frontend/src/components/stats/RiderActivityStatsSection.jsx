import { useMemo, useState } from 'react';
import { RIDER_TYPES } from '../../lib/domain';
import { getRiderTypeConfig } from '../../lib/domain/domain-constants';
import { getEventTypeConfig } from '../../lib/domain/events';
import { Icons } from '../../lib/icons';
import DomainBadge from '../common/DomainBadge';
import FilterPills from '../common/FilterPills';
import SearchInput from '../common/SearchInput';
import { normalizeString } from '../../lib/helpers';
import '../../styles/features/stats/rider-activity-table.css';

function RiderActivityStatsSection({ stats, weeks }) {
  const [selectedType, setSelectedType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const typeCounts = useMemo(() => {
    if (!stats) return { all: 0, owner: 0, loaner: 0 };
    return stats.reduce(
      (acc, rider) => {
        acc.all++;
        if (rider.riderType === RIDER_TYPES.OWNER) acc.owner++;
        if (rider.riderType === RIDER_TYPES.LOANER) acc.loaner++;
        return acc;
      },
      { all: 0, owner: 0, loaner: 0 }
    );
  }, [stats]);

  const filterConfig = useMemo(
    () => [
      {
        value: 'all',
        label: 'Tous',
        count: typeCounts.all,
      },
      {
        value: RIDER_TYPES.OWNER,
        label: 'Propriétaires',
        count: typeCounts.owner,
      },
      {
        value: RIDER_TYPES.LOANER,
        label: 'Demi-pensionnaires',
        count: typeCounts.loaner,
      },
    ],
    [typeCounts]
  );

  const filteredStats = useMemo(() => {
    if (!stats) return [];

    let filtered = stats;

    if (selectedType !== 'all') {
      filtered = filtered.filter((rider) => rider.riderType === selectedType);
    }

    if (searchTerm.trim()) {
      const normalizedSearch = normalizeString(searchTerm);
      filtered = filtered.filter((rider) =>
        normalizeString(rider.riderName).includes(normalizedSearch)
      );
    }

    return filtered;
  }, [stats, selectedType, searchTerm]);

  return (
    <div className="data-card rider-activity-cards-section">
      <div className="data-card-header">
        <div className="data-card-title">
          <h3>Activité des cavaliers</h3>
          <span className="detail-card-meta">Événements par type et par semaine</span>
        </div>
      </div>

      <div className="data-card-body" style={{ paddingBottom: 0 }}>
        <div className="filter-section">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Rechercher un cavalier..."
            style={{ marginBottom: 'var(--spacing-md)' }}
          />

          <FilterPills
            filters={filterConfig}
            selectedValue={selectedType}
            onSelect={setSelectedType}
          />
        </div>
      </div>

      <div className="data-card-body">
        {filteredStats.length === 0 ? (
          <div className="empty-state-small">
            <Icons.Users />
            <p>
              {searchTerm || selectedType !== 'all'
                ? 'Aucun cavalier ne correspond aux filtres sélectionnés'
                : 'Aucune activité pour ce mois'}
            </p>
          </div>
        ) : (
          <div className="rider-activity-cards">
            {/* Header comme première ligne de tableau */}
            <div className="rider-activity-header">
              <div className="header-rider">Cavalier</div>
              <div className="header-event-type">Type d'événement</div>
              {weeks.map((week) => (
                <div key={week.weekNumber} className="header-week">
                  {week.label}
                </div>
              ))}
            </div>

            {/* Cartes empilées pour chaque cavalier */}
            {filteredStats.map((rider) => (
              <RiderActivityCard key={rider.riderId} rider={rider} weeks={weeks} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function RiderActivityCard({ rider, weeks }) {
  const allEventTypes = useMemo(() => {
    const types = new Set();
    rider.weeks?.forEach((week) => {
      Object.keys(week.eventsByType || {}).forEach((type) => types.add(type));
    });
    return Array.from(types);
  }, [rider.weeks]);

  const hasMultipleEvents = allEventTypes.length > 1;
  const configRiderType = getRiderTypeConfig(rider.riderType);

  // Aucun événement
  if (allEventTypes.length === 0) {
    return (
      <div className="rider-activity-card">
        <div className="card-row">
          <div className="cell-rider-name">
            <div>{rider.riderName}</div>
            <DomainBadge config={configRiderType} />
          </div>
          <div className="cell-event-type">
            <span className="text-muted">Aucun événement</span>
          </div>
          {weeks.map((week) => (
            <div key={week.weekNumber} className="cell-week">
              <span className="count-pill empty">-</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rider-activity-card">
      {/* Section nom du cavalier - à gauche */}
      <div className="card-rider-section">
        <div className="cell-rider-name">
          <div>{rider.riderName}</div>
          <DomainBadge config={configRiderType} />
        </div>
      </div>

      {/* Séparateur vertical */}
      <div className="card-separator"></div>

      {/* Section grille événements - à droite */}
      <div className="card-events-section">
        {/* Lignes par type d'événement */}
        {allEventTypes.map((eventType) => {
          const configEventType = getEventTypeConfig(eventType);

          return (
            <div key={eventType} className="card-row">
              <div className="cell-event-type">
                <DomainBadge config={configEventType} />
              </div>

              {weeks.map((week) => {
                const weekData = rider.weeks?.find((w) => w.weekNumber === week.weekNumber);
                const count = weekData?.eventsByType?.[eventType] || 0;

                return (
                  <div key={week.weekNumber} className="cell-week">
                    <span className={`count-pill ${count > 0 ? 'active' : 'empty'}`}>
                      {count || '-'}
                    </span>
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* Ligne total */}
        {hasMultipleEvents && (
          <div className="card-row card-row-total">
            <div className="cell-event-type">
              <strong>Total</strong>
            </div>
            {weeks.map((week) => {
              const weekData = rider.weeks?.find((w) => w.weekNumber === week.weekNumber);
              const weekTotal = Object.values(weekData?.eventsByType ?? {}).reduce(
                (sum, count) => sum + Number(count || 0),
                0
              );
              return (
                <div key={week.weekNumber} className="cell-week">
                  <strong className="count-total">{weekTotal ?? '-'}</strong>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default RiderActivityStatsSection;
