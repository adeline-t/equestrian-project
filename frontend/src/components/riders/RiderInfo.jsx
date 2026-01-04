import React from 'react';
import { CurrencyDollarIcon, UserPlusIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { Icons } from '../../lib/libraries/icons.jsx';
import * as commonStyles from '../../styles/common/common.module.css';

const RiderInfo = ({ rider, stats }) => {
  return (
    <div className={commonStyles.section}>
      <div className={commonStyles.infoGrid}>
        <div className={commonStyles.infoItem}>
          <label>
            <Icons.Email style={{ marginRight: '4px' }} />
            Email
          </label>
          <p>{rider.email || 'Non spécifié'}</p>
        </div>
        <div className={commonStyles.infoItem}>
          <label>
            <Icons.Phone style={{ marginRight: '4px' }} />
            Téléphone
          </label>
          <p>{rider.phone || 'Non spécifié'}</p>
        </div>
        <div className={commonStyles.infoItem}>
          <label>
            <Icons.Calendar style={{ marginRight: '4px' }} />
            Début
          </label>
          <p>{rider.activity_start_date || 'Non spécifié'}</p>
        </div>
        <div className={commonStyles.infoItem}>
          <label>
            <Icons.Calendar style={{ marginRight: '4px' }} />
            Fin
          </label>
          <p>{rider.activity_end_date || 'Non spécifié'}</p>
        </div>
      </div>

      <div className={commonStyles.statsContainer}>
        <h3>Statistiques</h3>
        <div className={commonStyles.statsGrid}>
          <div className={commonStyles.statCard}>
            <CurrencyDollarIcon className={commonStyles.statIcon} />
            <div>
              <p className={commonStyles.statValue}>{stats.activePackages}</p>
              <p className={commonStyles.statLabel}>Forfaits actifs</p>
            </div>
          </div>
          <div className={commonStyles.statCard}>
            <UserPlusIcon className={commonStyles.statIcon} />
            <div>
              <p className={commonStyles.statValue}>{stats.activePairings}</p>
              <p className={commonStyles.statLabel}>Pairings actifs</p>
            </div>
          </div>
          <div className={commonStyles.statCard}>
            <CheckCircleIcon className={commonStyles.statIcon} />
            <div>
              <p className={commonStyles.statValue}>{stats.activeHorses}</p>
              <p className={commonStyles.statLabel}>Chevaux actifs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiderInfo;
