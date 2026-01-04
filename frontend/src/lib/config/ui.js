/**
 * UI Configuration Constants
 */

// Modal sizes
export const MODAL_SIZES = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
};

// Modal default settings
export const MODAL_CONFIG = {
  defaultSize: MODAL_SIZES.MEDIUM,
  closeOnOverlay: true,
  animationDuration: 300,
};

// Form validation rules
export const VALIDATION_RULES = {
  NAME: {
    minLength: 1,
    maxLength: 100,
    required: true,
  },
  EMAIL: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    required: false,
  },
  PHONE: {
    pattern: /^[\d\s\-+()]+$/,
    minLength: 10,
    required: false,
  },
  DESCRIPTION: {
    maxLength: 500,
    required: false,
  },
};

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  INPUT: 'YYYY-MM-DD',
  TIME: 'HH:mm',
  DATETIME: 'DD/MM/YYYY HH:mm',
};

// Table configuration
export const TABLE_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
  MIN_SEARCH_LENGTH: 2,
};

// Status colors
export const STATUS_COLORS = {
  ACTIVE: '#48bb78',
  INACTIVE: '#f56565',
  PENDING: '#ed8936',
  COMPLETED: '#4299e1',
  CANCELLED: '#718096',
};

// Loading states
export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
};