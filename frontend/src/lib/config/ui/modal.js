/**
 * Modal Configuration
 */

import { MODAL_SIZES } from './constants.js';

// Modal default settings
export const MODAL_CONFIG = {
  defaultSize: MODAL_SIZES.MEDIUM,
  closeOnOverlay: true,
  animationDuration: 300,
};

/**
 * Get modal size class
 * @param {string} size - Size value
 * @returns {string} CSS class
 */
export const getModalSizeClass = (size) => {
  const sizeMap = {
    [MODAL_SIZES.SMALL]: 'small',
    [MODAL_SIZES.MEDIUM]: 'medium',
    [MODAL_SIZES.LARGE]: 'large',
  };
  return sizeMap[size] || sizeMap[MODAL_SIZES.MEDIUM];
};