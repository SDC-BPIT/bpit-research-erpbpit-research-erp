const prisma = require('../lib/prisma');
const { authenticate } = require('../middleware/authMiddleware');

async function handleDeptRequest(req, res) {
  const user = await authenticate(req, res);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  try {
    if (req.method === 'GET') {
      const depts = await prisma.department.findMany({ orderBy: { name: 'asc' } });
      return res.json(depts.map(function(d) { return d.name; }));
    }

    if (user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

    if (req.method === 'POST') {
      const name = req.body.name.trim().toUpperCase();
      const existing = await prisma.department.findUnique({ where: { name } });
      if (existing) return res.status(400).json({ error: 'Branch already exists' });
      await prisma.department.create({ data: { name } });
      return res.json({ ok: true, name });
    }

    if (req.method === 'DELETE') {
      const name = req.query.name;
      await prisma.department.delete({ where: { name } });
      return res.json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    console.error('Departments API error:', e);
    return res.status(500).json({ error: 'Server error: ' + e.message });
  }
}

module.exports = {
  handleDeptRequest
};
