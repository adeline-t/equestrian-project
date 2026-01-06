import React from 'react';
import PropTypes from 'prop-types';
import { getLessonTypeIcon } from '../../../../constants/domains/lessons/types.js';

/**
 * Render lesson type icon
 */
function LessonCardIcon({ type, size = '14px' }) {
  const IconComponent = getLessonTypeIcon(type);
  return <IconComponent style={{ fontSize: size, flexShrink: 0 }} />;
}

LessonCardIcon.propTypes = {
  type: PropTypes.string.isRequired,
  size: PropTypes.string,
};

export default LessonCardIcon;
