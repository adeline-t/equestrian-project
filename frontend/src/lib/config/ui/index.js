/**
 * UI Configuration - Main Export
 */

export * from './constants';
export * from './modal';
export * from './validation';
export * from './cardStyles';

// Re-export for backward compatibility
export {
  MODAL_SIZES,
  DATE_FORMATS,
  TABLE_CONFIG,
  STATUS_COLORS,
  LOADING_STATES,
} from './constants';
export {
  MODAL_CONFIG,
  getModalSizeClass,
} from './modal';
export {
  VALIDATION_RULES,
  validateRule,
  getValidationRule,
} from './validation';
export {
  CARD_STYLES,
  TEXT_STYLES,
  LAYOUT_STYLES,
  getCardStyle,
  getTextStyle,
} from './cardStyles';