const { handleDeptRequest } = require('../../backend/controllers/deptController');

module.exports = async function handler(req, res) {
  return handleDeptRequest(req, res);
};