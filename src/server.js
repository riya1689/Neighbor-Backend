import "./config/env.js";
import app from "./app.js";
import prisma from "./config/prisma.js";
import { PORT, SSL_STORE_ID, SSL_IS_SANDBOX } from "./config/env.js";

// 🚀 Only ONE listener for the whole app
const server = app.listen(PORT, () => {
  console.log(`🚀 Neighbo backend running on http://localhost:${PORT}`);

  // SSLCommerz Startup Check
  if (SSL_STORE_ID) {
    const mode = SSL_IS_SANDBOX ? 'Sandbox' : 'Live';
    console.log(`💳 SSLCommerz: Connected (Mode: ${mode})`);
  }
});

// Graceful Shutdown Logic
function shutdown(signal) {
  console.log(`\n${signal} received, closing server and database connections...`);
  server.close(() => {
    prisma.$disconnect().finally(() => {
      console.log("👋 Database disconnected. Goodbye!");
      process.exit(0);
    });
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));