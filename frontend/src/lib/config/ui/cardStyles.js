/**
 * Lesson Card Style Constants
 */

// Base card styles
export const CARD_STYLES = {
  base: {
    border: 'none',
    borderRadius: '6px',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  compact: {
    minHeight: '40px',
    padding: '4px 6px',
  },
  standard: {
    minHeight: '60px',
    padding: '6px 8px',
  },
};

// Text styles for different card layouts
export const TEXT_STYLES = {
  compact: {
    name: { fontSize: '10px', fontWeight: '500' },
    time: { fontSize: '9px' },
    label: { fontSize: '9px' },
  },
  standard: {
    name: { fontSize: '11px', fontWeight: '600' },
    time: { fontSize: '11px', fontWeight: '500' },
    label: { fontSize: '11px' },
    duration: { fontSize: '10px' },
  },
};

// Layout utility styles
export const LAYOUT_STYLES = {
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  spaceBetween: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
};

/**
 * Get card style by layout type
 * @param {string} layout - Layout type ('compact' or 'standard')
 * @returns {Object} Style object
 */
export const getCardStyle = (layout) => {
  return {
    ...CARD_STYLES.base,
    ...CARD_STYLES[layout] || CARD_STYLES.standard,
  };
};

/**
 * Get text style by layout type and element
 * @param {string} layout - Layout type ('compact' or 'standard')
 * @param {string} element - Element type ('name', 'time', 'label', 'duration')
 * @returns {Object} Style object
 */
export const getTextStyle = (layout, element) => {
  const layoutStyles = TEXT_STYLES[layout] || TEXT_STYLES.standard;
  return layoutStyles[element] || {};
};