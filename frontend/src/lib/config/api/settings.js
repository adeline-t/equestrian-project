/**
 * API Settings Configuration
 */

// API settings
export const API_SETTINGS = {
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
  CACHE_DURATION: 300000, // 5 minutes
};

/**
 * Get API setting value
 * @param {string} key - Setting key
 * @param {*} defaultValue - Default value if key not found
 * @returns {*} Setting value
 */
export const getApiSetting = (key, defaultValue = null) => {
  return API_SETTINGS[key] ?? defaultValue;
};