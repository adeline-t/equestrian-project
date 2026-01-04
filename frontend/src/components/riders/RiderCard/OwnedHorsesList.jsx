import React from 'react';
import PropTypes from 'prop-types';
import { Icons } from '../../../lib/libraries/icons.jsx';
import { HORSE_KIND_LABELS } from '../../../constants/horses.js';
import '../../../styles/common/badges.css';

function OwnedHorsesList({ horses }) {
  if (horses.length === 0) {
    return null;
  }

  return (
    <div className="section section-minimal mb-30">
      <h3>
        <Icons.Horse style={{ marginRight: '8px' }} />
        Chevaux Possédés ({horses.length})
      </h3>

      {horses.length === 0 ? (
        <p style={{ color: '#718096', margin: '10px 0 0 0', fontSize: '0.9rem' }}>
          Aucun cheval actif possédé
        </p>
      ) : (
        <div className="owned-horses-list">
          {horses.map((horse) => (
            <div key={horse.id} className="owned-horse-item">
              <div className="horse-name-type">
                <strong>{horse.name}</strong>
                <span className={`badge badge-${horse.kind}`}>
                  {HORSE_KIND_LABELS[horse.kind] || horse.kind}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

OwnedHorsesList.propTypes = {
  horses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      kind: PropTypes.string,
    })
  ).isRequired,
};

export default OwnedHorsesList;
