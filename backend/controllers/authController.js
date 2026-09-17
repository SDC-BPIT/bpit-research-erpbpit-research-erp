const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const prisma = require('../lib/prisma');
const { signToken, verifyToken, getTokenFromRequest, setTokenCookie, clearTokenCookie } = require('../lib/auth');
const { mailTransporter, sendResetLink } = require('../services/mailService');

async function handleLogin(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    let isArchived = user.isArchived;
    if (typeof isArchived === 'undefined') {
      try {
        const rows = await prisma.$queryRawUnsafe(`SELECT isArchived FROM User WHERE id = ${user.id}`);
        if (rows && rows[0]) isArchived = Boolean(rows[0].isArchived);
      } catch (err) {}
    }

    if (isArchived) {
      return res.status(403).json({ error: 'Account has been archived/deactivated. Please contact administrator.' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = signToken({ id: user.id, name: user.name, email: user.email, role: user.role, dept: user.dept });
    setTokenCookie(res, token);
    return res.json({ token, id: user.id, name: user.name, email: user.email, role: user.role, dept: user.dept });
  } catch (e) {
    console.error('Login error:', e);
    return res.status(500).json({ error: 'Server error: ' + e.message });
  }
}

async function handleLogout(req, res) {
  clearTokenCookie(res);
  return res.json({ ok: true });
}

async function handleMe(req, res) {
  const token = getTokenFromRequest(req);
  if (!token) {
    clearTokenCookie(res);
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const user = verifyToken(token);
  if (!user) {
    clearTokenCookie(res);
    return res.status(401).json({ error: 'Invalid token' });
  }

  const dbUser = await prisma.user.findUnique({ where: { id: user.id }, select: { isArchived: true } });
  if (dbUser && dbUser.isArchived) {
    clearTokenCookie(res);
    return res.status(403).json({ error: 'Account has been archived/deactivated' });
  }

  return res.json(user);
}

async function handleForgotPassword(req, res) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    await prisma.user.update({
      where: { email },
      data: { resetToken, resetTokenExpiry }
    });

    if (mailTransporter) {
      await sendResetLink(email, user.name, resetToken);
      return res.json({ message: 'Reset link sent to email' });
    }

    console.log(`Reset link: http://localhost:3000/reset-password?token=${resetToken}`);
    return res.json({ message: 'Reset link generated (check console for demo)', resetToken });
  } catch (e) {
    console.error('Forgot password error:', e);
    return res.status(500).json({ error: 'Server error: ' + e.message });
  }
}

async function handleResetPassword(req, res) {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ error: 'Token and new password required' });

    const user = await prisma.user.findFirst({
      where: { resetToken: token, resetTokenExpiry: { gt: new Date() } }
    });

    if (!user) return res.status(400).json({ error: 'Invalid or expired token' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword, resetToken: null, resetTokenExpiry: null }
    });

    return res.json({ message: 'Password reset successfully' });
  } catch (e) {
    console.error('Reset password error:', e);
    return res.status(500).json({ error: 'Server error: ' + e.message });
  }
}

async function handleDemoUsers(req, res) {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, dept: true }
    });
    return res.json(users);
  } catch (e) {
    console.error('Demo users error:', e);
    return res.status(500).json({ error: 'Server error: ' + e.message });
  }
}

module.exports = {
  handleLogin,
  handleLogout,
  handleMe,
  handleForgotPassword,
  handleResetPassword,
  handleDemoUsers
};
