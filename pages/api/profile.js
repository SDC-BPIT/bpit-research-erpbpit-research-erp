const { handleProfileRequest } = require('../../backend/controllers/profileController');

module.exports = async function handler(req, res) {
  return handleProfileRequest(req, res);
};
