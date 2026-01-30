import { Icons } from '../../lib/icons';
import { useState, useMemo } from 'react';
import SearchInput from '../common/SearchInput';
import FilterPills from '../common/FilterPills';
import { getRiderTypeConfig, RIDER_TYPES } from '../../lib/domain';
import { normalizeString } from '../../lib/helpers';
import DomainBadge from '../common/DomainBadge';
import '../../styles/features/stats/rider-usage-cards.css';

function RiderUsageStatsSection({ stats, weeks }) {
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
    <div className="data-card rider-usage-cards-section">
      <div className="data-card-header">
        <div className="data-card-title">
          <h3>Consommation des forfaits</h3>
          <span className="detail-card-meta">Services et cours particuliers par semaine</span>
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
            <Icons.Packages />
            <p>
              {searchTerm || selectedType !== 'all'
                ? 'Aucun cavalier ne correspond aux filtres sélectionnés'
                : 'Aucune consommation pour ce mois'}
            </p>
          </div>
        ) : (
          <div className="rider-usage-cards">
            {/* Header comme première ligne de tableau */}
            <div className="rider-usage-header">
              <div className="header-rider">Cavalier</div>
              <div className="header-usage-type">Type</div>
              {weeks.map((week) => (
                <div key={week.weekNumber} className="header-week">
                  {week.label}
                </div>
              ))}
            </div>

            {/* Cartes empilées pour chaque cavalier */}
            {filteredStats.map((rider) => (
              <RiderUsageCard key={rider.riderId} rider={rider} weeks={weeks} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function RiderUsageCard({ rider, weeks }) {
  const configRiderType = getRiderTypeConfig(rider.riderType);

  // Calcul des totaux
  const totals = rider.weeks?.reduce(
    (acc, week) => ({
      services: acc.services + week.servicesConsumed,
      privateLessons: acc.privateLessons + week.privateLessonsConsumed,
      competition: acc.competition + week.competitionExtras,
      special: acc.special + week.specialExtras,
      extraServices: acc.extraServices + week.extraServices,
    }),
    { services: 0, privateLessons: 0, competition: 0, special: 0, extraServices: 0 }
  ) || { services: 0, privateLessons: 0, competition: 0, special: 0, extraServices: 0 };

  // Déterminer quelles lignes afficher
  const showPrivateLessons = rider.privateLessonsPerWeek > 0;
  const showCompetition = totals.competition > 0;
  const showSpecial = totals.special > 0;
  const showExtras = totals.extraServices > 0;

  return (
    <div className="rider-usage-card">
      {/* Section nom du cavalier - à gauche */}
      <div className="card-rider-section">
        <div className="cell-rider-name">
          <div>{rider.riderName}</div>
          <DomainBadge config={configRiderType} />
          <div className="rider-package-info">
            {rider.servicesPerWeek || 0} services
            {rider.privateLessonsPerWeek > 0 && (
              <> + {rider.privateLessonsPerWeek} cours particuliers</>
            )}
            <span className="text-muted"> / semaine</span>
          </div>
        </div>
      </div>

      {/* Section grille consommation - à droite */}
      <div className="card-usage-section">
        {/* Séparateur vertical */}
        <div className="card-separator">
          <>
            {/* Header comme première ligne de tableau */}
            <div className="header-rider"> </div>
            <div className="header-usage-type"> </div>
            {weeks.map((week) => (
              <div key={week.weekNumber} className="header-week">
                {week.label}
              </div>
            ))}
          </>
        </div>

        {/* Ligne Services */}
        <div className="card-row">
          <div className="cell-usage-type">
            <span>Services</span>
          </div>

          {weeks.map((week) => {
            const weekData = rider.weeks?.find((w) => w.weekStart === week.startDate);
            const consumed = weekData?.servicesConsumed || 0;
            const allowed = rider.servicesPerWeek || 0;
            const isOverLimit = consumed > allowed;

            return (
              <div key={week.weekNumber} className="cell-week">
                <span
                  className={`count-pill ${
                    isOverLimit ? 'warning' : consumed > 0 ? 'active' : 'empty'
                  }`}
                >
                  {consumed > 0 ? (
                    <>
                      {consumed}
                      {allowed > 0 && `/${allowed}`}
                    </>
                  ) : (
                    '-'
                  )}
                </span>
              </div>
            );
          })}
        </div>

        {/* Ligne Cours particuliers */}
        <div className="card-row">
          <div className="cell-usage-type">
            <span>Cours particuliers</span>
          </div>

          {weeks.map((week) => {
            const weekData = rider.weeks?.find((w) => w.weekStart === week.startDate);
            const consumed = weekData?.privateLessonsConsumed || 0;
            const allowed = rider.privateLessonsPerWeek || 0;
            const isOverLimit = consumed > allowed;

            return (
              <div key={week.weekNumber} className="cell-week">
                <span
                  className={`count-pill ${
                    isOverLimit ? 'warning' : consumed > 0 ? 'active' : 'empty'
                  }`}
                >
                  {consumed > 0 ? (
                    <>
                      {consumed}
                      {allowed > 0 && `/${allowed}`}
                    </>
                  ) : (
                    '-'
                  )}
                </span>
              </div>
            );
          })}
        </div>

        {/* Ligne Compétitions */}
        {showCompetition && (
          <div className="card-row">
            <div className="cell-usage-type">
              <Icons.Competition className="icon-xs" />
              <span>Compétitions</span>
            </div>

            {weeks.map((week) => {
              const weekData = rider.weeks?.find((w) => w.weekStart === week.startDate);
              const count = weekData?.competitionExtras || 0;

              return (
                <div key={week.weekNumber} className="cell-week">
                  <span className={`count-pill ${count > 0 ? 'info' : 'empty'}`}>
                    {count || '-'}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Ligne Événements spéciaux */}
        {showSpecial && (
          <div className="card-row">
            <div className="cell-usage-type">
              <Icons.Info className="icon-xs" />
              <span>Spéciaux</span>
            </div>

            {weeks.map((week) => {
              const weekData = rider.weeks?.find((w) => w.weekStart === week.startDate);
              const count = weekData?.specialExtras || 0;

              return (
                <div key={week.weekNumber} className="cell-week">
                  <span className={`count-pill ${count > 0 ? 'info' : 'empty'}`}>
                    {count || '-'}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Ligne Dépassements */}
        {showExtras && (
          <div className="card-row card-row-warning">
            <div className="cell-usage-type">
              <Icons.Warning className="icon-xs" />
              <strong>Écart</strong>
            </div>

            {weeks.map((week) => {
              const weekData = rider.weeks?.find((w) => w.weekStart === week.startDate);
              const extra = weekData?.extraServices || 0;

              return (
                <div key={week.weekNumber} className="cell-week">
                  <span className={`count-pill ${extra > 0 ? 'error' : 'empty'}`}>
                    {extra > 0 ? `+${extra}` : '-'}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default RiderUsageStatsSection;
