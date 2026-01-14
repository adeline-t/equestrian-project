/**
 * Helpers: ui
 */
import { CARD_STYLES, TEXT_STYLES, MODAL_SIZES } from '../config/ui.js';

export const getCardStyle = (layout) => ({
  ...CARD_STYLES.base,
  ...(CARD_STYLES[layout] || CARD_STYLES.standard),
});

export const getTextStyle = (layout, element) => {
  const layoutStyles = TEXT_STYLES[layout] || TEXT_STYLES.standard;
  return layoutStyles[element] || {};
};

export const getModalSizeClass = (size) => {
  const sizeMap = {
    [MODAL_SIZES.SMALL]: 'small',
    [MODAL_SIZES.MEDIUM]: 'medium',
    [MODAL_SIZES.LARGE]: 'large',
  };
  return sizeMap[size] || sizeMap[MODAL_SIZES.MEDIUM];
};
