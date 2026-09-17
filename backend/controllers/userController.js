const bcrypt = require('bcryptjs');
const prisma = require('../lib/prisma');
const { authenticate } = require('../middleware/authMiddleware');
const { sendPasswordNotification } = require('../services/mailService');

async function handleUsersRequest(req, res) {
  const user = await authenticate(req, res);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  try {
    if (req.method === 'GET') {
      // Check if client is requesting a specific user's publication history (for inspection)
      if (req.query.userPublicationsId) {
        const targetUserId = parseInt(req.query.userPublicationsId, 10);
        const targetUser = await prisma.user.findUnique({
          where: { id: targetUserId },
          select: { id: true, name: true, email: true, role: true, dept: true, facultyId: true, isArchived: true }
        });

        if (!targetUser) return res.status(404).json({ error: 'User not found' });

        const [journals, patents, conferences, fdps, books, chapters] = await Promise.all([
          prisma.journal.findMany({ where: { submittedById: targetUserId }, orderBy: { id: 'desc' } }),
          prisma.patent.findMany({ where: { submittedById: targetUserId }, orderBy: { id: 'desc' } }),
          prisma.conference.findMany({ where: { submittedById: targetUserId }, orderBy: { id: 'desc' } }),
          prisma.fDP.findMany({ where: { submittedById: targetUserId }, orderBy: { id: 'desc' } }),
          prisma.book.findMany({ where: { submittedById: targetUserId }, orderBy: { id: 'desc' } }),
          prisma.bookChapter.findMany({ where: { submittedById: targetUserId }, orderBy: { id: 'desc' } })
        ]);

        return res.json({
          user: targetUser,
          publications: { journals, patents, conferences, fdps, books, chapters }
        });
      }

      // Filter by archiving status
      const whereClause = {};
      if (req.query.archivedOnly === 'true' || req.query.action === 'archived') {
        whereClause.isArchived = true;
      } else if (req.query.includeArchived !== 'true') {
        whereClause.NOT = { isArchived: true };
      }

      let users;
      try {
        users = await prisma.user.findMany({
          where: whereClause,
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            dept: true,
            facultyId: true,
            isArchived: true,
            createdAt: true,
            faculty: {
              include: {
                qualifications: true,
                deptDesigs: true
              }
            }
          },
          orderBy: { id: 'asc' }
        });
      } catch (prismaErr) {
        if (prismaErr.message && prismaErr.message.includes('isArchived')) {
          let sql = `SELECT id, name, email, role, dept, facultyId, isArchived, createdAt FROM User`;
          if (req.query.archivedOnly === 'true' || req.query.action === 'archived') {
            sql += ` WHERE isArchived = 1`;
          } else if (req.query.includeArchived !== 'true') {
            sql += ` WHERE isArchived = 0 OR isArchived IS NULL`;
          }
          sql += ` ORDER BY id ASC`;
          const rawUsers = await prisma.$queryRawUnsafe(sql);
          users = rawUsers.map(u => ({
            ...u,
            isArchived: Boolean(u.isArchived),
            faculty: null
          }));
        } else {
          throw prismaErr;
        }
      }

      const serializedUsers = users.map(u => {
        if (u.faculty && u.faculty.oldFacultyId) {
          u.faculty.oldFacultyId = u.faculty.oldFacultyId.toString();
        }
        return u;
      });
      return res.json(serializedUsers);
    }

    if (user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

    if (req.method === 'POST') {
      const { action } = req.body;

      if (action === 'bulk') {
        const { users: bulkUsers } = req.body;
        if (!Array.isArray(bulkUsers)) {
          return res.status(400).json({ error: 'Users list must be an array' });
        }

        const createdUsers = [];
        const failedUsers = [];

        for (const u of bulkUsers) {
          try {
            const { name, email, password, role, dept, facultyId: providedFacultyId } = u;

            if (!name || !email || !password || !dept) {
              throw new Error('Name, email, password, and department are required');
            }

            const allowedDomain = email.endsWith('@bpitindia.edu.in');
            if (!allowedDomain) {
              throw new Error('Email must be in bpitindia.edu.in domain');
            }

            const existing = await prisma.user.findUnique({ where: { email } });
            if (existing) {
              throw new Error('Email already exists');
            }

            let facultyId;
            if (providedFacultyId && providedFacultyId.trim()) {
              const formatted = providedFacultyId.trim().toUpperCase();
              if (!/^[A-Z0-9]+-\d{3}$/.test(formatted)) {
                throw new Error('Faculty ID must be in format DEPT-001 (e.g. IT-001, CSE-023)');
              }
              const idConflict = await prisma.user.findUnique({ where: { facultyId: formatted } });
              if (idConflict) {
                throw new Error('Faculty ID already exists: ' + formatted);
              }
              facultyId = formatted;
            } else {
              const prefix = (dept || 'FAC').toUpperCase();
              let deptCount = await prisma.user.count({ where: { dept } });
              const batchCount = createdUsers.filter(x => x.dept === dept).length;
              let actualCount = deptCount + batchCount + 1;
              facultyId = prefix + '-' + actualCount.toString().padStart(3, '0');

              let existing2 = await prisma.user.findUnique({ where: { facultyId } }) || createdUsers.find(x => x.facultyId === facultyId);
              while (existing2) {
                actualCount++;
                facultyId = prefix + '-' + actualCount.toString().padStart(3, '0');
                existing2 = await prisma.user.findUnique({ where: { facultyId } }) || createdUsers.find(x => x.facultyId === facultyId);
              }
            }

            const hashed = await bcrypt.hash(password, 10);
            const newUser = await prisma.user.create({
              data: { name, email, password: hashed, role: role || 'faculty', dept, facultyId }
            });

            createdUsers.push({
              id: newUser.id,
              name: newUser.name,
              email: newUser.email,
              role: newUser.role,
              dept: newUser.dept,
              facultyId: newUser.facultyId,
              isArchived: newUser.isArchived
            });
          } catch (err) {
            failedUsers.push({ email: u.email || 'Unknown', reason: err.message });
          }
        }

        return res.json({
          success: true,
          created: createdUsers.length,
          failed: failedUsers,
          addedUsers: createdUsers
        });
      }

      // Default single user creation logic
      const { name, email, password, role, dept, facultyId: providedFacultyId } = req.body;
      const allowedDomain = email && email.endsWith('@bpitindia.edu.in');
      if (!allowedDomain) {
        return res.status(400).json({ error: 'Email must be in bpitindia.edu.in domain' });
      }
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) return res.status(400).json({ error: 'Email already exists' });

      let facultyId;
      if (providedFacultyId && providedFacultyId.trim()) {
        const formatted = providedFacultyId.trim().toUpperCase();
        if (!/^[A-Z0-9]+-\d{3}$/.test(formatted)) {
          return res.status(400).json({ error: 'Faculty ID must be in format DEPT-001 (e.g. IT-001, CSE-023)' });
        }
        const idConflict = await prisma.user.findUnique({ where: { facultyId: formatted } });
        if (idConflict) return res.status(400).json({ error: 'Faculty ID already exists: ' + formatted });
        facultyId = formatted;
      } else {
        const deptCount = await prisma.user.count({ where: { dept } });
        const prefix = (dept || 'FAC').toUpperCase();
        facultyId = prefix + '-' + (deptCount + 1).toString().padStart(3, '0');
        let existing2 = await prisma.user.findUnique({ where: { facultyId } });
        let attempt = deptCount + 2;
        while (existing2) {
          facultyId = prefix + '-' + attempt.toString().padStart(3, '0');
          existing2 = await prisma.user.findUnique({ where: { facultyId } });
          attempt++;
        }
      }

      const hashed = await bcrypt.hash(password, 10);
      const newUser = await prisma.user.create({ data: { name, email, password: hashed, role, dept, facultyId } });
      return res.json({ id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, dept: newUser.dept, facultyId: newUser.facultyId, isArchived: newUser.isArchived });
    }

    if (req.method === 'PUT') {
      const { id, name, role, dept, facultyId, password, action, isArchived } = req.body;
      if (!id) return res.status(400).json({ error: 'User id required' });
      const existing = await prisma.user.findUnique({ where: { id: Number(id) } });
      if (!existing) return res.status(404).json({ error: 'User not found' });

      // Handle explicit restoration / unarchiving action
      if (action === 'restore' || isArchived === false) {
        let restored;
        try {
          restored = await prisma.user.update({
            where: { id: Number(id) },
            data: { isArchived: false }
          });
        } catch (err) {
          await prisma.$executeRawUnsafe(`UPDATE User SET isArchived = 0 WHERE id = ${Number(id)}`);
          restored = await prisma.user.findUnique({ where: { id: Number(id) } });
        }
        return res.json({ ok: true, message: 'User restored successfully', user: restored });
      }

      const dataToUpdate = {};
      if (typeof isArchived === 'boolean') dataToUpdate.isArchived = isArchived;
      if (name) dataToUpdate.name = name;
      if (role) dataToUpdate.role = role;
      if (dept) dataToUpdate.dept = dept;
      if (facultyId) {
        const formatted = facultyId.trim().toUpperCase();
        if (!/^[A-Z0-9]+-\d{3}$/.test(formatted)) {
          return res.status(400).json({ error: 'Faculty ID must be in format DEPT-001 (e.g. IT-001, CSE-023)' });
        }
        const idConflict = await prisma.user.findFirst({
          where: { facultyId: formatted, NOT: { id: Number(id) } }
        });
        if (idConflict) {
          return res.status(400).json({ error: 'Faculty ID already exists: ' + formatted });
        }
        dataToUpdate.facultyId = formatted;
      }
      if (password) {
        dataToUpdate.password = await bcrypt.hash(password, 10);
      }

      const updated = await prisma.user.update({ where: { id: Number(id) }, data: dataToUpdate });

      if (dept) {
        try {
          await prisma.faculty.updateMany({
            where: { userId: Number(id) },
            data: { presentDept: dept }
          });
          const userIdNum = Number(id);
          await prisma.journal.updateMany({ where: { submittedById: userIdNum }, data: { department: dept } });
          await prisma.patent.updateMany({ where: { submittedById: userIdNum }, data: { department: dept } });
          await prisma.conference.updateMany({ where: { submittedById: userIdNum }, data: { department: dept } });
          await prisma.fDP.updateMany({ where: { submittedById: userIdNum }, data: { department: dept } });
          await prisma.bookChapter.updateMany({ where: { submittedById: userIdNum }, data: { department: dept } });
          await prisma.book.updateMany({ where: { submittedById: userIdNum }, data: { department: dept } });
        } catch (e) {
          console.error('Error syncing faculty presentDept and publications:', e);
        }
      }

      if (password) {
        try {
          await sendPasswordNotification(updated.email, updated.name, password);
        } catch (e) {
          console.error('Password notification email failed:', e);
        }
      }
      return res.json({ id: updated.id, name: updated.name, email: updated.email, role: updated.role, dept: updated.dept, facultyId: updated.facultyId, isArchived: updated.isArchived });
    }

    if (req.method === 'DELETE') {
      const id = parseInt(req.query.id, 10);
      if (!id) return res.status(400).json({ error: 'Valid user ID required' });

      // Permanent hard deletion requested explicitly
      if (req.query.permanent === 'true') {
        await prisma.user.delete({ where: { id } });
        return res.json({ ok: true, permanent: true, message: 'User permanently deleted' });
      }

      // Default: Soft delete (Archive user and preserve publications)
      try {
        await prisma.user.update({
          where: { id },
          data: { isArchived: true }
        });
      } catch (err) {
        await prisma.$executeRawUnsafe(`UPDATE User SET isArchived = 1 WHERE id = ${id}`);
      }
      return res.json({ ok: true, softDelete: true, message: 'User archived (soft deleted). Publications preserved.' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    console.error('Users API error:', e);
    return res.status(500).json({ error: 'Server error: ' + e.message });
  }
}

module.exports = {
  handleUsersRequest
};
