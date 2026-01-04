import React from 'react';
import PropTypes from 'prop-types';
import { Icons } from '../../../lib/libraries/icons';
import '../../../styles/common/buttons.css';

function EmptyState({ type, filter, onCreate }) {
  if (type === 'no-horses') {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <Icons.Horse style={{ fontSize: '64px' }} />
        </div>
        <h3>Aucun cheval enregistré</h3>
        <p>Commencez par ajouter votre premier cheval</p>
        <button className="btn btn-primary" onClick={onCreate}>
          <Icons.Add /> Créer le premier cheval
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
        <p>Aucun {filter === 'horse' ? 'cheval' : 'poney'} trouvé avec ce filtre</p>
      </div>
    );
  }

  return null;
}

EmptyState.propTypes = {
  type: PropTypes.oneOf(['no-horses', 'no-results']).isRequired,
  filter: PropTypes.string,
  onCreate: PropTypes.func,
};

export default EmptyState;