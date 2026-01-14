/**
 * Domain: Horses (aligné DB)
 */
export const HORSE_TYPES = { PONY: 'pony', HORSE: 'horse' };
export const HORSE_KIND_LABELS = {
  [HORSE_TYPES.PONY]: {
    value: HORSE_TYPES.PONY,
    label: 'Poney',
    color: '#ed64a6',
    gradient: 'var(--gradient-pony)',
    badgeClass: 'badge-pony',
  },
  [HORSE_TYPES.HORSE]: {
    value: HORSE_TYPES.HORSE,
    label: 'Cheval',
    color: '#4299e1',
    gradient: 'var(--gradient-info)',
    badgeClass: 'badge-horse',
  },
};
export const getHorseKindLabel = (k) => HORSE_KIND_LABELS[k]?.label || k;
export const HORSE_KINDS = Object.values(HORSE_TYPES);

export const OWNER_TYPES = {
  LAURY: 'laury',
  PRIVATE_OWNER: 'private_owner',
  CLUB: 'club',
  OTHER: 'other',
};
export const OWNER_TYPE_LABELS = {
  [OWNER_TYPES.LAURY]: { value: OWNER_TYPES.LAURY, label: 'Laury' },
  [OWNER_TYPES.PRIVATE_OWNER]: { value: OWNER_TYPES.PRIVATE_OWNER, label: 'Propriétaire' },
  [OWNER_TYPES.CLUB]: { value: OWNER_TYPES.CLUB, label: 'Club' },
  [OWNER_TYPES.OTHER]: { value: OWNER_TYPES.OTHER, label: 'Autre' },
};
export const getOwnerTypeLabel = (t) => OWNER_TYPE_LABELS[t]?.label || t;
