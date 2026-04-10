import "./config/env.js";
import app from "./app.js";
import prisma from "./config/prisma.js";
import { PORT } from "./config/env.js";

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

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
