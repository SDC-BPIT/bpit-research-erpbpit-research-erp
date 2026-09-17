const { handleUsersRequest } = require('../../backend/controllers/userController');

module.exports = async function handler(req, res) {
  return handleUsersRequest(req, res);
};