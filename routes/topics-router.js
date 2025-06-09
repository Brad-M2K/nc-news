const express = require("express");
const { getTopics } = require("../controllers/index");

const topicsRouter = express.Router();

topicsRouter.get("/", getTopics);

module.exports = topicsRouter;
