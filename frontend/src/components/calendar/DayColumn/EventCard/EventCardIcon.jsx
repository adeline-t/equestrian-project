import React from 'react';
import PropTypes from 'prop-types';
import { getEventTypeIcon } from '../../../../lib/domains/events/types.js';

/**
 * Render event type icon
 */
function EventCardIcon({ type, size = '14px' }) {
  const IconComponent = getEventTypeIcon(type);
  return (
    <IconComponent
      style={{ fontSize: size, flexShrink: 0 }}
      aria-hidden="true"
      role="presentation"
    />
  );
}

EventCardIcon.propTypes = {
  type: PropTypes.string.isRequired,
  size: PropTypes.string,
};

export default EventCardIcon;
