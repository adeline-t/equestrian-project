/**
 * UI Constants - Unified
 * Toutes les couleurs sont dans base.css
 */

/* ============================================
   MODAL
   ============================================ */

export const MODAL_SIZES = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
  XLARGE: 'xlarge',
};

/* ============================================
   CARD STYLES
   ============================================ */

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

/* ============================================
   TEXT STYLES
   ============================================ */

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

export function getSlotLayout(duration) {
  if (duration <= 59) return 'ultra-compact';
  if (duration <= 60) return 'compact';
  if (duration <= 90) return 'medium';
  return 'full';
}
