const fs = require('fs');
const path = require('path');
const base = path.join(__dirname, '../');

const getConfig = () => JSON.parse(fs.readFileSync(path.join(base, 'config.json'), 'utf8'));
const updateConfig = (cfg) => fs.writeFileSync(path.join(base, 'config.json'), JSON.stringify(cfg, null, 2), 'utf8');

/**
 * Check for administrator status against UID
 * 
 * @param {number} uid 
 */
const isAdmin = (uid) => {
  const cfg = getConfig();
  return cfg['admins']['users'].includes(uid);
};

/**
 * Add a UID to the administrator list
 * 
 * @param {number} uid 
 */
const addAdmin = (uid) => {
  const cfg = readConfig();
  if (isAdmin(uid)) return true;

  cfg['admin']['users'].push(uid);
  updateConfig(cfg);
  return true;
}

/**
 * Remove a UID from the administrator list
 * 
 * @param {number} uid 
 */
const removeAdmin = (uid) => {
  const cfg = readConfig();
  if (!isAdmin(uid)) return false;

  cfg['admin']['users'] = [...cfg['admin']['users']].filter((user) => user !== uid);
  updateConfig(cfg);
  return true;
}

module.exports = {
  isAdmin,
  addAdmin,
  removeAdmin
};
