import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Icons } from '../../lib/icons';
import { useState, useMemo } from 'react';
import DomainBadge from '../common/DomainBadge';
import SearchInput from '../common/SearchInput';
import FilterPills from '../common/FilterPills';
import { getRiderTypeConfig, RIDER_TYPES } from '../../lib/domain';
import { normalizeString } from '../../lib/helpers';
import '../../styles/features/stats/rider-usage-cards.css';

function RiderBillingStatsSection({ stats, month }) {
  const monthLabel = format(month, 'MMMM yyyy', { locale: fr });

  // États pour les filtres
  const [selectedType, setSelectedType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Compte les cavaliers par type
  const typeCounts = useMemo(() => {
    if (!stats) return { all: 0, owner: 0, loaner: 0 };

    return stats.reduce(
      (acc, rider) => {
        acc.all++;
        if (rider.rider_type === RIDER_TYPES.OWNER) acc.owner++;
        if (rider.rider_type === RIDER_TYPES.LOANER) acc.loaner++;
        return acc;
      },
      { all: 0, owner: 0, loaner: 0 }
    );
  }, [stats]);

  // Configuration des filtres pills
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

  // Filtrage des données
  const filteredStats = useMemo(() => {
    if (!stats) return [];

    let filtered = stats;

    // Filtre par type de cavalier
    if (selectedType !== 'all') {
      filtered = filtered.filter((rider) => rider.rider_type === selectedType);
    }

    // Filtre par recherche (diacritic et case insensitive)
    if (searchTerm.trim()) {
      const normalizedSearch = normalizeString(searchTerm);
      filtered = filtered.filter((rider) =>
        normalizeString(rider.rider_name).includes(normalizedSearch)
      );
    }

    return filtered;
  }, [stats, selectedType, searchTerm]);

  // Calcul des totaux globaux (sur données filtrées)
  const globalTotals = filteredStats.reduce(
    (acc, rider) => ({
      services: acc.services + (rider.services_consumed || 0),
      privateLessons: acc.privateLessons + (rider.private_lessons_consumed || 0),
      competition: acc.competition + (rider.competition_extras || 0),
      special: acc.special + (rider.special_extras || 0),
      extraServices: acc.extraServices + (rider.extra_services || 0),
      extraPrivateLessons: acc.extraPrivateLessons + (rider.extra_private_lessons || 0),
    }),
    {
      services: 0,
      privateLessons: 0,
      competition: 0,
      special: 0,
      extraServices: 0,
      extraPrivateLessons: 0,
    }
  );

  return (
    <div className="data-card rider-usage-cards-section">
      <div className="data-card-header">
        <div className="data-card-title">
          <h3>Facturation {monthLabel}</h3>
          <span className="detail-card-meta">Récapitulatif mensuel des consommations</span>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="data-card-body" style={{ paddingBottom: 0 }}>
        <div className="filter-section">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Rechercher un cavalier..."
            className=""
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
            <Icons.BarChart />
            <p>
              {searchTerm || selectedType !== 'all'
                ? 'Aucun cavalier ne correspond aux filtres sélectionnés'
                : 'Aucune facturation pour ce mois'}
            </p>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="stats-summary-grid">
              <div className="summary-card">
                <div className="summary-card-icon">
                  <Icons.Packages />
                </div>
                <div className="summary-card-content">
                  <div className="summary-card-label">Services totaux</div>
                  <div className="summary-card-value">{globalTotals.services}</div>
                </div>
              </div>

              <div className="summary-card">
                <div className="summary-card-icon">
                  <Icons.User />
                </div>
                <div className="summary-card-content">
                  <div className="summary-card-label">Cours privés totaux</div>
                  <div className="summary-card-value">{globalTotals.privateLessons}</div>
                </div>
              </div>

              <div className="summary-card">
                <div className="summary-card-icon">
                  <Icons.Award />
                </div>
                <div className="summary-card-content">
                  <div className="summary-card-label">Compétitions</div>
                  <div className="summary-card-value">{globalTotals.competition}</div>
                </div>
              </div>

              <div className="summary-card warning">
                <div className="summary-card-icon">
                  <Icons.Warning />
                </div>
                <div className="summary-card-content">
                  <div className="summary-card-label">Dépassements services</div>
                  <div className="summary-card-value">{globalTotals.extraServices}</div>
                </div>
              </div>
            </div>

            {/* Desktop Table */}
            <div className="billing-table">
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th className="table-header-sticky">Cavalier</th>
                      <th className="table-header-center">Forfait services</th>
                      <th className="table-header-center">Services consommés</th>
                      <th className="table-header-center">Forfait cours privés</th>
                      <th className="table-header-center">Cours privés consommés</th>
                      <th className="table-header-center">Compétitions</th>
                      <th className="table-header-center">Spéciaux</th>
                      <th className="table-header-center">Dépassements</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStats.map((rider, index) => {
                      const hasExtraServices = rider.extra_services > 0;
                      const hasExtraPrivateLessons = rider.extra_private_lessons > 0;
                      const hasAnyExtras = hasExtraServices || hasExtraPrivateLessons;

                      return (
                        <tr
                          key={`billing-${index}`}
                          className={hasAnyExtras ? 'table-row-warning' : ''}
                        >
                          <td className="table-cell-name">
                            <div className="table-cell-content">
                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '2px',
                                  minWidth: 0,
                                }}
                              >
                                <span style={{ fontWeight: 'var(--font-weight-semibold)' }}>
                                  {rider.rider_name}
                                </span>
                                <DomainBadge
                                  config={getRiderTypeConfig(rider.rider_type)}
                                  className="badge-small"
                                />
                              </div>
                            </div>
                          </td>

                          <td className="table-cell-center">
                            {rider.services_per_week ? (
                              <span className="count-pill info">{rider.services_per_week}/sem</span>
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </td>

                          <td className="table-cell-center">
                            <span
                              className={`count-pill ${hasExtraServices ? 'warning' : 'active'}`}
                            >
                              {rider.services_consumed || 0}
                            </span>
                          </td>

                          <td className="table-cell-center">
                            {rider.private_lessons_per_week ? (
                              <span className="count-pill info">
                                {rider.private_lessons_per_week}/sem
                              </span>
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </td>

                          <td className="table-cell-center">
                            <span
                              className={`count-pill ${
                                hasExtraPrivateLessons ? 'warning' : 'active'
                              }`}
                            >
                              {rider.private_lessons_consumed || 0}
                            </span>
                          </td>

                          <td className="table-cell-center">
                            {rider.competition_extras > 0 ? (
                              <span className="count-pill info">{rider.competition_extras}</span>
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </td>

                          <td className="table-cell-center">
                            {rider.special_extras > 0 ? (
                              <span className="count-pill info">{rider.special_extras}</span>
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </td>

                          <td className="table-cell-center">
                            {hasAnyExtras ? (
                              <div className="table-cell-content">
                                {hasExtraServices && (
                                  <span className="count-pill error">
                                    +{rider.extra_services} services
                                  </span>
                                )}
                                {hasExtraPrivateLessons && (
                                  <span className="count-pill error">
                                    +{rider.extra_private_lessons} CP
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default RiderBillingStatsSection;
