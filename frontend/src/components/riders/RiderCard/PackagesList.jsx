import React from 'react';
import PropTypes from 'prop-types';
import { Icons } from '../../../lib/libraries/icons';
import '../../../styles/common/buttons.css';

function PackagesList({ packages, onAdd, onEdit }) {
  return (
    <div className="section section-minimal mb-30">
      <div className="flex-between mb-15">
        <h3>
          <Icons.Packages style={{ marginRight: '8px' }} />
          Forfaits ({packages.length})
        </h3>
        <button
          className="btn btn-primary btn-icon"
          onClick={onAdd}
          title="Ajouter un forfait"
        >
          <Icons.Add />
        </button>
      </div>

      {packages.length === 0 ? (
        <p style={{ color: '#718096', margin: '0', fontSize: '0.9rem' }}>
          Aucun forfait actif
        </p>
      ) : (
        <div className="packages-list">
          {packages.map((pkg) => (
            <div key={pkg.id} className="package-item">
              <div className="package-info">
                <span className="package-id">#{pkg.id}</span>
                <div className="package-lessons">
                  Cours particuliers :
                  <span className="lesson-badge">{pkg.private_lesson_count || 0}</span>
                  Prestations :
                  <span className="lesson-badge">{pkg.joint_lesson_count || 0}</span>
                </div>
              </div>
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => onEdit(pkg)}
                title="Modifier"
              >
                <Icons.Edit />
              </button>
            </div>
          ))}
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
    })
  ).isRequired,
  onAdd: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default PackagesList;