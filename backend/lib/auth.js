const jwt = require('jsonwebtoken');
const { serialize } = require('cookie');

const SECRET = process.env.JWT_SECRET || 'bpit_erp_jwt_secret_2024';

function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch (e) {
    return null;
  }
}

function getTokenFromRequest(req) {
  if (!req || !req.headers) return null;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  const cookieHeader = req.headers.cookie || '';
  const match = cookieHeader.match(/erp_token=([^;]+)/);
  return match ? match[1] : null;
}

function setTokenCookie(res, token) {
  if (!res) return;
  res.setHeader('Set-Cookie', serialize('erp_token', token, {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax'
  }));
}

function clearTokenCookie(res) {
  if (!res) return;
  res.setHeader('Set-Cookie', serialize('erp_token', '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
    sameSite: 'lax'
  }));
}

module.exports = {
  SECRET,
  signToken,
  verifyToken,
  getTokenFromRequest,
  setTokenCookie,
  clearTokenCookie,
  // Helper for backward compatibility
  getUser: (req) => {
    const token = getTokenFromRequest(req);
    return token ? verifyToken(token) : null;
  }
};
