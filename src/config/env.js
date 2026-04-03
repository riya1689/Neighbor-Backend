const dotenv = require("dotenv");

// Load environment variables from .env into `process.env`
dotenv.config();

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

function getRequiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

// Prisma uses this variable (referenced in `prisma/schema.prisma`)
const DATABASE_URL = process.env.DATABASE_URL;

module.exports = {
  PORT,
  DATABASE_URL,
  getRequiredEnv
};

