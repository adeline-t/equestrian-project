import React from 'react';
import PropTypes from 'prop-types';
import { LAYOUT_STYLES } from '../../../../lib/config/ui/cardStyles';
import {
  HeaderSection,
  TimeSection,
  DurationSection,
  BlockedEventSection,
} from './EventCardSections';

/**
 * Compact layout: Status Badge + Name | Time + Participants
 */
function CompactContent({ event }) {
  return (
    <div style={{ ...LAYOUT_STYLES.column, height: '100%', justifyContent: 'space-between' }}>
      <HeaderSection event={event} isCompact={true} />
      <TimeSection event={event} isCompact={true} />
    </div>
  );
}

/**
 * Standard layout: Status Badge + Name | Time + Participants | Duration
 */
function StandardContent({ event }) {
  return (
    <div style={{ ...LAYOUT_STYLES.column, height: '100%' }}>
      <HeaderSection event={event} isCompact={false} />
      <TimeSection event={event} isCompact={false} />
      <DurationSection event={event} />
    </div>
  );
}

/**
 * Blocked event layout: Icon + Label | Time
 */
function BlockedContent({ event }) {
  return <BlockedEventSection event={event} />;
}

/**
 * Main content component
 */
function EventCardContent({ event, isCompact = false, isBlocked = false }) {
  if (isBlocked) {
    return <BlockedContent event={event} />;
  }

  return isCompact ? <CompactContent event={event} /> : <StandardContent event={event} />;
}

EventCardContent.propTypes = {
  event: PropTypes.object.isRequired,
  isCompact: PropTypes.bool,
  isBlocked: PropTypes.bool,
};

export default EventCardContent;
