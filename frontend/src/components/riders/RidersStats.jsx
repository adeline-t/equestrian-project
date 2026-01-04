import React from 'react';

const RidersStats = ({ stats }) => {
  return (
    <div
      className="stats-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px',
      }}
    >
      <div className="stat-card">
        <div className="stat-content">
          <h3>{stats.total}</h3>
          <p>Total des cavaliers</p>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-content">
          <h3>{stats.active}</h3>
          <p>Cavaliers actifs</p>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-content">
          <h3>{stats.inactive}</h3>
          <p>Cavaliers inactifs</p>
        </div>
      </div>
    </div>
  );
};

export default RidersStats;
