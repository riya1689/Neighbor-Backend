/**
 * Runs Prisma with backend/.env applied with override: true so a machine-level
 * DATABASE_URL (e.g. Windows user env pointing at localhost) cannot shadow the project.
 */
const path = require("path");
const { config } = require("dotenv");
const { spawnSync } = require("child_process");

const root = path.resolve(__dirname, "..");

config({ path: path.join(root, ".env"), override: true });

const prismaArgs = process.argv.slice(2);
const result = spawnSync(
  "pnpm",
  ["exec", "prisma", ...prismaArgs],
  {
    cwd: root,
    stdio: "inherit",
    env: process.env,
    shell: true
  }
);

process.exit(result.status === null ? 1 : result.status);
