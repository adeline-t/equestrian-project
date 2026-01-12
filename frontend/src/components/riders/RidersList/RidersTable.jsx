import PropTypes from 'prop-types';
import { Icons } from '../../../lib/icons';
import RiderRow from './RiderRow';
import '../../../styles/index.css';
import '../../../styles/components/riders.css';

const RidersTable = ({ riders, onViewDetails, onEdit, onDelete, getStatusBadge }) => {
  if (!riders.length) {
    return (
      <div className="empty-state">
        <Icons.User style={{ fontSize: '48px' }} />
        <h3>Aucun cavalier trouvé</h3>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Type</th>
            <th>Email</th>
            <th>Téléphone</th>
            <th>Statut</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {riders.map((rider) => (
            <RiderRow
              key={rider.id}
              rider={rider}
              onViewDetails={onViewDetails}
              onEdit={onEdit}
              onDelete={onDelete}
              getStatusBadge={getStatusBadge}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

RidersTable.propTypes = {
  riders: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      kind: PropTypes.string.isRequired,
      email: PropTypes.string,
      phone: PropTypes.string,
    })
  ).isRequired,
  onViewDetails: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  getStatusBadge: PropTypes.func.isRequired,
};

export default RidersTable;
