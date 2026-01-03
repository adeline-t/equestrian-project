import React from 'react';
import PropTypes from 'prop-types';
import { Icons } from '../../../utils/icons';
import '../../../styles/common/buttons.css';

function PairingsEmptyState({ type, filter, onCreate }) {
  if (type === 'no-pairings') {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <Icons.Link style={{ fontSize: '64px' }} />
        </div>
        <h3>Aucune pension enregistrée</h3>
        <p>Commencez par créer la première pension entre un cavalier et un cheval</p>
        <button className="btn btn-primary" onClick={onCreate}>
          <Icons.Add style={{ marginRight: '8px' }} />
          Créer la première pension
        </button>
      </div>
    );
  }

  if (type === 'no-results') {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <Icons.List style={{ fontSize: '64px' }} />
        </div>
        <h3>Aucun résultat</h3>
        <p>Aucune pension {filter === 'active' ? 'active' : 'inactive'} trouvée</p>
      </div>
    );
  }

  return null;
}

PairingsEmptyState.propTypes = {
  type: PropTypes.oneOf(['no-pairings', 'no-results']).isRequired,
  filter: PropTypes.string,
  onCreate: PropTypes.func,
};

export default PairingsEmptyState;