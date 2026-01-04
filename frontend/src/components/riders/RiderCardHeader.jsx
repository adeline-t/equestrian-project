import React from 'react';
import { Icons } from '../../lib/libraries/icons';
import * as commonStyles from '../../styles/common/common.module.css';

const RiderCardHeader = ({ rider, onEdit, onDelete }) => {
  return (
    <div className={commonStyles.cardHeader}>
      <div>
        <h2>
          <Icons.User style={{ marginRight: '8px' }} />
          {rider.name}
        </h2>
        <p className={commonStyles.subtitle}>Cavalier</p>
      </div>
      <div className={commonStyles.cardActions}>
        <button className={commonStyles.editButton} onClick={onEdit}>
          <Icons.Edit className={commonStyles.actionIcon} />
        </button>
        <button className={commonStyles.deleteButton} onClick={onDelete}>
          <Icons.Delete className={commonStyles.actionIcon} />
        </button>
      </div>
    </div>
  );
};

export default RiderCardHeader;