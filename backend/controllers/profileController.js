const prisma = require('../lib/prisma');
const { authenticate } = require('../middleware/authMiddleware');

async function handleProfileRequest(req, res) {
  const user = await authenticate(req, res);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const userId = parseInt(user.id, 10);
  if (!userId) return res.status(401).json({ error: 'Invalid user context' });

  if (req.method === 'GET') {
    try {
      let targetUserId = userId;
      const isAdmin = (user.role || '').toLowerCase().trim() === 'admin';
      if (isAdmin && req.query.userId) {
        const parsed = parseInt(req.query.userId, 10);
        if (parsed) targetUserId = parsed;
      }

      const profile = await prisma.faculty.findUnique({
        where: { userId: targetUserId },
        include: {
          qualifications: true,
          deptDesigs: true,
          user: {
            select: { id: true, name: true, email: true, role: true, dept: true, facultyId: true }
          }
        }
      });

      if (!profile) {
        const targetUser = await prisma.user.findUnique({
          where: { id: targetUserId },
          select: { id: true, name: true, email: true, role: true, dept: true, facultyId: true }
        });
        return res.json({ ok: true, profile: null, user: targetUser });
      }

      const serialized = {
        ...profile,
        oldFacultyId: profile.oldFacultyId ? profile.oldFacultyId.toString() : null
      };
      return res.json({ ok: true, profile: serialized, user: profile.user, ...serialized });
    } catch (e) {
      console.error('Error fetching profile:', e);
      return res.status(500).json({ error: 'Server error: ' + e.message });
    }
  }

  if (req.method === 'PUT') {
    try {
      const d = req.body || {};

      const parseDate = (val) => val ? new Date(val).toISOString() : null;
      const parseBool = (val) => val === true || val === 'true' || val === 'Yes';
      const parseBigInt = (val) => val ? BigInt(val) : null;

      const firstName = d.firstName || user.name || 'User';

      // PAN Format Validation
      if (d.panNo && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(d.panNo.trim())) {
        return res.status(400).json({ error: 'Invalid PAN No. format (e.g. ABCDE1234F)' });
      }

      // Mobile Format Validation
      if (d.mobile && !/^[6-9]\d{9}$/.test(d.mobile.trim())) {
        return res.status(400).json({ error: 'Invalid Mobile No. (Must be 10 digits starting with 6-9)' });
      }

      const data = {
        title: d.title || null,
        firstName,
        middleName: d.middleName || null,
        lastName: d.lastName || null,
        gender: d.gender || null,
        dob: parseDate(d.dob),
        placeOfBirth: d.placeOfBirth || null,
        category: d.category || null,
        doj: parseDate(d.doj),
        dor: parseDate(d.dor),
        mobile: d.mobile || null,
        email: d.email || null,
        nationality: d.nationality || null,
        aadhaarNo: d.aadhaarNo || null,
        panNo: d.panNo || null,
        apaarFacultyId: d.apaarFacultyId || null,
        bloodGroup: d.bloodGroup || null,
        highestDegree: d.highestDegree || null,
        university: d.university || null,
        presentAddrHNoFloor: d.presentAddrHNoFloor || null,
        presentAddrStreetArea: d.presentAddrStreetArea || null,
        presentAddrDistrict: d.presentAddrDistrict || null,
        presentAddrCity: d.presentAddrCity || null,
        presentAddrCountry: d.presentAddrCountry || null,
        presentAddrPin: d.presentAddrPin || null,
        permanentAddrHNoFloor: d.permanentAddrHNoFloor || null,
        permanentAddrStreetArea: d.permanentAddrStreetArea || null,
        permanentAddrDistrict: d.permanentAddrDistrict || null,
        permanentAddrCity: d.permanentAddrCity || null,
        permanentAddrCountry: d.permanentAddrCountry || null,
        permanentAddrPin: d.permanentAddrPin || null,
        presentDesig: d.presentDesig || null,
        presentDept: d.presentDept || null,
        desigAtJoiningInst: d.desigAtJoiningInst || null,
        dateDesignatedProfAssocProf: parseDate(d.dateDesignatedProfAssocProf),
        courseId: d.courseId || null,
        specialization: d.specialization || null,
        experienceYearsCurrInst: d.experienceYearsCurrInst || null,
        natureOfAssociation: d.natureOfAssociation || null,
        contractType: d.contractType || null,
        currentlyAssociated: d.currentlyAssociated || null,
        dateOfLeaving: parseDate(d.dateOfLeaving),
        isOldFaculty: parseBool(d.isOldFaculty),
        oldFacultyId: parseBigInt(d.oldFacultyId),
        fatherName: d.fatherName || null,
        motherName: d.motherName || null,
        spouseName: d.spouseName || null,
        isFyCommonFaculty: parseBool(d.isFyCommonFaculty),
        fyCommonSubject: d.fyCommonSubject || null,
        facultyPhoto: d.facultyPhoto || null,
        facultySign: d.facultySign || null,
      };

      const profile = await prisma.faculty.upsert({
        where: { userId },
        update: data,
        create: {
          userId,
          ...data
        },
        include: {
          qualifications: true,
          deptDesigs: true
        }
      });

      const serialized = {
        ...profile,
        oldFacultyId: profile.oldFacultyId ? profile.oldFacultyId.toString() : null
      };

      return res.json({ ok: true, profile: serialized });
    } catch (e) {
      console.error('Error updating profile:', e);
      return res.status(500).json({ error: 'Server error: ' + e.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

module.exports = {
  handleProfileRequest
};
