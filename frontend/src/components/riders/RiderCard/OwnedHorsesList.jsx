import React from 'react';
import PropTypes from 'prop-types';
import { Icons } from '../../../lib/icons';
import { getHorseKindLabel, getHorseKindConfig } from '../../../lib/domains/horses/kinds';
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
      <div className="owned-horses-list">
        {horses.map((horse) => {
          const kindConfig = getHorseKindConfig(horse.kind);

          return (
            <div key={horse.id} className="owned-horse-item">
              <div className="horse-name-type">
                <strong>{horse.name}</strong>
                <span className="badge badge-kind" data-kind={horse.kind}>
                  {getHorseKindLabel(horse.kind)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
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
