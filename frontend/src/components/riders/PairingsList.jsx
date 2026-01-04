import React from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import * as commonStyles from '../../styles/common/common.module.css';

const PairingsList = ({ pairings, loading, rider, onStatusChange, onAdd }) => {
  if (loading) {
    return (
      <div className={commonStyles.loadingContainer}>
        <div className={commonStyles.spinner}></div>
        <p>Chargement des pairings...</p>
      </div>
    );
  }

  if (pairings.length === 0) {
    return (
      <div className={commonStyles.emptyState}>
        <p>Aucun pairing trouvé</p>
        <button className={commonStyles.primaryButton} onClick={onAdd}>
          Ajouter le premier pairing
        </button>
      </div>
    );
  }

  return (
    <div className={commonStyles.section}>
      <div className={commonStyles.sectionHeader}>
        <h3>Pairings ({pairings.length})</h3>
        <button className={commonStyles.primaryButton} onClick={onAdd}>
          <PlusIcon className={commonStyles.buttonIcon} />
          Ajouter un pairing
        </button>
      </div>
      
      <div className={commonStyles.tableContainer}>
        <table className={commonStyles.table}>
          <thead>
            <tr>
              <th>Cheval</th>
              <th>Date de début</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pairings.map((pairing) => (
              <tr key={pairing.id}>
                <td>{pairing.horse_name}</td>
                <td>{new Date(pairing.date_debut).toLocaleDateString()}</td>
                <td>
                  <span className={
                    pairing.statut === 'actif' 
                      ? commonStyles.statusActive 
                      : commonStyles.statusInactive
                  }>
                    {pairing.statut}
                  </span>
                </td>
                <td>
                  <select
                    value={pairing.statut}
                    onChange={(e) => onStatusChange(pairing.id, e.target.value)}
                    className={commonStyles.selectInput}
                  >
                    <option value="actif">Actif</option>
                    <option value="inactif">Inactif</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PairingsList;