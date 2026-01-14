/**
 * Helpers: utils
 */

/**
 * Build endpoint URL with parameters
 * @param {string} endpoint
 * @param {Object} params
 * @returns {string}
 */
export const buildEndpoint = (endpoint, params = {}) => {
  let url = endpoint;
  Object.keys(params).forEach((key) => {
    url = url.replace(`:${key}`, params[key]);
  });
  return url;
};
