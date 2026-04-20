import "./config/env.js";
import app from "./app.js";
import prisma from "./config/prisma.js";
import { PORT, SSL_STORE_ID } from "./config/env.js";
const server = app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Neighbo backend running on port ${PORT}`);
});

function shutdown(signal) {
  // eslint-disable-next-line no-console
  console.log(`${signal} received, closing server and database connections…`);
  server.close(() => {
    prisma.$disconnect().finally(() => process.exit(0));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);

  if (SSL_STORE_ID) {
    console.log(`💳 SSLCommerz: Connected (Mode: ${process.env.SSL_IS_SANDBOX === 'true' ? 'Sandbox' : 'Live'})`);
  }
});

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
