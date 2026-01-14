/**
 * Domain: Riders (aligné DB)
 */
export const RIDER_TYPES = { OWNER: 'owner', CLUB: 'club', BOARDER: 'boarder' };
export const RIDER_TYPE_LABELS = {
  [RIDER_TYPES.OWNER]: {
    value: RIDER_TYPES.OWNER,
    label: 'Propriétaire',
    color: '#ed8936',
    badgeClass: 'badge-owner',
  },
  [RIDER_TYPES.CLUB]: {
    value: RIDER_TYPES.CLUB,
    label: 'Club',
    color: '#4299e1',
    badgeClass: 'badge-club',
  },
  [RIDER_TYPES.BOARDER]: {
    value: RIDER_TYPES.BOARDER,
    label: 'Pensionnaire',
    color: '#48bb78',
    badgeClass: 'badge-boarder',
  },
};
export const getRiderTypeLabel = (k) => RIDER_TYPE_LABELS[k]?.label || k;
