const { handleDoiRequest } = require('../../backend/controllers/doiController');

module.exports = async function handler(req, res) {
  return handleDoiRequest(req, res);
};
