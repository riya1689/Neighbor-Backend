const { PrismaClient } = require("@prisma/client");

// Create a single Prisma client instance for the process.
// Prisma connects lazily; connection happens when queries run.
const prisma = new PrismaClient();

module.exports = prisma;

