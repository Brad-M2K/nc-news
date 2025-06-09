const express = require("express");
const { getUsers } = require("../controllers/index");

const usersRouter = express.Router();

usersRouter.get("/", getUsers);

module.exports = usersRouter;
