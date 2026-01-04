import React from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { formatCurrency } from '../../lib/helpers/formatters';
import * as commonStyles from '../../styles/common/common.module.css';

const PackagesList = ({ packages, loading, rider, onStatusChange, onAdd }) => {
  if (loading) {
    return (
      <div className={commonStyles.loadingContainer}>
        <div className={commonStyles.spinner}></div>
        <p>Chargement des forfaits...</p>
      </div>
    );
  }

  if (packages.length === 0) {
    return (
      <div className={commonStyles.emptyState}>
        <p>Aucun forfait trouvé</p>
        <button className={commonStyles.primaryButton} onClick={onAdd}>
          Ajouter le premier forfait
        </button>
      </div>
    );
  }

  return (
    <div className={commonStyles.section}>
      <div className={commonStyles.sectionHeader}>
        <h3>Forfaits ({packages.length})</h3>
        <button className={commonStyles.primaryButton} onClick={onAdd}>
          <PlusIcon className={commonStyles.buttonIcon} />
          Ajouter un forfait
        </button>
      </div>
      
      <div className={commonStyles.gridContainer}>
        {packages.map((pkg) => (
          <div key={pkg.id} className={commonStyles.card}>
            <div className={commonStyles.cardHeader}>
              <h4>{pkg.nom}</h4>
              <span className={
                pkg.statut === 'actif' 
                  ? commonStyles.statusActive 
                  : commonStyles.statusInactive
              }>
                {pkg.statut}
              </span>
            </div>
            <div className={commonStyles.cardContent}>
              <p><strong>Type:</strong> {pkg.type}</p>
              <p><strong>Prix:</strong> {formatCurrency(pkg.prix)}</p>
              <p><strong>Lessons restantes:</strong> {pkg.lessons_restantes}</p>
              <p><strong>Validité:</strong> {new Date(pkg.date_fin).toLocaleDateString()}</p>
            </div>
            <div className={commonStyles.cardActions}>
              <select
                value={pkg.statut}
                onChange={(e) => onStatusChange(pkg.id, e.target.value)}
                className={commonStyles.selectInput}
              >
                <option value="actif">Actif</option>
                <option value="inactif">Inactif</option>
                <option value="expiré">Expiré</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PackagesList;