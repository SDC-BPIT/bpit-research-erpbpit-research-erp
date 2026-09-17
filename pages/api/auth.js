const {
  handleLogin,
  handleLogout,
  handleMe,
  handleForgotPassword,
  handleResetPassword,
  handleDemoUsers
} = require('../../backend/controllers/authController');

module.exports = async function handler(req, res) {
  const action = req.query.action;

  if (action === 'login' && req.method === 'POST') {
    return handleLogin(req, res);
  }

  if (action === 'logout' && req.method === 'POST') {
    return handleLogout(req, res);
  }

  if (action === 'me' && req.method === 'GET') {
    return handleMe(req, res);
  }

  if (action === 'forgot-password' && req.method === 'POST') {
    return handleForgotPassword(req, res);
  }

  if (action === 'reset-password' && req.method === 'POST') {
    return handleResetPassword(req, res);
  }

  if (action === 'demo-users' && req.method === 'GET') {
    return handleDemoUsers(req, res);
  }

  return res.status(404).json({ error: 'Not found' });
};