import React from 'react';
import * as commonStyles from '../../styles/common/common.module.css';

const OwnedHorsesList = ({ horses, loading }) => {
  if (loading) {
    return (
      <div className={commonStyles.loadingContainer}>
        <div className={commonStyles.spinner}></div>
        <p>Chargement des chevaux...</p>
      </div>
    );
  }

  if (horses.length === 0) {
    return (
      <div className={commonStyles.emptyState}>
        <p>Aucun cheval trouvé</p>
      </div>
    );
  }

  return (
    <div className={commonStyles.section}>
      <div className={commonStyles.sectionHeader}>
        <h3>Chevaux ({horses.length})</h3>
      </div>
      
      <div className={commonStyles.gridContainer}>
        {horses.map((horse) => (
          <div key={horse.id} className={commonStyles.card}>
            <div className={commonStyles.cardHeader}>
              <h4>{horse.nom}</h4>
              <span className={
                horse.statut === 'actif' 
                  ? commonStyles.statusActive 
                  : commonStyles.statusInactive
              }>
                {horse.statut}
              </span>
            </div>
            <div className={commonStyles.cardContent}>
              <p><strong>Race:</strong> {horse.race}</p>
              <p><strong>Âge:</strong> {horse.age} ans</p>
              <p><strong>Robe:</strong> {horse.robe}</p>
              <p><strong>Sexe:</strong> {horse.sexe}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OwnedHorsesList;