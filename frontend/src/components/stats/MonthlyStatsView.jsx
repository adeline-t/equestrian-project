import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useState } from 'react';
import { useMonthlyStats } from '../../hooks/useMonthlyStats';
import { Icons } from '../../lib/icons';
import HorseStatsSection from './HorseStatsSection';
import RiderActivityStatsSection from './RiderActivityStatsSection';
import RiderUsageStatsSection from './RiderUsageStatsSection';
import RiderBillingStatsSection from './RiderBillingStatsSection';
import '../../styles/common.css';
import '../../styles/features/stats/stats.css';
import '../../styles/features/stats/stats-additions.css';
import EventTypeSlotsStatsSection from './EventTypeSlotsStatsSection';

function MonthlyStatsView() {
  const {
    currentMonth,
    loading,
    error,
    horseStats,
    riderStats,
    riderWeeklyUsage,
    riderMonthlyBilling,
    slotStats,
    weeks,
    goToPreviousMonth,
    goToNextMonth,
    goToCurrentMonth,
  } = useMonthlyStats();

  const [activeTab, setActiveTab] = useState('horses');

  const monthLabel = format(currentMonth, 'MMMM yyyy', { locale: fr });
  const isCurrentMonth = format(currentMonth, 'yyyy-MM') === format(new Date(), 'yyyy-MM');

  const tabs = [
    { id: 'horses', label: 'Chevaux', icon: Icons.Horse, count: horseStats.length },
    {
      id: 'usage',
      label: 'Consommation forfaits',
      icon: Icons.Packages,
      count: riderWeeklyUsage.length,
    },
    { id: 'slots', label: 'Événements', icon: Icons.Calendar, count: slotStats?.totalSlots || 0 }, // ← Corriger ici
    {
      id: 'billing',
      label: 'Facturation Club',
      icon: Icons.BarChart,
      count: riderMonthlyBilling.length,
    },
  ];

  return (
    <div className="stats-view monthly-stats">
      <div className="card">
        {/* HEADER */}
        <div className="list-header">
          <div className="list-header-text">
            <h2>Statistiques mensuelles</h2>
            <span className="detail-card-meta">Suivi complet des activités et facturation</span>
          </div>

          <div className="calendar-header__nav">
            <button className="btn btn-secondary btn-md" onClick={goToPreviousMonth}>
              <Icons.ChevronLeft />
            </button>

            <button className="btn btn-primary btn-md" onClick={goToCurrentMonth}>
              <Icons.Calendar />
              Mois en cours
            </button>
            <button className="btn btn-secondary btn-md" onClick={goToNextMonth}>
              <Icons.ChevronRight />
            </button>
          </div>
        </div>

        {/* MONTH BADGE */}
        <div className="stats-header">
          <h3>{monthLabel}</h3>
          <span className="text">
            {' '}
            • {weeks.length} semaine{weeks.length > 1 ? 's' : ''}
          </span>
        </div>

        {/* TABS */}
        <div className="tabs">
          {tabs.map((tab) => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <TabIcon />
                {tab.label}
                {tab.count > 0 && <span className="count-badge">{tab.count}</span>}
              </button>
            );
          })}
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
            {activeTab === 'horses' && <HorseStatsSection stats={horseStats} weeks={weeks} />}

            {activeTab === 'riders' && (
              <RiderActivityStatsSection stats={riderStats} weeks={weeks} />
            )}

            {activeTab === 'usage' && (
              <RiderUsageStatsSection stats={riderWeeklyUsage} weeks={weeks} />
            )}

            {activeTab === 'billing' && (
              <RiderBillingStatsSection stats={riderMonthlyBilling} month={currentMonth} />
            )}

            {activeTab === 'slots' && (
              <EventTypeSlotsStatsSection
                stats={slotStats}
                weeks={weeks}
                currentMonth={currentMonth}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MonthlyStatsView;
