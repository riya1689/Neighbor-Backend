import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly find the root directory
const rootDir = path.resolve(__dirname, "../../");
const envPath = path.join(rootDir, ".env");

// 🛡️ Safety Check: Does the file even exist where we think it does?
if (!fs.existsSync(envPath)) {
  console.error(`❌ ERROR: .env file not found at: ${envPath}`);
} else {
  const result = dotenv.config({ path: envPath });
  if (result.error) {
    console.error("❌ ERROR: Failed to parse .env file:", result.error);
  }
}

/**
 * Ensures Neon / cloud PostgreSQL URLs use TLS.
 */
export function ensureDatabaseUrlForCloudPostgres(urlString) {
  if (!urlString || typeof urlString !== "string") return urlString;
  const url = new URL(urlString.trim());
  url.searchParams.set("sslmode", "require");
  if (url.hostname.includes("pooler") && !url.searchParams.has("pgbouncer")) {
    url.searchParams.set("pgbouncer", "true");
  }
  return url.toString();
}

if (process.env.DATABASE_URL) {
  process.env.DATABASE_URL = ensureDatabaseUrlForCloudPostgres(process.env.DATABASE_URL);
}

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

export function getRequiredEnv(name) {
  const value = process.env[name];
  // Debug log to help you see what's happening in the terminal
  if (!value) {
    console.log(`🔍 Debug: Checking for ${name}... Result: MISSING`);
  }
  if (value === undefined || value === null || String(value).trim() === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return String(value);
}

export const DATABASE_URL = getRequiredEnv("DATABASE_URL");
export const JWT_SECRET = getRequiredEnv("JWT_SECRET");
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
export { PORT };

// import dotenv from "dotenv";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const envPath = path.resolve(__dirname, "../../.env");

// // Load environment variables from .env into `process.env`
// dotenv.config({ path: envPath });

// /**
//  * Ensures Neon / cloud PostgreSQL URLs use TLS. Mutates query params safely
//  * (supports long hostnames and arbitrary query strings; no length caps).
//  */
// export function ensureDatabaseUrlForCloudPostgres(urlString) {
//   if (!urlString || typeof urlString !== "string") {
//     return urlString;
//   }

//   const trimmed = urlString.trim();
//   if (!trimmed) {
//     return trimmed;
//   }

//   let url;
//   try {
//     url = new URL(trimmed);
//   } catch {
//     const sep = trimmed.includes("?") ? "&" : "?";
//     let next = trimmed;
//     if (/[?&]sslmode=/i.test(next)) {
//       next = next.replace(/([?&])sslmode=[^&]*/gi, "$1sslmode=require");
//     } else {
//       next = `${next}${sep}sslmode=require`;
//     }
//     try {
//       url = new URL(next);
//     } catch {
//       return next;
//     }
//   }

//   url.searchParams.set("sslmode", "require");

//   // Neon pooler (PgBouncer transaction mode): Prisma needs this to avoid
//   // exhausting connections and to use the pooler correctly.
//   if (url.hostname.includes("pooler") && !url.searchParams.has("pgbouncer")) {
//     url.searchParams.set("pgbouncer", "true");
//   }

//   return url.toString();
// }

// if (process.env.DATABASE_URL) {
//   process.env.DATABASE_URL = ensureDatabaseUrlForCloudPostgres(
//     process.env.DATABASE_URL
//   );
// }

// const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

// /**
//  * Returns the raw env value if set. No max length — safe for long Neon URLs.
//  */
// export function getRequiredEnv(name) {
//   const value = process.env[name];
//   if (value === undefined || value === null || String(value).trim() === "") {
//     throw new Error(`Missing required environment variable: ${name}`);
//   }
//   return String(value);
// }

// export const DATABASE_URL = getRequiredEnv("DATABASE_URL");
// export const JWT_SECRET = getRequiredEnv("JWT_SECRET");
// export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
// export { PORT };
