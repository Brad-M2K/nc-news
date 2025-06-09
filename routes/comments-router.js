const express = require("express");
const { deleteCommentById } = require("../controllers/index");

const commentsRouter = express.Router();

// Only the delete route is handled here, as article comments are handled in articlesRouter
commentsRouter.delete("/:comment_id", deleteCommentById);

module.exports = commentsRouter;
