import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Icons } from '../../lib/icons';
import '../../styles/common/infotooltip.css';

function InfoTooltip({ message, position = 'top' }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="info-tooltip-wrapper">
      <button
        type="button"
        className="info-tooltip-trigger"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
        aria-label="Information"
      >
        <Icons.Info />
      </button>
      {isVisible && <div className={`info-tooltip info-tooltip-${position}`}>{message}</div>}
    </div>
  );
}

InfoTooltip.propTypes = {
  message: PropTypes.string.isRequired,
  position: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
};

export default InfoTooltip;
