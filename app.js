const express = require("express");
const cors = require('cors');

const {
  psqlErrors,
  customErrors,
  serverErrors,
} = require("./error-middlewear");
const apiRouter = require("./routes/api-router.js");

const app = express();

// Serve static files from the public directory
app.use(express.static("public"));

// CORS Policy
app.use(cors());

//? ✨ Middleware for parsing JSON
app.use(express.json());

//* ENDPOINTS API JSON
app.use("/api", apiRouter);

//! ✨ Error-handling middleware
app.use(psqlErrors);
app.use(customErrors);
app.use(serverErrors);

module.exports = app;
