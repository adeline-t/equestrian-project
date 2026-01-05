import React from 'react';
import PropTypes from 'prop-types';
import { Icons } from '../../../lib/libraries/icons.jsx';
import { format, parseISO, isAfter, isBefore, isToday } from 'date-fns';
import { fr } from 'date-fns/locale';
import '../../../styles/common/buttons.css';

function PackagesList({ packages, onAdd, onEdit }) {
  /**
   * Determine package status based on dates
   */
  const getPackageStatus = (pkg) => {
    const now = new Date();
    const startDate = pkg.activity_start_date ? parseISO(pkg.activity_start_date) : null;
    const endDate = pkg.activity_end_date ? parseISO(pkg.activity_end_date) : null;

    if (endDate && isBefore(now, startDate)) {
      return { status: 'upcoming', label: 'À venir', color: '#4299e1' };
    }

    if (endDate && isAfter(now, endDate)) {
      return { status: 'expired', label: 'Expiré', color: '#cbd5e0' };
    }

    if (startDate && (isToday(startDate) || isAfter(now, startDate))) {
      if (!endDate || isAfter(endDate, now) || isToday(endDate)) {
        return { status: 'active', label: 'Actif', color: '#48bb78' };
      }
    }

    return { status: 'inactive', label: 'Inactif', color: '#ed8936' };
  };

  /**
   * Format date for display
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'Non défini';
    try {
      return format(parseISO(dateString), 'd MMM yyyy', { locale: fr });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="section section-minimal mb-30">
      <div className="flex-between mb-15">
        <h3>
          <Icons.Packages style={{ marginRight: '8px' }} />
          Forfaits ({packages.length})
        </h3>
        <button className="btn btn-primary btn-icon" onClick={onAdd} title="Ajouter un forfait">
          <Icons.Add />
        </button>
      </div>

      {packages.length === 0 ? (
        <p style={{ color: '#718096', margin: '0', fontSize: '0.9rem' }}>Aucun forfait actif</p>
      ) : (
        <div className="packages-table-wrapper">
          {/* Table Header */}
          <div className="packages-table-header">
            <div className="col-status">Statut</div>
            <div className="col-particuliers">Cours part.</div>
            <div className="col-prestations">Prestations</div>
            <div className="col-debut">Début</div>
            <div className="col-fin">Fin</div>
          </div>

          {/* Table Body */}
          <div className="packages-table-body">
            {packages.map((pkg) => {
              const statusInfo = getPackageStatus(pkg);

              return (
                <div key={pkg.id} className="package-row">
                  {/* Status */}
                  <div className="col-status">
                    <span
                      className="package-status-badge"
                      style={{
                        backgroundColor: statusInfo.color,
                        color: 'white',
                      }}
                    >
                      {statusInfo.label}
                    </span>
                  </div>

                  {/* Private Lessons */}
                  <div className="col-particuliers">
                    <span className="lesson-badge">{pkg.private_lesson_count || 0}</span>
                  </div>

                  {/* Joint Lessons */}
                  <div className="col-prestations">
                    <span className="lesson-badge">{pkg.joint_lesson_count || 0}</span>
                  </div>

                  {/* Start Date */}
                  <div className="col-debut">
                    <span className="date-value">{formatDate(pkg.activity_start_date)}</span>
                  </div>

                  {/* End Date */}
                  <div className="col-fin">
                    <span className="date-value">
                      {pkg.activity_end_date ? formatDate(pkg.activity_end_date) : '-'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

PackagesList.propTypes = {
  packages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      private_lesson_count: PropTypes.number,
      joint_lesson_count: PropTypes.number,
      private_lessons_used: PropTypes.number,
      joint_lessons_used: PropTypes.number,
      activity_start_date: PropTypes.string,
      activity_end_date: PropTypes.string,
    })
  ).isRequired,
  onAdd: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default PackagesList;
