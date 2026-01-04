import React from 'react';
import { Icons } from '../../lib/libraries/icons.jsx';

const EmptyState = ({ type, onAction, filter }) => {
  if (type === 'no-horses') {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <Icons.Horse style={{ fontSize: '64px' }} />
        </div>
        <h3>Aucun cheval enregistré</h3>
        <p>Commencez par ajouter votre premier cheval</p>
        <button className="btn btn-primary" onClick={onAction}>
          <Icons.Add /> Créer le premier cheval
        </button>
      </div>
    );
  }

  if (type === 'no-filter-results') {
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
};

export default EmptyState;
