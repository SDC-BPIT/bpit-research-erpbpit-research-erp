const { PrismaClient } = require('@prisma/client');

function getPrisma() {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  return global.prisma;
}

const prisma = getPrisma();

module.exports = prisma;
