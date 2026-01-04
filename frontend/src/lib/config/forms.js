/**
 * Form Configuration Constants
 */

// Form field types
export const FIELD_TYPES = {
  TEXT: 'text',
  EMAIL: 'email',
  PHONE: 'phone',
  NUMBER: 'number',
  DATE: 'date',
  TIME: 'time',
  SELECT: 'select',
  TEXTAREA: 'textarea',
  CHECKBOX: 'checkbox',
  RADIO: 'radio',
};

// Form validation messages
export const VALIDATION_MESSAGES = {
  REQUIRED: 'Ce champ est requis',
  INVALID_EMAIL: 'Format d\'email invalide',
  INVALID_PHONE: 'Format de téléphone invalide',
  MIN_LENGTH: 'Ce champ doit contenir au moins {min} caractères',
  MAX_LENGTH: 'Ce champ ne peut pas dépasser {max} caractères',
  INVALID_DATE: 'Date invalide',
  INVALID_TIME: 'Heure invalide',
};

// Horse form configuration
export const HORSE_FORM_FIELDS = {
  name: {
    type: FIELD_TYPES.TEXT,
    label: 'Nom du cheval',
    required: true,
    maxLength: 100,
  },
  kind: {
    type: FIELD_TYPES.SELECT,
    label: 'Type de cheval',
    required: true,
    options: ['horse', 'pony'],
  },
  activity_start_date: {
    type: FIELD_TYPES.DATE,
    label: 'Date de début d\'activité',
    required: true,
  },
  activity_end_date: {
    type: FIELD_TYPES.DATE,
    label: 'Date de fin d\'activité',
    required: false,
  },
  is_owned_by: {
    type: FIELD_TYPES.SELECT,
    label: 'Propriétaire',
    required: true,
    options: ['Laury', 'Propriétaire', 'Club'],
  },
  owner_id: {
    type: FIELD_TYPES.SELECT,
    label: 'Cavalier propriétaire',
    required: false,
    dependsOn: 'is_owned_by',
    showWhen: 'Propriétaire',
  },
};

// Rider form configuration
export const RIDER_FORM_FIELDS = {
  name: {
    type: FIELD_TYPES.TEXT,
    label: 'Nom du cavalier',
    required: true,
    maxLength: 100,
  },
  email: {
    type: FIELD_TYPES.EMAIL,
    label: 'Email',
    required: false,
  },
  phone: {
    type: FIELD_TYPES.PHONE,
    label: 'Téléphone',
    required: false,
  },
  address: {
    type: FIELD_TYPES.TEXTAREA,
    label: 'Adresse',
    required: false,
    maxLength: 500,
  },
};

// Default form settings
export const FORM_SETTINGS = {
  AUTO_SAVE: false,
  CONFIRM_ON_LEAVE: true,
  RESET_ON_SUCCESS: false,
};