const prisma = require('../lib/prisma');
const { getTokenFromRequest, verifyToken, clearTokenCookie } = require('../lib/auth');

async function authenticate(req, res) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) return null;

    let payload;
    try {
      payload = verifyToken(token);
    } catch (e) {
      if (res && !req.headers.authorization) clearTokenCookie(res);
      return null;
    }

    if (!payload || (!payload.id && payload.id !== 0)) return null;

    const userId = typeof payload.id === 'string' ? parseInt(payload.id, 10) : payload.id;
    if (!Number.isInteger(userId)) return null;

    const dbUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!dbUser) {
      if (res && !req.headers.authorization) clearTokenCookie(res);
      return null;
    }

    return {
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      role: dbUser.role,
      dept: dbUser.dept,
      facultyId: dbUser.facultyId,
      isArchived: dbUser.isArchived
    };
  } catch (e) {
    return null;
  }
}

module.exports = {
  authenticate
};
