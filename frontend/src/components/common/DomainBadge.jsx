// components/common/DomainBadge.jsx
import PropTypes from 'prop-types';

function DomainBadge({ config, className = '' }) {
  if (!config) return null;

  const { label, value } = config;

  return (
    <span className={`badge ${className}`} data-type={value}>
      {label}
    </span>
  );
}

DomainBadge.propTypes = {
  config: PropTypes.shape({
    value: PropTypes.any.isRequired,
    label: PropTypes.string.isRequired,
  }),
  className: PropTypes.string,
};

export default DomainBadge;
