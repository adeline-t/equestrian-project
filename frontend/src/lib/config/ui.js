/**
 * UI - Consolidated configuration
 */

export const MODAL_SIZES = { SMALL: 'small', MEDIUM: 'medium', LARGE: 'large' };

export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  INPUT: 'YYYY-MM-DD',
  TIME: 'HH:mm',
  DATETIME: 'DD/MM/YYYY HH:mm',
};

export const TABLE_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
  MIN_SEARCH_LENGTH: 2,
};

export const STATUS_COLORS = {
  ACTIVE: '#48bb78',
  INACTIVE: '#f56565',
  PENDING: '#ed8936',
  COMPLETED: '#4299e1',
  CANCELLED: '#718096',
};

export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
};

export const CARD_STYLES = {
  base: {
    border: 'none',
    borderRadius: '6px',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  compact: { minHeight: '40px', padding: '4px 6px' },
  standard: { minHeight: '60px', padding: '6px 8px' },
};

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

export const LAYOUT_STYLES = {
  row: { display: 'flex', alignItems: 'center', gap: '4px' },
  spaceBetween: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  column: { display: 'flex', flexDirection: 'column', gap: '4px' },
};

export const MODAL_CONFIG = {
  defaultSize: MODAL_SIZES.MEDIUM,
  closeOnOverlay: true,
  animationDuration: 300,
};

export const getModalSizeClass = (size) => {
  const sizeMap = {
    [MODAL_SIZES.SMALL]: 'small',
    [MODAL_SIZES.MEDIUM]: 'medium',
    [MODAL_SIZES.LARGE]: 'large',
  };
  return sizeMap[size] || sizeMap[MODAL_SIZES.MEDIUM];
};

export const getCardStyle = (layout) => ({
  ...CARD_STYLES.base,
  ...(CARD_STYLES[layout] || CARD_STYLES.standard),
});

export const getTextStyle = (layout, element) => {
  const layoutStyles = TEXT_STYLES[layout] || TEXT_STYLES.standard;
  return layoutStyles[element] || {};
};
