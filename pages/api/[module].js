const { handleModuleRequest } = require('../../backend/controllers/moduleController');

export default async function handler(req, res) {
  return handleModuleRequest(req, res);
}