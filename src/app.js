const express = require("express");
const cors = require("cors");

const routes = require("./routes");
const notFound = require("./middleware/notFound");

const app = express();

// Security/UX defaults
app.use(cors());
app.use(express.json());

// API routes
app.use("/api", routes);

// 404 handler
app.use(notFound);

module.exports = app;

