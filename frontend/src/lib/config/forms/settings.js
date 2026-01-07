/**
 * Default Form Settings
 */

// Default form settings
export const FORM_SETTINGS = {
  AUTO_SAVE: false,
  CONFIRM_ON_LEAVE: true,
  RESET_ON_SUCCESS: false,
};

/**
 * Get form setting value
 * @param {string} key - Setting key
 * @param {*} defaultValue - Default value if key not found
 * @returns {*} Setting value
 */
export const getFormSetting = (key, defaultValue = null) => {
  return FORM_SETTINGS[key] ?? defaultValue;
};