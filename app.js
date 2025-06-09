const express = require("express");

const {
  psqlErrors,
  customErrors,
  serverErrors,
} = require("./error-middlewear");
const apiRouter = require("./routes/api-router.js");

const app = express();

//? ✨ Middleware for parsing JSON
app.use(express.json());

//* ENDPOINTS API JSON
app.use("/api", apiRouter);

//! ✨ Error-handling middleware
app.use(psqlErrors);
app.use(customErrors);
app.use(serverErrors);

module.exports = app;
