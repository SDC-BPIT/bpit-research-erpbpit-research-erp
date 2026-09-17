const prisma = require('../lib/prisma');
const { authenticate } = require('../middleware/authMiddleware');

const MODEL_MAP = {
  journals: 'journal',
  patents: 'patent',
  conferences: 'conference',
  fdp: 'fDP',
  bookchapters: 'bookChapter',
  books: 'book',
};

function sanitizePayload(body) {
  const sanitized = {};
  for (const [key, val] of Object.entries(body)) {
    if (key === 'id' || key === 'submittedById') {
      sanitized[key] = val;
    } else if (typeof val === 'number') {
      sanitized[key] = String(val);
    } else {
      sanitized[key] = val;
    }
  }
  return sanitized;
}

async function handleModuleRequest(req, res) {
  const user = await authenticate(req, res);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const moduleName = req.query.module;
  const modelKey = MODEL_MAP[moduleName];
  if (!modelKey) return res.status(404).json({ error: 'Module not found' });

  const model = prisma[modelKey];

  try {
    if (req.method === 'GET') {
      const userRole = (user.role || '').toLowerCase().trim();
      const where = userRole === 'faculty' ? { submittedById: user.id } : {};
      let records = await model.findMany({ where, orderBy: { id: 'desc' } });

      if (moduleName === 'journals') {
        records = await Promise.all(records.map(async (r) => {
          if (!r.department) {
            const usr = await prisma.user.findUnique({ where: { id: r.submittedById } });
            r.department = usr ? usr.dept : 'Unknown';
          }
          return r;
        }));
      }
      return res.json(records);
    }

    if (req.method === 'POST') {
      const body = Object.assign({}, req.body);
      delete body.id;
      body.submittedById = user.id;
      body.submittedByName = user.name;
      body.submittedAt = new Date().toISOString().split('T')[0];
      const record = await model.create({ data: sanitizePayload(body) });
      return res.json(record);
    }

    if (req.method === 'PUT') {
      const body = Object.assign({}, req.body);
      const id = parseInt(body.id, 10);
      delete body.id;
      delete body.submittedById;
      delete body.submittedByName;
      delete body.submittedAt;
      delete body._mod;
      const userRole = (user.role || '').toLowerCase().trim();
      if (userRole !== 'admin') {
        const existing = await model.findUnique({ where: { id } });
        if (!existing || existing.submittedById !== user.id) return res.status(403).json({ error: 'Forbidden' });
      }
      const record = await model.update({ where: { id }, data: sanitizePayload(body) });
      return res.json(record);
    }

    if (req.method === 'DELETE') {
      const id = parseInt(req.query.id, 10);
      const userRole = (user.role || '').toLowerCase().trim();
      if (userRole !== 'admin') {
        const existing = await model.findUnique({ where: { id } });
        if (!existing || existing.submittedById !== user.id) return res.status(403).json({ error: 'Forbidden' });
      }
      await model.delete({ where: { id } });
      return res.json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    console.error('API error:', e.message, '| Prisma code:', e.code, '| Module:', req.query.module);
    return res.status(500).json({ error: 'Server error: ' + e.message });
  }
}

module.exports = {
  handleModuleRequest
};
