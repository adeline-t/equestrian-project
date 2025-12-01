/**
 * Input Sanitization Utilities
 * Sanitizes and validates user input to prevent security issues
 */

/**
 * Sanitize a string by removing potentially dangerous characters
 * @param {string} input - Input string to sanitize
 * @param {Object} options - Sanitization options
 * @returns {string} Sanitized string
 */
export function sanitizeString(input, options = {}) {
  if (typeof input !== 'string') {
    return '';
  }

  let sanitized = input;

  // Trim whitespace by default
  if (options.trim !== false) {
    sanitized = sanitized.trim();
  }

  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '');

  // Remove control characters except newlines and tabs if allowed
  if (!options.allowNewlines) {
    sanitized = sanitized.replace(/[\x00-\x09\x0B-\x0C\x0E-\x1F\x7F]/g, '');
  } else {
    sanitized = sanitized.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');
  }

  // Limit length if specified
  if (options.maxLength) {
    sanitized = sanitized.substring(0, options.maxLength);
  }

  return sanitized;
}

/**
 * Sanitize an email address
 * @param {string} email - Email address to sanitize
 * @returns {string} Sanitized email in lowercase
 */
export function sanitizeEmail(email) {
  if (typeof email !== 'string') {
    return '';
  }

  return sanitizeString(email, { maxLength: 255 }).toLowerCase();
}

/**
 * Sanitize a phone number
 * @param {string} phone - Phone number to sanitize
 * @returns {string} Sanitized phone number
 */
export function sanitizePhone(phone) {
  if (typeof phone !== 'string') {
    return '';
  }

  // Remove all non-digit and non-plus characters
  let sanitized = phone.replace(/[^\d+\s()-]/g, '');
  
  // Trim and limit length
  sanitized = sanitized.trim().substring(0, 50);

  return sanitized;
}

/**
 * Sanitize a name (person, horse, etc.)
 * @param {string} name - Name to sanitize
 * @returns {string} Sanitized name
 */
export function sanitizeName(name) {
  if (typeof name !== 'string') {
    return '';
  }

  // Allow letters, spaces, hyphens, apostrophes
  let sanitized = sanitizeString(name, { maxLength: 255 });
  
  // Remove any remaining special characters except allowed ones
  sanitized = sanitized.replace(/[^a-zA-ZÀ-ÿ\s'-]/g, '');
  
  // Normalize multiple spaces to single space
  sanitized = sanitized.replace(/\s+/g, ' ');

  return sanitized.trim();
}

/**
 * Sanitize a date string
 * @param {string} date - Date string to sanitize
 * @returns {string|null} Sanitized date string or null if invalid
 */
export function sanitizeDate(date) {
  if (!date) {
    return null;
  }

  if (typeof date !== 'string') {
    return null;
  }

  // Basic date format validation (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return null;
  }

  // Verify it's a valid date
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    return null;
  }

  return date;
}

/**
 * Sanitize an integer ID
 * @param {any} id - ID to sanitize
 * @returns {number|null} Sanitized integer or null if invalid
 */
export function sanitizeId(id) {
  const parsed = parseInt(id, 10);
  
  if (isNaN(parsed) || parsed < 1) {
    return null;
  }

  return parsed;
}

/**
 * Sanitize an enum value
 * @param {string} value - Value to check
 * @param {Array} allowedValues - Array of allowed values
 * @returns {string|null} Value if valid, null otherwise
 */
export function sanitizeEnum(value, allowedValues) {
  if (typeof value !== 'string') {
    return null;
  }

  const sanitized = sanitizeString(value).toLowerCase();
  
  if (!allowedValues.includes(sanitized)) {
    return null;
  }

  return sanitized;
}

/**
 * Sanitize a complete rider object
 * @param {Object} rider - Rider data to sanitize
 * @returns {Object} Sanitized rider data
 */
export function sanitizeRiderData(rider) {
  return {
    name: sanitizeName(rider.name),
    phone: rider.phone ? sanitizePhone(rider.phone) : null,
    email: rider.email ? sanitizeEmail(rider.email) : null,
    activity_start_date: sanitizeDate(rider.activity_start_date),
    activity_end_date: sanitizeDate(rider.activity_end_date),
  };
}

/**
 * Sanitize a complete horse object
 * @param {Object} horse - Horse data to sanitize
 * @returns {Object} Sanitized horse data
 */
export function sanitizeHorseData(horse) {
  return {
    name: sanitizeName(horse.name),
    kind: sanitizeEnum(horse.kind, ['horse', 'pony']),
    activity_start_date: sanitizeDate(horse.activity_start_date),
    activity_end_date: sanitizeDate(horse.activity_end_date),
  };
}

/**
 * Sanitize association data
 * @param {Object} association - Association data to sanitize
 * @returns {Object} Sanitized association data
 */
export function sanitizeAssociationData(association) {
  return {
    rider_id: sanitizeId(association.rider_id),
    horse_id: sanitizeId(association.horse_id),
    association_start_date: sanitizeDate(association.association_start_date),
    association_end_date: sanitizeDate(association.association_end_date),
  };
}

/**
 * Remove undefined and null values from an object
 * @param {Object} obj - Object to clean
 * @returns {Object} Cleaned object
 */
export function removeEmptyValues(obj) {
  const cleaned = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== null && value !== '') {
      cleaned[key] = value;
    }
  }
  
  return cleaned;
}