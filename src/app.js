import express from "express";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";

import routes from "./routes/index.js";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";
import { globalLimiter } from "./middlewares/rateLimiter.js";
import { ALLOWED_ORIGINS } from "./config/env.js";

const app = express();

// Security/UX defaults
app.use(helmet());
app.use(globalLimiter);
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json({ limit: '10kb' }));
app.use(hpp());

// API routes
app.use("/api", routes);

// 404 handler
app.use(notFound);

// Global error handler (Milestone 1)
app.use(errorHandler);

export default app;

