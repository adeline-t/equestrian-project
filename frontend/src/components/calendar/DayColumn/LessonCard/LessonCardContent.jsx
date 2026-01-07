import React from 'react';
import PropTypes from 'prop-types';
import { LAYOUT_STYLES } from '../../../../lib/config/ui/cardStyles';
import {
  HeaderSection,
  TimeSection,
  DurationSection,
  BlockedLessonSection,
} from './LessonCardSections';

/**
 * Compact layout: Status Badge + Name | Time + Participants
 */
function CompactContent({ lesson }) {
  return (
    <div style={{ ...LAYOUT_STYLES.column, height: '100%', justifyContent: 'space-between' }}>
      <HeaderSection lesson={lesson} isCompact={true} />
      <TimeSection lesson={lesson} isCompact={true} />
    </div>
  );
}

/**
 * Standard layout: Status Badge + Name | Time + Participants | Duration
 */
function StandardContent({ lesson }) {
  return (
    <div style={{ ...LAYOUT_STYLES.column, height: '100%' }}>
      <HeaderSection lesson={lesson} isCompact={false} />
      <TimeSection lesson={lesson} isCompact={false} />
      <DurationSection lesson={lesson} />
    </div>
  );
}

/**
 * Blocked lesson layout: Icon + Label | Time
 */
function BlockedContent({ lesson }) {
  return <BlockedLessonSection lesson={lesson} />;
}

/**
 * Main content component
 */
function LessonCardContent({ lesson, isCompact = false, isBlocked = false }) {
  if (isBlocked) {
    return <BlockedContent lesson={lesson} />;
  }

  return isCompact ? <CompactContent lesson={lesson} /> : <StandardContent lesson={lesson} />;
}

LessonCardContent.propTypes = {
  lesson: PropTypes.object.isRequired,
  isCompact: PropTypes.bool,
  isBlocked: PropTypes.bool,
};

export default LessonCardContent;
