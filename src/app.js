import express from "express";
import cors from "cors";

import routes from "./routes/index.js";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

// Security/UX defaults
app.use(cors());
app.use(express.json());

// API routes
app.use("/api", routes);

// 404 handler
app.use(notFound);

// Global error handler (Milestone 1)
app.use(errorHandler);

export default app;

