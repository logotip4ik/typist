/**
 * Retrieves land from user provided string and server whitelist
 * @param {string} land String provided by user
 * @param {string[]} whitelist Array of whitelisted lands
 * @param {string} defaultLand Land that will be used if land string is undefined or if land was not found if whitelist
 * @returns {string}
 */
export function getLand(land, whitelist, defaultLand) {
  if (typeof land === 'undefined' || land === null) land = defaultLand;

  const whitelisted = whitelist.indexOf(land);

  if (whitelisted !== -1) return whitelist[whitelisted];

  return defaultLand;
}
