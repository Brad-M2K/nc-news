const express = require("express");
const {
  articlesRouter,
  topicsRouter,
  usersRouter,
  commentsRouter,
} = require("./index.js");
const { getApi } = require("../controllers/index");
const apiRouter = express.Router();

apiRouter.get("/", getApi);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
